"""
UI-TARS-1.5-7B pixel-only agent for ComponentBench.

ByteDance-Seed/UI-TARS-1.5-7B uses a Thought/Action format with coordinate
predictions in the model's resized-image space. Coordinates MUST be mapped
back through smart_resize to the original image before normalizing to
BrowserGym 0-1000.

Parsing strategy:
  1. Extract only the *last* "Action:" line from the response.
  2. Parse the action type and arguments from patterns like:
     click(point='<point>x1 y1</point>')
     type(content='text')
     scroll(point='<point>x y</point>', direction='down')
     drag(start_point='<point>x1 y1</point>', end_point='<point>x2 y2</point>')
     hotkey(key='ctrl c')
  3. Map coordinates through smart_resize inverse -> BrowserGym 0-1000.

Reference: https://huggingface.co/ByteDance-Seed/UI-TARS-1.5-7B
"""
from __future__ import annotations

import dataclasses
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
    smart_resize,
)

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# System prompt — adapted from UI-TARS COMPUTER_USE_DOUBAO template
# ---------------------------------------------------------------------------
UI_TARS_SYSTEM_PROMPT = """\
You are a GUI agent. You are given a task and your action history, with screenshots. You need to perform the next action to complete the task.

## Output Format
```
Thought: ...
Action: ...
```

## Action Space

click(point='<point>x1 y1</point>')
left_double(point='<point>x1 y1</point>')
right_single(point='<point>x1 y1</point>')
drag(start_point='<point>x1 y1</point>', end_point='<point>x2 y2</point>')
hotkey(key='ctrl c')
type(content='xxx')
scroll(point='<point>x1 y1</point>', direction='down or up or right or left')
wait()
finished(content='xxx')

## Note
- Use English in `Thought` part.
- Write a small plan and finally summarize your next action (with its target element) in one sentence in `Thought` part.
"""


# ---------------------------------------------------------------------------
# Response parsing helpers
# ---------------------------------------------------------------------------

def _extract_last_action_line(raw: str) -> str | None:
    """Get the LAST 'Action: ...' line from the response."""
    matches = list(re.finditer(r'Action:\s*(.+)', raw))
    if not matches:
        return None
    return matches[-1].group(1).strip()


def _extract_point(text: str) -> tuple[int, int] | None:
    """Extract (x, y) from '<point>x y</point>' or '(x,y)' variants.
    
    Handles both UI-TARS response styles:
      click(point='<point>x y</point>')
      click(start_box='(x,y)')
    """
    # <point>x y</point>
    m = re.search(r"<point>\s*(\d+)\s+(\d+)\s*</point>", text)
    if m:
        return int(m.group(1)), int(m.group(2))
    # Fallback: '(x,y)', '(x, y)', or values with optional px suffix.
    m = re.search(r"\(\s*(\d+)\s*(?:px)?\s*,\s*(\d+)\s*(?:px)?\s*\)", text)
    if m:
        return int(m.group(1)), int(m.group(2))
    return None


def _extract_string_arg(text: str, key: str) -> str | None:
    """Extract a string argument like key='value' or key=\"value\"."""
    m = re.search(rf"{key}\s*=\s*['\"](.+?)['\"]", text)
    if m:
        return m.group(1)
    return None


def _map_coords_to_pixels(
    model_x: int,
    model_y: int,
    orig_width: int,
    orig_height: int,
    resized_width: int,
    resized_height: int,
) -> tuple[int, int]:
    """Map UI-TARS model coordinates from resized-image space to screen pixels.

    UI-TARS-1.5 appears to predict absolute coordinates on the resized image.
    We invert the smart-resize step and clamp to the actual screenshot size.
    """
    real_x = model_x / resized_width * orig_width
    real_y = model_y / resized_height * orig_height
    px = round(real_x)
    py = round(real_y)
    return max(0, min(orig_width - 1, px)), max(0, min(orig_height - 1, py))


def parse_ui_tars_action(
    action_line: str,
    orig_width: int,
    orig_height: int,
    resized_width: int,
    resized_height: int,
) -> str | None:
    """Parse a UI-TARS action line into a final-pixel BrowserGym action string."""

    action_line = action_line.strip()

    # --- click / left_double / right_single ---
    for ui_action, bg_action, button in [
        ("click", "mouse_click", None),
        ("left_double", "mouse_dblclick", None),
        ("right_single", "mouse_click", "right"),
    ]:
        if action_line.startswith(f"{ui_action}("):
            pt = _extract_point(action_line)
            if pt:
                bx, by = _map_coords_to_pixels(
                    pt[0], pt[1], orig_width, orig_height, resized_width, resized_height
                )
                if button:
                    return f"{bg_action}({bx}, {by}, button='{button}')"
                return f"{bg_action}({bx}, {by})"

    # --- type ---
    if action_line.startswith("type("):
        content = _extract_string_arg(action_line, "content")
        if content is not None:
            escaped = content.replace("\\n", "\n")
            return f"keyboard_type({repr(escaped)})"

    # --- scroll ---
    if action_line.startswith("scroll("):
        pt = _extract_point(action_line)
        direction = _extract_string_arg(action_line, "direction") or "down"
        bx, by = (orig_width // 2, orig_height // 2)
        if pt:
            bx, by = _map_coords_to_pixels(
                pt[0], pt[1], orig_width, orig_height, resized_width, resized_height
            )
        # Use real pixel deltas. Very small deltas tend to be ineffective
        # on nested scroll regions and carousels.
        delta_map = {"down": 400, "up": -400, "right": 400, "left": -400}
        dy = delta_map.get(direction.lower(), 400)
        if direction.lower() in ("left", "right"):
            return f"scroll({bx}, {by}, {dy}, 0)"
        return f"scroll({bx}, {by}, 0, {dy})"

    # --- drag ---
    if action_line.startswith("drag("):
        start_pt = None
        end_pt = None
        # Try <point> tags in order
        points = re.findall(r"<point>\s*(\d+)\s+(\d+)\s*</point>", action_line)
        if len(points) >= 2:
            start_pt = (int(points[0][0]), int(points[0][1]))
            end_pt = (int(points[1][0]), int(points[1][1]))
        # Fallback: start_box='(x1,y1)', end_box='(x2,y2)' format
        if not (start_pt and end_pt):
            box_pts = re.findall(
                r"(?:start_box|end_box|start_point|end_point)\s*=\s*['\"]?\(\s*(\d+)\s*(?:px)?\s*,\s*(\d+)\s*(?:px)?\s*\)['\"]?",
                action_line,
            )
            if len(box_pts) >= 2:
                start_pt = (int(box_pts[0][0]), int(box_pts[0][1]))
                end_pt = (int(box_pts[1][0]), int(box_pts[1][1]))
        if start_pt and end_pt:
            sx, sy = _map_coords_to_pixels(
                start_pt[0], start_pt[1], orig_width, orig_height, resized_width, resized_height
            )
            ex, ey = _map_coords_to_pixels(
                end_pt[0], end_pt[1], orig_width, orig_height, resized_width, resized_height
            )
            return f"mouse_drag_and_drop({sx}, {sy}, {ex}, {ey})"

    # --- hotkey ---
    if action_line.startswith("hotkey("):
        key_str = _extract_string_arg(action_line, "key")
        if key_str:
            keys = key_str.strip().split()
            if len(keys) == 1:
                return f"keyboard_press({repr(keys[0])})"
            combo = "+".join(k.capitalize() if k in ("ctrl", "alt", "shift", "meta") else k for k in keys)
            return f"keyboard_press({repr(combo)})"

    # --- wait ---
    if action_line.startswith("wait("):
        return "noop(5000)"

    # --- finished ---
    if action_line.startswith("finished("):
        content = _extract_string_arg(action_line, "content") or ""
        return f"send_msg_to_user({repr(content)})"

    logger.warning(f"Could not parse UI-TARS action: {action_line[:200]}")
    return None


# ---------------------------------------------------------------------------
# Agent class
# ---------------------------------------------------------------------------

class UITarsAgent(PixelAgentBase):
    """UI-TARS-1.5-7B pixel-only agent.

    Uses proper **multi-turn conversation** for history, matching how
    UI-TARS was trained:

        system:    <prompt>
        user:      <task + screenshot_0>
        assistant: Thought: ... Action: ...
        user:      <screenshot_1>
        assistant: Thought: ... Action: ...
        ...
        user:      <screenshot_N>          ← model generates response

    A sliding window of the last ``max_history_turns`` turns is kept to
    stay within the 32 k context window.
    """

    # Official UI-TARS multi-turn setups commonly keep the most recent
    # 5 images total in context. Since the current step also contributes
    # one image, we retain up to 4 prior turns here.
    MAX_HISTORY_TURNS = 4

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._resized_dims: tuple[int, int] | None = None
        self._turn_history: list[dict[str, Any]] = []
        self._goal_content: list[dict[str, Any]] | None = None

    def _resize_screenshot(self, screenshot) -> tuple[np.ndarray, int, int, int, int]:
        if isinstance(screenshot, np.ndarray):
            pil_img = Image.fromarray(screenshot)
        else:
            pil_img = screenshot
        orig_w, orig_h = pil_img.size
        new_h, new_w = smart_resize(orig_h, orig_w)
        resized = pil_img.resize((new_w, new_h), Image.LANCZOS)
        self._resized_dims = (new_h, new_w)
        return np.array(resized), orig_w, orig_h, new_w, new_h

    def get_action(self, obs: dict) -> tuple[str, dict]:
        assert obs.get("goal_object"), "Missing goal_object"

        if self._goal_content is None:
            self._goal_content = []
            self._goal_content.append({"type": "text", "text": "# User Instruction\n"})
            for part in obs.get("goal_object", []):
                if isinstance(part, dict) and "type" in part:
                    self._goal_content.append(part)
                else:
                    self._goal_content.append({"type": "text", "text": str(part)})

        screenshot = obs.get("screenshot")
        resized_arr, orig_w, orig_h, new_w, new_h = self._resize_screenshot(screenshot)
        img_content = self._build_image_content(resized_arr)

        messages = self._build_messages(img_content)

        thinking: str | None = None
        action: str | None = None
        raw: str = ""
        native_action_line: str = ""

        for attempt in range(3):
            response = self._api_call_with_retry(messages)
            raw = (response.choices[0].message.content or "").strip()
            logger.info(f"[UITarsAgent] raw (first 500): {raw[:500]}")

            if self.output_dir is not None:
                raw_path = self.output_dir / f"raw_response_step_{self.step_count}.txt"
                try:
                    raw_path.write_text(raw, encoding="utf-8")
                except OSError:
                    pass

            native_action_line = _extract_last_action_line(raw) or ""
            thinking, action = self._parse_response(raw, obs)

            if action and self._is_valid_bg_action(action):
                break

            messages.append({"role": "assistant", "content": raw})
            messages.append({
                "role": "user",
                "content": "Invalid action. Please output a valid action from the action space.",
            })
            action = None

        if action is None:
            action = "noop(1000)"
            native_action_line = "wait()"

        self._turn_history.append({
            "screenshot_content": img_content,
            "raw_response": raw,
        })

        logger.info(f"STEP {self.step_count}: {action} (native: {native_action_line})")
        self.action_history.append(native_action_line)
        self.thinking_history.append(thinking or "")
        self.step_count += 1
        return action, {"thinking": thinking, "raw_response": raw, "step": self.step_count - 1}

    def _build_messages(self, current_screenshot_content: dict) -> list[dict[str, Any]]:
        messages: list[dict[str, Any]] = [
            {"role": "system", "content": UI_TARS_SYSTEM_PROMPT},
        ]

        history = self._turn_history
        keep = self.MAX_HISTORY_TURNS
        if len(history) > keep:
            history = history[-keep:]

        for i, turn in enumerate(history):
            user_parts: list[dict[str, Any]] = []
            if i == 0 and len(history) == len(self._turn_history):
                user_parts.extend(self._goal_content or [])
            user_parts.append({"type": "text", "text": "\n"})
            user_parts.append(turn["screenshot_content"])
            messages.append({"role": "user", "content": user_parts})
            messages.append({"role": "assistant", "content": turn["raw_response"]})

        current_user: list[dict[str, Any]] = []
        # Keep the original task instruction visible on every turn so the model
        # does not lose the goal after the history window slides.
        current_user.extend(self._goal_content or [])
        current_user.append({"type": "text", "text": "\n"})
        current_user.append(current_screenshot_content)
        messages.append({"role": "user", "content": current_user})

        return messages

    def _parse_response(self, raw: str, obs: dict) -> tuple[str | None, str | None]:
        # Extract Thought
        thinking = None
        m = re.search(r'Thought:\s*(.+?)(?=\nAction:|$)', raw, re.DOTALL)
        if m:
            thinking = m.group(1).strip()

        # Extract last Action line
        action_line = _extract_last_action_line(raw)
        if action_line is None:
            return thinking, None

        # Get image dimensions for coordinate mapping
        screenshot = obs.get("screenshot")
        if screenshot is None:
            return thinking, None

        if isinstance(screenshot, np.ndarray):
            orig_h, orig_w = screenshot.shape[:2]
        else:
            orig_w, orig_h = screenshot.size

        if self._resized_dims:
            rh, rw = self._resized_dims
        else:
            rh, rw = smart_resize(orig_h, orig_w)

        bg_action = parse_ui_tars_action(action_line, orig_w, orig_h, rw, rh)
        return thinking, bg_action


# ---------------------------------------------------------------------------
# AgentArgs
# ---------------------------------------------------------------------------

@dataclasses.dataclass
class UITarsAgentArgs(PixelAgentBaseArgs):
    provider: str = "ui_tars"
    model_name: str = "UI-TARS-1.5-7B"

    def make_agent(self) -> Agent:
        agent = UITarsAgent(
            model_name=self.model_name,
            base_url=self._resolve_base_url(),
            api_key=self.api_key,
            demo_mode=self.demo_mode,
            temperature=self.temperature,
        )
        if self._output_dir:
            agent.output_dir = __import__("pathlib").Path(self._output_dir)
        return agent
