from __future__ import annotations

import base64
import dataclasses
import io
import logging
import os
import sys
import time
import threading
from pathlib import Path
from typing import Any

import numpy as np
import openai
from PIL import Image

from browsergym.core.action.parsers import highlevel_action_parser
from browsergym.core.action.highlevel import HighLevelActionSet
from browsergym.experiments import AbstractAgentArgs, Agent
from browsergym.utils.obs import overlay_som

from utils.grid_overlay import create_grid_overlay

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Rate limiter + retry for OpenRouter API calls (v0.3.1)
# ---------------------------------------------------------------------------

class BrowserGymRateLimitAbort(RuntimeError):
    """Raised when repeated API rate limiting should stop the whole shard."""

class _RequestRateLimiter:
    """Simple per-process min-interval rate limiter (thread-safe)."""
    
    def __init__(self):
        self._lock = threading.Lock()
        self._last_request_time = 0.0
    
    @property
    def min_interval(self) -> float:
        return float(os.environ.get("OPENROUTER_MIN_REQUEST_INTERVAL", "0.5"))
    
    def wait(self):
        with self._lock:
            now = time.monotonic()
            elapsed = now - self._last_request_time
            wait_time = self.min_interval - elapsed
            if wait_time > 0:
                time.sleep(wait_time)
            self._last_request_time = time.monotonic()


_rate_limiter = _RequestRateLimiter()


def _api_call_with_retry(client: openai.OpenAI, *, model: str, messages: list,
                          max_retries: int = 5) -> Any:
    """Call chat.completions.create with retry on 429/5xx and rate limiting.
    
    Returns the OpenAI ChatCompletion response object.
    """
    last_exc = None
    for attempt in range(max_retries):
        _rate_limiter.wait()
        try:
            response = client.chat.completions.create(model=model, messages=messages)
            # Log token usage if available
            if hasattr(response, "usage") and response.usage:
                u = response.usage
                logger.info(
                    f"[tokens] prompt={getattr(u, 'prompt_tokens', '?')} "
                    f"completion={getattr(u, 'completion_tokens', '?')} "
                    f"total={getattr(u, 'total_tokens', '?')}"
                )
            return response
        except openai.RateLimitError as e:
            last_exc = e
            wait = min(2 ** attempt * 2, 60)  # 2, 4, 8, 16, 32, cap 60
            logger.warning(f"Rate limited (429), retrying in {wait}s (attempt {attempt+1}/{max_retries}): {e}")
            time.sleep(wait)
        except openai.APIStatusError as e:
            if e.status_code and e.status_code >= 500:
                last_exc = e
                wait = min(2 ** attempt * 2, 60)
                logger.warning(f"Server error ({e.status_code}), retrying in {wait}s (attempt {attempt+1}/{max_retries}): {e}")
                time.sleep(wait)
            else:
                raise  # 4xx other than 429 -> don't retry
        except openai.APIConnectionError as e:
            last_exc = e
            wait = min(2 ** attempt * 2, 30)
            logger.warning(f"Connection error, retrying in {wait}s (attempt {attempt+1}/{max_retries}): {e}")
            time.sleep(wait)
    # All retries exhausted. Propagate a structured shard-stop signal for 429s
    # so the benchmark driver can exit cleanly and resume later.
    if isinstance(last_exc, openai.RateLimitError):
        raise BrowserGymRateLimitAbort(str(last_exc)) from last_exc
    raise last_exc  # type: ignore[misc]


def _safe_for_console(s: str) -> str:
    """
    Avoid UnicodeEncodeError on Windows consoles (often cp1252).
    If the console can't encode unicode characters, log an escaped form instead.
    """
    enc = getattr(sys.stdout, "encoding", None) or "utf-8"
    try:
        s.encode(enc)
        return s
    except Exception:
        return s.encode("unicode_escape", errors="backslashreplace").decode("ascii", errors="ignore")


def _try_parse_single_action(raw: str) -> str | None:
    """
    Return a normalized single action string if `raw` is EXACTLY one valid action call,
    otherwise return None.
    """
    raw = raw.strip()
    try:
        function_calls = highlevel_action_parser.parse_string(raw, parse_all=True).as_list()
    except Exception:
        return None
    if len(function_calls) != 1:
        return None
    function_name, function_args = function_calls[0]
    return function_name + "(" + ", ".join([repr(arg) for arg in function_args]) + ")"


def _strip_code_fences(text: str) -> str:
    """Remove markdown code fences from text."""
    import re
    # Remove opening fence like ```python or ```
    text = re.sub(r'^```\w*\s*\n?', '', text.strip())
    # Remove closing fence
    text = re.sub(r'\n?```$', '', text)
    return text.strip()


def _find_last_valid_action(function_calls: list, action_space: str = "coord") -> str | None:
    """
    Find the last valid action from parsed function calls.
    
    This prevents extracting fake actions like "around(530, 410)" from reasoning text
    by preferring the LAST valid action in the list.
    
    Args:
        function_calls: List of (function_name, args) tuples from parser
        action_space: "coord" or "bid" to determine valid action set
        
    Returns:
        Normalized action string, or None if no valid action found
    """
    valid_set = VALID_COORD_ACTIONS if action_space == "coord" else VALID_BID_ACTIONS
    
    # Try to find last VALID action first
    for fn, args in reversed(function_calls):
        if fn in valid_set:
            return fn + "(" + ", ".join([repr(a) for a in args]) + ")"
    
    # Fall back to last action if no valid one found (will trigger retry logic)
    if function_calls:
        fn, args = function_calls[-1]
        return fn + "(" + ", ".join([repr(a) for a in args]) + ")"
    
    return None


def _extract_thinking_and_action(raw: str, action_space: str = "coord") -> tuple[str | None, str | None]:
    """
    Extract thinking and action from model response.
    
    CRITICAL FIX: This function now correctly handles the case where reasoning text
    contains function-call-like patterns (e.g., "around (530, 410)") by:
    1. When <think> tags exist: ONLY parse action from text AFTER </think>
    2. When no <think> tags: Take the LAST valid action, not the first
    
    Supports multiple formats:
    1. <think>reasoning</think> action() - explicit think tags
    2. Reasoning text... action() - inline reasoning before action (Qwen3-VL-Thinking style)
    
    Args:
        raw: Raw model response text
        action_space: "coord" or "bid" to determine valid action set
        
    Returns:
        (thinking, action) tuple
    """
    import re
    
    thinking = None
    action = None
    
    # Step 1: Check for <think>...</think> tags
    think_match = re.search(r'<think>(.*?)</think>', raw, re.DOTALL | re.IGNORECASE)
    
    if think_match:
        # Extract thinking from within tags
        thinking = think_match.group(1).strip()
        
        # Find end of </think> tag and get candidate action text (everything after)
        end_tag_match = re.search(r'</think>', raw, re.IGNORECASE)
        if end_tag_match:
            candidate_action_text = raw[end_tag_match.end():].strip()
        else:
            candidate_action_text = ""
    else:
        # No <think> tags - entire text is candidate for action extraction
        candidate_action_text = raw
    
    # Step 2: Strip code fences from candidate action text
    candidate_action_text = _strip_code_fences(candidate_action_text)
    
    # Step 3: Try exact single action parse first (cleanest case)
    action = _try_parse_single_action(candidate_action_text)
    if action:
        # If no thinking from tags, try to extract inline thinking
        if thinking is None and think_match is None:
            # Find where the action starts in original raw text
            action_fn = action.split('(')[0] if '(' in action else action
            action_pattern = re.escape(action_fn) + r'\s*\('
            action_match = re.search(action_pattern, raw)
            if action_match and action_match.start() > 10:
                thinking_text = raw[:action_match.start()].strip()
                thinking_text = _strip_code_fences(thinking_text)
                if thinking_text and len(thinking_text) > 10:
                    thinking = thinking_text
        return thinking, action
    
    # Step 4: Use search_string on candidate text only (NOT full raw text)
    try:
        matches = highlevel_action_parser.search_string(candidate_action_text).as_list()
        function_calls = sum(matches, [])
        if function_calls:
            # Find LAST valid action (not first!) to avoid picking up reasoning text patterns
            action = _find_last_valid_action(function_calls, action_space)
            
            # Extract inline thinking when no <think> tags
            if action and think_match is None:
                action_fn = action.split('(')[0] if '(' in action else action
                action_pattern = re.escape(action_fn) + r'\s*\('
                all_matches = list(re.finditer(action_pattern, raw))
                if all_matches:
                    last_match = all_matches[-1]
                    if last_match.start() > 10:
                        thinking_text = raw[:last_match.start()].strip()
                        thinking_text = _strip_code_fences(thinking_text)
                        if thinking_text and len(thinking_text) > 10:
                            thinking = thinking_text
    except Exception:
        pass
    
    # Step 5: If still no action and no think tags, try parsing from full text
    # but use last valid action
    if action is None and think_match is None:
        try:
            matches = highlevel_action_parser.search_string(raw).as_list()
            function_calls = sum(matches, [])
            if function_calls:
                action = _find_last_valid_action(function_calls, action_space)
                
                # Extract inline thinking (everything before last action)
                if action and function_calls:
                    # Find where the action appears
                    action_fn = action.split('(')[0] if '(' in action else action
                    # Find the LAST occurrence of this function call
                    action_pattern = re.escape(action_fn) + r'\s*\('
                    all_matches = list(re.finditer(action_pattern, raw))
                    if all_matches:
                        last_match = all_matches[-1]
                        if last_match.start() > 10:
                            thinking_text = raw[:last_match.start()].strip()
                            thinking_text = _strip_code_fences(thinking_text)
                            if thinking_text and len(thinking_text) > 10:
                                thinking = thinking_text
        except Exception:
            pass
    
    return thinking, action


# Valid action function names for each action space
VALID_COORD_ACTIONS = {
    "mouse_click", "mouse_move", "mouse_up", "mouse_dblclick", "mouse_drag_and_drop",
    "keyboard_type", "keyboard_press", "keyboard_down", "keyboard_up", "keyboard_insert_text",
    "send_msg_to_user", "report_infeasible", "noop",
    "scroll", "go_back", "go_forward", "goto", "new_tab", "tab_focus", "close_tab",
}

VALID_BID_ACTIONS = {
    "click", "dblclick", "fill", "hover", "press", "focus", "clear", "select_option", "drag_and_drop",
    "keyboard_type", "keyboard_press", "keyboard_down", "keyboard_up", "keyboard_insert_text",
    "send_msg_to_user", "report_infeasible", "noop",
    "scroll", "go_back", "go_forward", "goto", "new_tab", "tab_focus", "close_tab",
}


def _is_valid_action(action: str, action_space: str) -> tuple[bool, str]:
    """
    Check if an action is valid for the given action space.
    
    Returns (is_valid, error_message).
    """
    import re
    
    if not action:
        return False, "Empty action"
    
    # Extract function name from action string like "func_name(args)"
    match = re.match(r'^(\w+)\s*\(', action)
    if not match:
        return False, f"Invalid format: '{action}'. Expected: function_name(arguments)"
    
    func_name = match.group(1)
    
    valid_actions = VALID_COORD_ACTIONS if action_space == "coord" else VALID_BID_ACTIONS
    
    if func_name not in valid_actions:
        if action_space == "coord":
            return False, f"'{func_name}' is not a valid action. For clicking, use mouse_click(x, y)."
        else:
            return False, f"'{func_name}' is not a valid action. For clicking elements, use click('element_id')."
    
    return True, ""


def image_to_png_base64_url(image: np.ndarray | Image.Image) -> str:
    if isinstance(image, np.ndarray):
        image = Image.fromarray(image)
    if image.mode in ("LA",):
        image = image.convert("RGBA")
    with io.BytesIO() as buffer:
        image.save(buffer, format="PNG")
        image_base64 = base64.b64encode(buffer.getvalue()).decode()
    return f"data:image/png;base64,{image_base64}"


def _transform_normalized_to_pixel(action: str, screen_width: int, screen_height: int) -> str:
    """
    Transform normalized 0-1000 coordinates to actual pixel coordinates.
    
    Qwen3-VL and similar models output coordinates in a normalized 0-1000 scale,
    where (0,0) is top-left and (1000,1000) is bottom-right. This function converts
    those to actual pixel coordinates based on screen dimensions.
    
    Supports:
    - 2-coordinate actions: mouse_click, mouse_move, mouse_drag_to, mouse_dblclick
    - 4-coordinate actions: mouse_drag_and_drop(from_x, from_y, to_x, to_y)
    
    Args:
        action: The action string containing coordinate-based function calls
        screen_width: Actual screen width in pixels
        screen_height: Actual screen height in pixels
        
    Returns:
        Action string with coordinates converted to pixels
    """
    import re
    
    def norm_to_pixel(norm_x: float, norm_y: float) -> tuple[int, int]:
        """Convert normalized 0-1000 coords to pixels."""
        pixel_x = int(norm_x / 1000 * screen_width)
        pixel_y = int(norm_y / 1000 * screen_height)
        return pixel_x, pixel_y
    
    # Pattern for 2-coordinate actions: mouse_click(x, y), mouse_move(x, y), etc.
    pattern_2coord = r'(mouse_click|mouse_move|mouse_drag_to|mouse_dblclick)\s*\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*\)'
    
    def replace_2coords(match):
        func_name = match.group(1)
        norm_x = float(match.group(2))
        norm_y = float(match.group(3))
        pixel_x, pixel_y = norm_to_pixel(norm_x, norm_y)
        logger.debug(f"Coordinate transform: ({norm_x}, {norm_y}) -> ({pixel_x}, {pixel_y}) for {screen_width}x{screen_height}")
        return f"{func_name}({pixel_x}, {pixel_y})"
    
    # Pattern for 4-coordinate actions: mouse_drag_and_drop(from_x, from_y, to_x, to_y)
    pattern_4coord = r'mouse_drag_and_drop\s*\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*\)'
    
    def replace_4coords(match):
        from_norm_x = float(match.group(1))
        from_norm_y = float(match.group(2))
        to_norm_x = float(match.group(3))
        to_norm_y = float(match.group(4))
        
        from_pixel_x, from_pixel_y = norm_to_pixel(from_norm_x, from_norm_y)
        to_pixel_x, to_pixel_y = norm_to_pixel(to_norm_x, to_norm_y)
        
        logger.debug(f"Drag transform: ({from_norm_x}, {from_norm_y}) -> ({from_pixel_x}, {from_pixel_y}), "
                    f"({to_norm_x}, {to_norm_y}) -> ({to_pixel_x}, {to_pixel_y})")
        return f"mouse_drag_and_drop({from_pixel_x}, {from_pixel_y}, {to_pixel_x}, {to_pixel_y})"
    
    # Apply 4-coordinate transform first (more specific pattern)
    transformed = re.sub(pattern_4coord, replace_4coords, action)
    # Then apply 2-coordinate transform
    transformed = re.sub(pattern_2coord, replace_2coords, transformed)
    
    if transformed != action:
        logger.info(f"Transformed coordinates: {action} -> {transformed}")
    
    return transformed


# Prompt explaining the coordinate grid reference system (normalized 0-1000 scale)
GRID_REFERENCE_PROMPT = """\
# Coordinate Reference Grid

The screenshot shows a 10x10 grid overlay with coordinate labels in 0-1000 NORMALIZED scale.
Coordinates are NORMALIZED: (0,0) is top-left corner, (1000,1000) is bottom-right corner.

The labels (like "100,100", "200,200") show the normalized position of each grid intersection.

How to use the grid:
1. Find the element you want to click in the screenshot
2. Locate which grid cell contains that element
3. Look at the coordinate labels around that cell
4. Estimate the element's position in 0-1000 scale based on its location within the cell

Example:
- You want to click a button near the CENTER of the screen
- The center is at approximately (500, 500) in normalized coordinates
- Action: mouse_click(500, 500)

Example:
- A text field is in the upper-left quadrant, about 1/5 from left and 1/4 from top
- Estimate: x = 200 (1/5 of 1000), y = 250 (1/4 of 1000)
- Action: mouse_click(200, 250)

IMPORTANT: Always use 0-1000 normalized coordinates, NOT pixel coordinates!
"""


class OpenAIAgent(Agent):
    """
    Minimal OpenAI-compatible agent, intended for pixel-only benchmarking.
    Keeps BrowserGym core behavior upstream-default by relying on pip-installed browsergym.
    """

    def __init__(
        self,
        model_name: str,
        demo_mode: str,
        use_screenshot: bool = True,
        use_grid_overlay: bool = True,
        grid_size: int = 10,
        save_grid_screenshots: bool = True,
        save_som_screenshots: bool = True,
        use_som_overlay: bool = False,
        use_axtree: bool = False,
        use_html: bool = False,
        action_space: str = "coord",  # "coord" (pixel) or "bid" (id-based)
        normalize_coordinates: bool = True,
        auto_close: bool = True,
    ) -> None:
        super().__init__()
        self.model_name = model_name
        self.demo_mode = demo_mode
        self.use_screenshot = use_screenshot
        self.use_grid_overlay = use_grid_overlay
        self.grid_size = grid_size
        self.save_grid_screenshots = save_grid_screenshots
        self.save_som_screenshots = save_som_screenshots
        self.use_som_overlay = use_som_overlay
        self.use_axtree = use_axtree
        self.use_html = use_html
        self.action_space = action_space
        self.normalize_coordinates = normalize_coordinates
        self.auto_close = auto_close
        self.action_history: list[str] = []
        self.thinking_history: list[str] = []  # Store model's reasoning
        self.step_count: int = 0
        self.output_dir: Path | None = None  # Set by runner after prepare()

        # Support flexible API endpoints:
        # - VLLM_BASE_URL: Local vLLM server (e.g., http://localhost:8000/v1)
        # - Falls back to OpenRouter API if not set
        base_url = os.environ.get("VLLM_BASE_URL", "https://openrouter.ai/api/v1")
        api_key = (
            os.environ.get("VLLM_API_KEY") 
            or os.environ.get("OPENROUTER_API_KEY") 
            or os.environ.get("OPENAI_API_KEY")
            or "dummy"  # vLLM doesn't require a real API key
        )
        
        # Only add OpenRouter-specific headers when using OpenRouter
        client_kwargs = {
            "base_url": base_url,
            "api_key": api_key,
        }
        if "openrouter.ai" in base_url:
            client_kwargs["default_headers"] = {
                "HTTP-Referer": "https://github.com/ComponentBench",
                "X-Title": "ComponentBench Agent",
            }
        
        self.openai_client = openai.OpenAI(**client_kwargs)
        logger.info(f"Using API endpoint: {base_url}")

        subsets = ["chat", "tab", "nav", "infeas"]
        if action_space == "coord":
            subsets.insert(3, "coord")
        else:
            subsets.insert(3, "bid")

        self.action_set = HighLevelActionSet(
            subsets=subsets,
            strict=False,
            multiaction=False,
            demo_mode=demo_mode,
        )

    def get_action(self, obs: dict) -> tuple[str, dict]:
        assert obs.get("goal_object"), "Missing goal_object."

        # Keep instruction style close to BrowserGym demo_agent defaults
        # v0.3: Replace generic "action_function(arguments)" placeholder with
        # real action examples to prevent models from copying the placeholder
        # as a literal action (audit Priority 1 fix).
        if self.action_space == "coord":
            action_example = "mouse_click(500, 300)" if self.normalize_coordinates else "mouse_click(640, 360)"
        else:
            action_example = "click('42')"
        
        instructions = f"""\
# Instructions

Review the current state of the page and all other information to find the best
possible next action to accomplish your goal. Your answer will be interpreted
and executed by a program, make sure to follow the formatting instructions.

## Response Format

First, briefly explain your reasoning in <think> tags, then output EXACTLY ONE action.

<think>
Briefly describe:
1. What you observe on the current page
2. What you just did in the previous action (if any) and its effect
3. What you will do next and why
</think>

{action_example}

IMPORTANT: 
- Include your thinking in <think> tags BEFORE the action
- Output EXACTLY ONE action function call after the thinking
- Do NOT output multiple actions
- Do NOT use upload_file or mouse_upload_file actions; file uploads are handled via in-page modal UI
"""
        if self.auto_close:
            instructions += """
When you have completed the goal, use send_msg_to_user() to provide your final answer.
After sending your answer, on the NEXT action (not the same action), call report_infeasible("DONE").
"""

        # Build OpenAI-compatible chat messages:
        # each message MUST include role + content.
        user_content: list[dict[str, Any]] = []

        # Include chat history (BrowserGym core expects agents to use it)
        user_content.append({"type": "text", "text": "# Chat history\n"})
        for m in obs.get("chat_messages", []):
            role = m.get("role", "unknown")
            msg = m.get("message", "")
            user_content.append({"type": "text", "text": f"{role}: {msg}"})

        user_content.append({"type": "text", "text": "# Goal\n"})
        # goal_object is already OpenAI-style content blocks (text/image_url), so append as-is
        for part in obs["goal_object"]:
            # Defensive: accept either {"type": "..."} content blocks or plain strings
            if isinstance(part, dict) and "type" in part:
                user_content.append(part)
            else:
                user_content.append({"type": "text", "text": str(part)})

        user_content.append({"type": "text", "text": "\n# Currently open tabs\n"})
        for page_index, (page_url, page_title) in enumerate(
            zip(obs.get("open_pages_urls", []), obs.get("open_pages_titles", []))
        ):
            user_content.append(
                {
                    "type": "text",
                    "text": f"""\
Tab {page_index}{' (active tab)' if page_index == obs.get('active_page_index', 0) else ''}
  Title: {page_title}
  URL: {page_url}
""",
                }
            )

        # Add screenshot (only the original, no grid overlay)
        if self.use_screenshot:
            screenshot = obs["screenshot"]
            
            user_content.append({"type": "text", "text": "\n# Screenshot of current page\n"})
            user_content.append(
                {
                    "type": "image_url",
                    "image_url": {"url": image_to_png_base64_url(screenshot), "detail": "auto"},
                }
            )

            # Save grid screenshot to results folder (for debugging, even if not sent to model)
            if self.use_grid_overlay and self.save_grid_screenshots and self.output_dir is not None:
                grid_screenshot = create_grid_overlay(screenshot, grid_size=self.grid_size)
                grid_path = self.output_dir / f"grid_step_{self.step_count}.png"
                Image.fromarray(grid_screenshot).save(grid_path)
                logger.debug("Saved grid screenshot: %s", grid_path)

        # Add accessibility tree if enabled (AX-tree mode)
        if self.use_axtree:
            axtree = obs.get("axtree_txt", "")
            if axtree:
                user_content.append({
                    "type": "text",
                    "text": f"""\
\n# Accessibility Tree

The page elements are listed below with their IDs in square brackets like [123].
To interact with an element, use its ID number in quotes: click('123') or fill('45', 'text').

{axtree}
"""
                })

        # Add SoM overlay screenshot if enabled
        if self.use_som_overlay:
            # Generate SoM overlay using BrowserGym's utility function
            extra_properties = obs.get("extra_element_properties", {})
            screenshot = obs.get("screenshot")
            
            if screenshot is not None and extra_properties:
                som_screenshot = overlay_som(screenshot, extra_properties)
                
                user_content.append({"type": "text", "text": "\n# Screenshot with Set-of-Mark Overlay\n"})
                user_content.append({
                    "type": "image_url",
                    "image_url": {"url": image_to_png_base64_url(som_screenshot), "detail": "auto"},
                })
                
                # Save SoM screenshot to results folder
                if self.save_som_screenshots and self.output_dir is not None:
                    som_path = self.output_dir / f"screenshot_som_step_{self.step_count}.png"
                    Image.fromarray(som_screenshot).save(som_path)
                    logger.debug("Saved SoM screenshot: %s", som_path)
            
            user_content.append({
                "type": "text",
                "text": """\
\n# Set-of-Mark Overlay

The screenshot above shows numbered markers on interactive elements.
To interact with an element, use its marker number in quotes: click('5') to click element marked with 5.
"""
            })

        # Build mode-specific action examples
        if self.action_space == "bid":
            action_examples = """\
Example actions (use element IDs from accessibility tree or SoM markers):

```click('123')``` - Click element with ID 123 (from [123] in the tree)
```fill('45', 'hello')``` - Type 'hello' into input with ID 45
```send_msg_to_user("The answer is X")``` - Report your finding

Note: IDs appear as [123] in the accessibility tree, but use just the number in quotes: click('123')
"""
        else:  # coord mode
            if self.normalize_coordinates:
                action_examples = """\
## VALID ACTIONS (use EXACTLY these function names):

mouse_click(x, y)              - Click at coordinates (x, y)
mouse_dblclick(x, y)           - Double-click at coordinates
keyboard_type('text')          - Type text
keyboard_press('Enter')        - Press a key
send_msg_to_user('answer')     - Report your answer to user
noop(1000)                     - Wait 1 second

## COORDINATE SYSTEM (0-1000 normalized scale):
- (0, 0) = top-left corner
- (500, 500) = center of screen  
- (1000, 1000) = bottom-right corner

## EXAMPLES:
mouse_click(500, 500)    # Click center
mouse_click(100, 100)    # Click top-left area
mouse_click(900, 500)    # Click right side, middle height

## INVALID - DO NOT USE THESE:
❌ approximately(x, y)
❌ coordinates(x, y)
❌ at(x, y)
❌ click(x, y)
❌ around(x, y)

Always use mouse_click(x, y) for clicking!
"""
            else:
                # Derive viewport dimensions from screenshot if available
                _scr = obs.get("screenshot")
                if _scr is not None:
                    if isinstance(_scr, np.ndarray):
                        _sh, _sw = _scr.shape[:2]
                    else:
                        _sw, _sh = _scr.size
                else:
                    _sw, _sh = 1280, 720
                action_examples = f"""\
## VALID ACTIONS (use EXACTLY these function names):

mouse_click(x, y)              - Click at pixel coordinates (x, y)
mouse_dblclick(x, y)           - Double-click at pixel coordinates
keyboard_type('text')          - Type text
keyboard_press('Enter')        - Press a key
send_msg_to_user('answer')     - Report your answer to user
noop(1000)                     - Wait 1 second

## COORDINATE SYSTEM (pixel coordinates):
- The screenshot dimensions are {_sw} x {_sh} pixels
- (0, 0) = top-left corner
- ({_sw // 2}, {_sh // 2}) = center of screen
- ({_sw}, {_sh}) = bottom-right corner
- Use the ACTUAL PIXEL position of the element you want to click

## EXAMPLES:
mouse_click({_sw // 2}, {_sh // 2})    # Click center of screen
mouse_click(100, 50)     # Click near top-left
mouse_click({_sw - 100}, {_sh // 2})    # Click right side, middle height

## INVALID - DO NOT USE THESE:
❌ approximately(x, y)
❌ coordinates(x, y)
❌ at(x, y)
❌ click(x, y)
❌ around(x, y)

Always use mouse_click(x, y) for clicking!
"""

        user_content.append(
            {
                "type": "text",
                "text": f"""\
\n# Action Space

{self.action_set.describe(with_long_description=False, with_examples=True)}

{action_examples}
""",
            }
        )

        if self.action_history:
            user_content.append({"type": "text", "text": "\n# History of past actions\n"})
            # Show last 10 actions with their thinking (if available)
            start_idx = max(0, len(self.action_history) - 10)
            for i, action in enumerate(self.action_history[start_idx:], start=start_idx):
                step_text = f"Step {i + 1}:\n"
                # Include thinking if available
                if i < len(self.thinking_history) and self.thinking_history[i]:
                    step_text += f"  Reasoning: {self.thinking_history[i][:200]}{'...' if len(self.thinking_history[i]) > 200 else ''}\n"
                step_text += f"  Action: {action}\n"
                user_content.append({"type": "text", "text": step_text})

        messages: list[dict[str, Any]] = [
            {"role": "system", "content": instructions},
            {"role": "user", "content": user_content},
        ]

        # Get model response and extract thinking + action
        raw_response = ""
        thinking: str | None = None
        action: str | None = None
        
        for attempt in range(3):
            response = _api_call_with_retry(self.openai_client, model=self.model_name, messages=messages)
            message = response.choices[0].message
            raw_response = (message.content or "").strip()
            
            # Log truncated preview to console; save full text to trace dir
            logger.info(f"RAW RESPONSE (first 500 chars): {_safe_for_console(raw_response[:500])}")
            if self.output_dir is not None:
                raw_path = self.output_dir / f"raw_response_step_{self.step_count}.txt"
                try:
                    raw_path.write_text(raw_response, encoding="utf-8")
                except OSError:
                    pass
            
            # Try to access reasoning via multiple methods:
            reasoning_content = None
            
            # Method 1: Direct attribute (if OpenAI SDK exposes it)
            reasoning_content = getattr(message, 'reasoning_content', None)
            if reasoning_content is None:
                reasoning_content = getattr(message, 'reasoning', None)
            
            # Method 2: Check model_extra for extra fields Pydantic didn't parse
            if reasoning_content is None and hasattr(message, 'model_extra'):
                extra = message.model_extra or {}
                reasoning_content = extra.get('reasoning_content') or extra.get('reasoning')
                if reasoning_content:
                    logger.info(f"Found reasoning in model_extra: {reasoning_content[:100]}...")
            
            # Method 3: Check the raw dict representation
            if reasoning_content is None:
                try:
                    msg_dict = message.model_dump() if hasattr(message, 'model_dump') else {}
                    reasoning_content = msg_dict.get('reasoning_content') or msg_dict.get('reasoning')
                    if reasoning_content:
                        logger.info(f"Found reasoning in model_dump: {reasoning_content[:100]}...")
                except Exception:
                    pass
            
            if reasoning_content:
                # vLLM already extracted the reasoning for us
                thinking = reasoning_content.strip()
                # The content should contain just the action
                action = _try_parse_single_action(raw_response)
                if action is None:
                    # Try extracting from full response
                    _, action = _extract_thinking_and_action(raw_response, self.action_space)
            else:
                # Fallback: parse <think> tags from content (OpenRouter/other providers)
                thinking, action = _extract_thinking_and_action(raw_response, self.action_space)
            
            # Check if we got a valid action
            if action is not None:
                # Validate the action format
                is_valid, error_msg = _is_valid_action(action, self.action_space)
                if is_valid:
                    break
                else:
                    # Invalid action - ask model to retry with correct format
                    logger.warning(f"Invalid action detected: {action} - {error_msg}")
                    messages.append({"role": "assistant", "content": raw_response})
                    if self.normalize_coordinates:
                        coord_hint = "where x and y are 0-1000 normalized coordinates."
                    else:
                        coord_hint = "where x and y are pixel coordinates matching the screenshot dimensions."
                    messages.append(
                        {
                            "role": "user",
                            "content": f"ERROR: {error_msg}\n\nPlease output a valid action. For clicking, use: mouse_click(x, y) {coord_hint}",
                        }
                    )
                    action = None  # Reset so we retry
            else:
                # No action found at all
                messages.append({"role": "assistant", "content": raw_response})
                fallback_example = "mouse_click(500, 500)" if self.normalize_coordinates else "mouse_click(640, 360)"
                messages.append(
                    {
                        "role": "user",
                        "content": f"Invalid format. Please output EXACTLY ONE action function call, e.g., {fallback_example}",
                    }
                )

        # Last-resort fallback
        if action is None:
            action = "noop(1000)"

        # Transform normalized 0-1000 coordinates to actual pixels (for coord mode)
        # Only applies to models that output normalized coordinates (e.g. Qwen3-VL).
        # Models like GPT output actual pixel coordinates and should skip this.
        if self.action_space == "coord" and self.normalize_coordinates:
            screenshot = obs.get("screenshot")
            if screenshot is not None:
                # screenshot is numpy array with shape (height, width, channels)
                if isinstance(screenshot, np.ndarray):
                    screen_height, screen_width = screenshot.shape[:2]
                else:
                    # PIL Image
                    screen_width, screen_height = screenshot.size
                action = _transform_normalized_to_pixel(action, screen_width, screen_height)

        # Log step number, thinking, and action
        # Note: step_count is 0-indexed to match screenshot filenames (screenshot_step_0.png, grid_step_0.png)
        logger.info("=" * 60)
        logger.info(f"STEP {self.step_count} (matches screenshot_step_{self.step_count}.png / grid_step_{self.step_count}.png)")
        logger.info("=" * 60)
        logger.info("THINKING:")
        if thinking:
            # Log full thinking for visibility
            for line in thinking.split('\n')[:10]:  # First 10 lines
                logger.info("  " + _safe_for_console(line))
            if thinking.count('\n') > 10:
                logger.info("  ...")
        else:
            logger.info("  (no thinking captured)")
        logger.info("-" * 60)
        logger.info(f"ACTION: {_safe_for_console(action)}")
        logger.info("=" * 60)

        # Store history
        self.action_history.append(action)
        self.thinking_history.append(thinking or "")
        self.step_count += 1
        
        return action, {
            "thinking": thinking,
            "raw_response": raw_response,
            "step": self.step_count - 1,
        }


@dataclasses.dataclass
class OpenAIAgentArgs(AbstractAgentArgs):
    model_name: str = "openai/gpt-5-mini"
    demo_mode: str = "off"

    # Observation knobs
    use_screenshot: bool = True
    use_grid_overlay: bool = True  # Enable coordinate reference grid
    grid_size: int = 10  # 10x10 grid
    save_grid_screenshots: bool = True  # Save grid screenshots to results
    save_som_screenshots: bool = True  # Save SoM screenshots to results
    use_som_overlay: bool = False
    use_axtree: bool = False
    use_html: bool = False

    # Action space: "coord" for pixel-only or "bid" for id-based
    action_space: str = "coord"

    # Coordinate normalization: models like Qwen3-VL output 0-1000 normalized
    # coordinates that need mapping to actual pixels. Models like GPT output
    # actual pixel coordinates and should NOT be normalized.
    normalize_coordinates: bool = True

    auto_close: bool = True

    # Set by runner after exp_args.prepare() to enable grid screenshot saving
    _output_dir: str | None = None

    def make_agent(self) -> Agent:
        agent = OpenAIAgent(
            model_name=self.model_name,
            demo_mode=self.demo_mode,
            use_screenshot=self.use_screenshot,
            use_grid_overlay=self.use_grid_overlay,
            grid_size=self.grid_size,
            save_grid_screenshots=self.save_grid_screenshots,
            save_som_screenshots=self.save_som_screenshots,
            use_som_overlay=self.use_som_overlay,
            use_axtree=self.use_axtree,
            use_html=self.use_html,
            action_space=self.action_space,
            normalize_coordinates=self.normalize_coordinates,
            auto_close=self.auto_close,
        )
        # Set output directory for grid screenshot saving
        if self._output_dir:
            agent.output_dir = Path(self._output_dir)
        return agent
