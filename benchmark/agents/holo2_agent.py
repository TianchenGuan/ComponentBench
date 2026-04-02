"""
Holo2-30B-A3B pixel-only agent for ComponentBench.

Hcompany/Holo2-30B-A3B is a reasoning VLM. We use vLLM structured outputs
(JSON schema) to enforce a clean action format and avoid parsing free-form
reasoning text that might contain coordinate-like patterns.

Parsing strategy:
  1. Request structured JSON output via vLLM structured_outputs API.
  2. Coordinates are requested in BrowserGym 0-1000 space directly.
  3. Parse the returned JSON; no regex extraction needed.
  4. Fall back to regex-based parsing if structured output is unavailable.

Reference: https://huggingface.co/Hcompany/Holo2-30B-A3B
"""
from __future__ import annotations

import dataclasses
import json
import logging
import re
from typing import Any

import numpy as np
from PIL import Image

from browsergym.experiments import Agent

from .pixel_agent_base import (
    PixelAgentBase,
    PixelAgentBaseArgs,
    image_to_jpg_base64_url,
)

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# JSON schema for structured output
# ---------------------------------------------------------------------------
HOLO2_ACTION_SCHEMA = {
    "type": "object",
    "properties": {
        "thought": {
            "type": "string",
            "description": "Brief reasoning about what you see and what to do next",
        },
        "action_type": {
            "type": "string",
            "enum": ["click", "double_click", "type", "scroll", "drag", "key_press", "noop", "send_answer"],
            "description": "The type of action to perform",
        },
        "coordinate": {
            "type": "array",
            "items": {"type": "integer", "minimum": 0, "maximum": 1000},
            "minItems": 2,
            "maxItems": 2,
            "description": "Click/scroll position as [x, y] in 0-1000 normalized coordinates",
        },
        "text": {
            "type": "string",
            "description": "Text to type, or answer to send to user",
        },
        "direction": {
            "type": "string",
            "enum": ["up", "down", "left", "right"],
            "description": "Scroll direction",
        },
        "end_coordinate": {
            "type": "array",
            "items": {"type": "integer", "minimum": 0, "maximum": 1000},
            "minItems": 2,
            "maxItems": 2,
            "description": "End position for drag as [x, y] in 0-1000 normalized coordinates",
        },
        "key": {
            "type": "string",
            "description": "Key to press (e.g. 'Enter', 'Backspace', 'Tab', 'Control+a')",
        },
    },
    "required": ["action_type"],
    "additionalProperties": False,
}


# ---------------------------------------------------------------------------
# System prompt
# ---------------------------------------------------------------------------
HOLO2_SYSTEM_PROMPT = """\
You are a web GUI agent. Given a screenshot of a web page and a task description,
output the next action as a JSON object.

## Coordinate System
Use NORMALIZED coordinates in range 0-1000:
- (0, 0) = top-left corner
- (500, 500) = center of screen
- (1000, 1000) = bottom-right corner

## Available Actions

1. Click: {"action_type": "click", "coordinate": [x, y]}
2. Double-click: {"action_type": "double_click", "coordinate": [x, y]}
3. Type text: {"action_type": "type", "text": "hello world"}
4. Scroll: {"action_type": "scroll", "coordinate": [x, y], "direction": "down"}
5. Drag: {"action_type": "drag", "coordinate": [x1, y1], "end_coordinate": [x2, y2]}
6. Press key: {"action_type": "key_press", "key": "Enter"}
7. Wait: {"action_type": "noop"}
8. Report answer: {"action_type": "send_answer", "text": "your answer here"}

## Rules
- Include a brief "thought" field explaining your reasoning.
- Output EXACTLY ONE action per response.
- Coordinates must be integers 0-1000.
- Do NOT use upload_file actions.
"""


def holo2_json_to_browsergym(data: dict) -> str | None:
    """Convert a Holo2 structured JSON action to a BrowserGym action string."""
    action_type = data.get("action_type", "")

    if action_type == "click":
        coord = data.get("coordinate", [])
        if len(coord) != 2:
            return None
        return f"mouse_click({coord[0]}, {coord[1]})"

    if action_type == "double_click":
        coord = data.get("coordinate", [])
        if len(coord) != 2:
            return None
        return f"mouse_dblclick({coord[0]}, {coord[1]})"

    if action_type == "type":
        text = data.get("text", "")
        return f"keyboard_type({repr(text)})"

    if action_type == "scroll":
        coord = data.get("coordinate", [500, 500])
        direction = data.get("direction", "down").lower()
        delta_map = {"down": 3, "up": -3, "right": 3, "left": -3}
        dy = delta_map.get(direction, 3)
        if direction in ("left", "right"):
            return f"scroll({coord[0]}, {coord[1]}, {dy}, 0)"
        return f"scroll({coord[0]}, {coord[1]}, 0, {dy})"

    if action_type == "drag":
        coord = data.get("coordinate", [])
        end = data.get("end_coordinate", [])
        if len(coord) != 2 or len(end) != 2:
            return None
        return f"mouse_drag_and_drop({coord[0]}, {coord[1]}, {end[0]}, {end[1]})"

    if action_type == "key_press":
        key = data.get("key", "Enter")
        return f"keyboard_press({repr(key)})"

    if action_type == "noop":
        return "noop(1000)"

    if action_type == "send_answer":
        text = data.get("text", "")
        return f"send_msg_to_user({repr(text)})"

    logger.warning(f"Unknown Holo2 action_type: {action_type}")
    return None


def _try_parse_json_from_text(raw: str) -> dict | None:
    """Attempt to extract a JSON object from free-form text (fallback)."""
    # Try to find JSON block in markdown code fence
    m = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', raw, re.DOTALL)
    if m:
        try:
            return json.loads(m.group(1))
        except json.JSONDecodeError:
            pass

    # Try to find a JSON object directly
    m = re.search(r'\{[^{}]*"action_type"\s*:[^{}]*\}', raw, re.DOTALL)
    if m:
        try:
            return json.loads(m.group(0))
        except json.JSONDecodeError:
            pass

    # Last resort: try the entire text
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return None


# ---------------------------------------------------------------------------
# Agent class
# ---------------------------------------------------------------------------

class Holo2Agent(PixelAgentBase):
    """Holo2-30B-A3B pixel-only agent using structured JSON outputs."""

    def _build_messages(self, obs: dict) -> list[dict[str, Any]]:
        user_content: list[dict[str, Any]] = []

        # Goal
        user_content.append({"type": "text", "text": "# Task\n"})
        for part in obs.get("goal_object", []):
            if isinstance(part, dict) and "type" in part:
                user_content.append(part)
            else:
                user_content.append({"type": "text", "text": str(part)})

        # Screenshot
        screenshot = obs.get("screenshot")
        if screenshot is not None:
            user_content.append({"type": "text", "text": "\n# Current Screenshot\n"})
            user_content.append(self._build_image_content(screenshot))

        # History
        if self.action_history:
            user_content.append({"type": "text", "text": "\n# Recent Actions\n"})
            start = max(0, len(self.action_history) - self.max_steps_history)
            for i, act in enumerate(self.action_history[start:], start=start):
                user_content.append({"type": "text", "text": f"Step {i+1}: {act}\n"})

        return [
            {"role": "system", "content": HOLO2_SYSTEM_PROMPT},
            {"role": "user", "content": user_content},
        ]

    def get_action(self, obs: dict) -> tuple[str, dict]:
        """Override get_action to use structured outputs when possible."""
        assert obs.get("goal_object"), "Missing goal_object"

        messages = self._build_messages(obs)

        thinking: str | None = None
        action: str | None = None

        for attempt in range(3):
            try:
                response = self._send_structured_request(messages, json_schema=HOLO2_ACTION_SCHEMA)
            except Exception as e:
                logger.warning(f"Structured request failed (attempt {attempt+1}): {e}")
                response = self._api_call_with_retry(messages)

            raw = (response.choices[0].message.content or "").strip()
            logger.info(f"[Holo2] raw (first 500): {raw[:500]}")

            thinking, action = self._parse_response(raw, obs)

            if action and self._is_valid_bg_action(action):
                break

            messages.append({"role": "assistant", "content": raw})
            messages.append({
                "role": "user",
                "content": 'Invalid action. Respond with valid JSON: {"action_type": "click", "coordinate": [500, 300]}',
            })
            action = None

        if action is None:
            action = "noop(1000)"

        # Transform 0-1000 -> pixels
        screenshot = obs.get("screenshot")
        if screenshot is not None:
            from .pixel_agent_base import transform_normalized_to_pixel
            if isinstance(screenshot, np.ndarray):
                sh, sw = screenshot.shape[:2]
            else:
                sw, sh = screenshot.size
            action = transform_normalized_to_pixel(action, sw, sh)

        logger.info(f"STEP {self.step_count}: {action}")
        self.action_history.append(action)
        self.thinking_history.append(thinking or "")
        self.step_count += 1
        return action, {"thinking": thinking, "step": self.step_count - 1}

    def _parse_response(self, raw: str, obs: dict) -> tuple[str | None, str | None]:
        # Try to parse as JSON (structured output case)
        data = _try_parse_json_from_text(raw)
        if data and "action_type" in data:
            thinking = data.get("thought")
            bg_action = holo2_json_to_browsergym(data)
            return thinking, bg_action

        # Fallback: try to find any JSON with action_type
        logger.warning("Holo2: structured output not detected, using fallback parsing")
        return None, None


# ---------------------------------------------------------------------------
# AgentArgs
# ---------------------------------------------------------------------------

@dataclasses.dataclass
class Holo2AgentArgs(PixelAgentBaseArgs):
    provider: str = "holo2"
    model_name: str = "holo2-30b-a3b"

    def make_agent(self) -> Agent:
        agent = Holo2Agent(
            model_name=self.model_name,
            base_url=self._resolve_base_url(),
            api_key=self.api_key,
            demo_mode=self.demo_mode,
            temperature=self.temperature,
        )
        if self._output_dir:
            agent.output_dir = __import__("pathlib").Path(self._output_dir)
        return agent
