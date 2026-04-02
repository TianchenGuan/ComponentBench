"""
MAI-UI-8B pixel-only agent for ComponentBench.

Tongyi-MAI/MAI-UI-8B uses a grounding-centric action format with
<action>JSON</action> tags and a 0..999 coordinate scale.

Parsing strategy:
  1. Extract JSON from <action>...</action> tags ONLY.
  2. Ignore all text inside <grounding_think>, <think>, or any other tags.
  3. Map 0..999 coordinates to BrowserGym 0..1000.

Reference: https://huggingface.co/Tongyi-MAI/MAI-UI-8B
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
    normalize_to_browsergym,
)

logger = logging.getLogger(__name__)

MAI_UI_SCALE = 999  # MAI-UI uses 0..999 coordinates


# ---------------------------------------------------------------------------
# System prompt — web-oriented adaptation of MAI-UI grounding prompt
# ---------------------------------------------------------------------------
MAI_UI_SYSTEM_PROMPT = """\
You are a web GUI agent. You are given a screenshot of a web page and a task.
You need to perform the next action to complete the task.

## Output Format

<action>JSON</action>

The JSON must have these fields:
- "action": one of "click", "type", "scroll", "drag", "key_press", "noop"
- "coordinate": [x, y] for click/scroll (0-999 scale, where 0,0 is top-left and 999,999 is bottom-right)
- "text": string for type actions
- "direction": "up" or "down" for scroll
- "startCoordinate": [x, y] for drag start
- "endCoordinate": [x, y] for drag end
- "key": key name for key_press (e.g., "Enter", "Backspace", "Tab")

## Examples

Click a button at position (530, 410):
<action>{"action": "click", "coordinate": [530, 410]}</action>

Type text into a focused input:
<action>{"action": "type", "text": "Hello world"}</action>

Scroll down:
<action>{"action": "scroll", "coordinate": [500, 500], "direction": "down"}</action>

Press Enter key:
<action>{"action": "key_press", "key": "Enter"}</action>

When you have completed the task, report your answer:
<action>{"action": "type", "text": "DONE: <your answer>"}</action>

## Rules
- Output EXACTLY ONE <action>JSON</action> block per response.
- Coordinates use 0-999 scale (NOT pixels).
- You may think step-by-step before the action, but the action MUST be in <action> tags.
- Do NOT use upload_file actions.
"""


def parse_mai_ui_action(raw: str) -> dict | None:
    """Extract and parse the JSON inside <action>...</action> tags.

    Ignores any text outside these tags, including reasoning in <think> blocks.
    Returns the parsed dict or None if extraction fails.
    """
    m = re.search(r'<action>\s*(.*?)\s*</action>', raw, re.DOTALL | re.IGNORECASE)
    if not m:
        return None
    try:
        return json.loads(m.group(1))
    except json.JSONDecodeError:
        logger.warning(f"Failed to parse MAI-UI action JSON: {m.group(1)[:200]}")
        return None


def mai_action_to_browsergym(act: dict) -> str | None:
    """Convert a parsed MAI-UI action dict to a BrowserGym action string."""
    action_type = act.get("action", "").lower()

    if action_type == "click":
        coord = act.get("coordinate", [])
        if len(coord) != 2:
            return None
        x, y = normalize_to_browsergym(coord[0], coord[1], from_scale=MAI_UI_SCALE)
        return f"mouse_click({x}, {y})"

    if action_type == "type":
        text = act.get("text", "")
        if text.startswith("DONE:"):
            answer = text[len("DONE:"):].strip()
            return f"send_msg_to_user({repr(answer)})"
        return f"keyboard_type({repr(text)})"

    if action_type == "scroll":
        coord = act.get("coordinate", [500, 500])
        direction = act.get("direction", "down").lower()
        x, y = normalize_to_browsergym(coord[0], coord[1], from_scale=MAI_UI_SCALE)
        delta = 3 if direction == "down" else -3
        return f"scroll({x}, {y}, 0, {delta})"

    if action_type == "drag":
        sc = act.get("startCoordinate", [])
        ec = act.get("endCoordinate", [])
        if len(sc) != 2 or len(ec) != 2:
            return None
        sx, sy = normalize_to_browsergym(sc[0], sc[1], from_scale=MAI_UI_SCALE)
        ex, ey = normalize_to_browsergym(ec[0], ec[1], from_scale=MAI_UI_SCALE)
        return f"mouse_drag_and_drop({sx}, {sy}, {ex}, {ey})"

    if action_type == "key_press":
        key = act.get("key", "Enter")
        return f"keyboard_press({repr(key)})"

    if action_type == "noop":
        return "noop(1000)"

    logger.warning(f"Unknown MAI-UI action type: {action_type}")
    return None


# ---------------------------------------------------------------------------
# Agent class
# ---------------------------------------------------------------------------

class MAIUIAgent(PixelAgentBase):
    """MAI-UI-8B pixel-only agent."""

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

        # Action history (compact)
        if self.action_history:
            user_content.append({"type": "text", "text": "\n# Recent Actions\n"})
            start = max(0, len(self.action_history) - self.max_steps_history)
            for i, act in enumerate(self.action_history[start:], start=start):
                user_content.append({"type": "text", "text": f"Step {i+1}: {act}\n"})

        return [
            {"role": "system", "content": MAI_UI_SYSTEM_PROMPT},
            {"role": "user", "content": user_content},
        ]

    def _parse_response(self, raw: str, obs: dict) -> tuple[str | None, str | None]:
        # Extract thinking from <think> or <grounding_think> tags
        thinking = None
        for tag in ("think", "grounding_think"):
            m = re.search(rf'<{tag}>(.*?)</{tag}>', raw, re.DOTALL | re.IGNORECASE)
            if m:
                thinking = m.group(1).strip()
                break

        # Parse action from <action> tags only
        act_dict = parse_mai_ui_action(raw)
        if act_dict is None:
            return thinking, None

        bg_action = mai_action_to_browsergym(act_dict)
        return thinking, bg_action


# ---------------------------------------------------------------------------
# AgentArgs
# ---------------------------------------------------------------------------

@dataclasses.dataclass
class MAIUIAgentArgs(PixelAgentBaseArgs):
    provider: str = "mai_ui"
    model_name: str = "MAI-UI-8B"

    def make_agent(self) -> Agent:
        agent = MAIUIAgent(
            model_name=self.model_name,
            base_url=self._resolve_base_url(),
            api_key=self.api_key,
            demo_mode=self.demo_mode,
            temperature=self.temperature,
        )
        if self._output_dir:
            agent.output_dir = __import__("pathlib").Path(self._output_dir)
        return agent
