"""
Shared base class for pixel-only agents (MAI-UI, UI-TARS, Holo2).

Handles:
- OpenAI-compatible vLLM client initialization
- Retry logic with exponential backoff
- Structured outputs compatibility shim (vLLM >= 0.12 vs < 0.12)
- Coordinate normalization to BrowserGym 0-1000 space
- Screenshot encoding
"""
from __future__ import annotations

import base64
import dataclasses
import io
import json
import logging
import math
import os
import re
import time
import threading
from abc import abstractmethod
from pathlib import Path
from typing import Any, Optional

import numpy as np
import openai
from PIL import Image

from browsergym.core.action.parsers import highlevel_action_parser
from browsergym.core.action.highlevel import HighLevelActionSet
from browsergym.experiments import AbstractAgentArgs, Agent

logger = logging.getLogger(__name__)


# Valid BrowserGym coordinate-mode actions
VALID_COORD_ACTIONS = {
    "mouse_click", "mouse_move", "mouse_up", "mouse_dblclick", "mouse_drag_and_drop",
    "keyboard_type", "keyboard_press", "keyboard_down", "keyboard_up", "keyboard_insert_text",
    "send_msg_to_user", "report_infeasible", "noop",
    "scroll", "go_back", "go_forward", "goto", "new_tab", "tab_focus", "close_tab",
}


class _RateLimiter:
    """Simple per-process min-interval rate limiter (thread-safe)."""

    def __init__(self):
        self._lock = threading.Lock()
        self._last_request_time = 0.0

    @property
    def min_interval(self) -> float:
        return float(os.environ.get("VLLM_MIN_REQUEST_INTERVAL", "0.3"))

    def wait(self):
        with self._lock:
            now = time.monotonic()
            elapsed = now - self._last_request_time
            wait_time = self.min_interval - elapsed
            if wait_time > 0:
                time.sleep(wait_time)
            self._last_request_time = time.monotonic()


_rate_limiter = _RateLimiter()


# ---------------------------------------------------------------------------
# UI-TARS smart_resize (shared utility, needed by UI-TARS and potentially others)
# ---------------------------------------------------------------------------
IMAGE_FACTOR = 28
MIN_PIXELS = 100 * 28 * 28
MAX_PIXELS = 16384 * 28 * 28
MAX_RATIO = 200


def round_by_factor(number: int, factor: int) -> int:
    return round(number / factor) * factor


def ceil_by_factor(number: int, factor: int) -> int:
    return math.ceil(number / factor) * factor


def floor_by_factor(number: int, factor: int) -> int:
    return math.floor(number / factor) * factor


def smart_resize(
    height: int,
    width: int,
    factor: int = IMAGE_FACTOR,
    min_pixels: int = MIN_PIXELS,
    max_pixels: int = MAX_PIXELS,
) -> tuple[int, int]:
    """Rescale image so that:
    1. Both dimensions are divisible by `factor`.
    2. Total pixels within [min_pixels, max_pixels].
    3. Aspect ratio is maintained as closely as possible.

    This is the EXACT logic from UI-TARS / Qwen-VL for coordinate mapping.
    """
    if max(height, width) / min(height, width) > MAX_RATIO:
        raise ValueError(
            f"absolute aspect ratio must be smaller than {MAX_RATIO}, "
            f"got {max(height, width) / min(height, width)}"
        )
    h_bar = max(factor, round_by_factor(height, factor))
    w_bar = max(factor, round_by_factor(width, factor))
    if h_bar * w_bar > max_pixels:
        beta = math.sqrt((height * width) / max_pixels)
        h_bar = floor_by_factor(int(height / beta), factor)
        w_bar = floor_by_factor(int(width / beta), factor)
    elif h_bar * w_bar < min_pixels:
        beta = math.sqrt(min_pixels / (height * width))
        h_bar = ceil_by_factor(int(height * beta), factor)
        w_bar = ceil_by_factor(int(width * beta), factor)
    return h_bar, w_bar


# ---------------------------------------------------------------------------
# Image encoding
# ---------------------------------------------------------------------------

def image_to_jpg_base64_url(image: np.ndarray | Image.Image) -> str:
    if isinstance(image, np.ndarray):
        image = Image.fromarray(image)
    if image.mode in ("RGBA", "LA"):
        image = image.convert("RGB")
    with io.BytesIO() as buffer:
        image.save(buffer, format="JPEG")
        image_base64 = base64.b64encode(buffer.getvalue()).decode()
    return f"data:image/jpeg;base64,{image_base64}"


def pil_to_base64(image: Image.Image) -> str:
    """Encode PIL image to base64 string (without data URL prefix)."""
    if image.mode in ("RGBA", "LA"):
        image = image.convert("RGB")
    with io.BytesIO() as buf:
        image.save(buf, format="PNG")
        return base64.b64encode(buf.getvalue()).decode()


# ---------------------------------------------------------------------------
# Coordinate helpers
# ---------------------------------------------------------------------------

def normalize_to_browsergym(x: float, y: float, from_scale: int = 1000) -> tuple[int, int]:
    """Map coordinates from an arbitrary 0..from_scale space to BrowserGym 0..1000."""
    bg_x = round(x / from_scale * 1000)
    bg_y = round(y / from_scale * 1000)
    return max(0, min(1000, bg_x)), max(0, min(1000, bg_y))


def transform_normalized_to_pixel(action: str, screen_width: int, screen_height: int) -> str:
    """Convert BrowserGym 0-1000 coordinates in an action string to actual pixel coords."""

    def norm_to_pixel(nx: float, ny: float) -> tuple[int, int]:
        return int(nx / 1000 * screen_width), int(ny / 1000 * screen_height)

    pat2 = r'(mouse_click|mouse_move|mouse_drag_to|mouse_dblclick)\s*\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*\)'

    def rep2(m):
        fn = m.group(1)
        px, py = norm_to_pixel(float(m.group(2)), float(m.group(3)))
        return f"{fn}({px}, {py})"

    pat4 = r'mouse_drag_and_drop\s*\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*\)'

    def rep4(m):
        fx, fy = norm_to_pixel(float(m.group(1)), float(m.group(2)))
        tx, ty = norm_to_pixel(float(m.group(3)), float(m.group(4)))
        return f"mouse_drag_and_drop({fx}, {fy}, {tx}, {ty})"

    result = re.sub(pat4, rep4, action)
    result = re.sub(pat2, rep2, result)
    if result != action:
        logger.info(f"Coord transform: {action} -> {result}")
    return result


# ---------------------------------------------------------------------------
# PixelAgentBase — base class
# ---------------------------------------------------------------------------

class PixelAgentBase(Agent):
    """Base class for pixel-only VLM agents backed by a local vLLM server."""

    def __init__(
        self,
        model_name: str,
        base_url: str | None = None,
        api_key: str = "EMPTY",
        demo_mode: str = "off",
        max_steps_history: int = 10,
        temperature: float = 0.0,
    ) -> None:
        super().__init__()
        self.model_name = model_name
        self.demo_mode = demo_mode
        self.temperature = temperature
        self.max_steps_history = max_steps_history
        self.action_history: list[str] = []
        self.thinking_history: list[str] = []
        self.step_count: int = 0
        self.output_dir: Path | None = None

        resolved_url = base_url or os.environ.get("VLLM_BASE_URL", "http://localhost:8000/v1")
        resolved_key = api_key or os.environ.get("VLLM_API_KEY", "EMPTY")
        self.openai_client = openai.OpenAI(base_url=resolved_url, api_key=resolved_key)
        logger.info(f"[{self.__class__.__name__}] Using vLLM at {resolved_url}, model={model_name}")

        self.action_set = HighLevelActionSet(
            subsets=["chat", "tab", "nav", "coord", "infeas"],
            strict=False,
            multiaction=False,
            demo_mode=demo_mode,
        )

    # ------------------------------------------------------------------
    # API helpers
    # ------------------------------------------------------------------

    def _api_call(self, messages: list, extra_body: dict | None = None, **kwargs) -> Any:
        _rate_limiter.wait()
        cb_kwargs: dict[str, Any] = {"model": self.model_name, "messages": messages}
        if self.temperature is not None:
            cb_kwargs["temperature"] = self.temperature
        if extra_body:
            cb_kwargs["extra_body"] = extra_body
        cb_kwargs.update(kwargs)
        return self.openai_client.chat.completions.create(**cb_kwargs)

    def _api_call_with_retry(self, messages: list, max_retries: int = 5,
                              extra_body: dict | None = None, **kwargs) -> Any:
        last_exc: Exception | None = None
        for attempt in range(max_retries):
            try:
                return self._api_call(messages, extra_body=extra_body, **kwargs)
            except openai.RateLimitError as e:
                last_exc = e
                wait = min(2 ** attempt * 2, 60)
                logger.warning(f"Rate limited, retry in {wait}s (attempt {attempt+1})")
                time.sleep(wait)
            except openai.APIStatusError as e:
                if e.status_code and e.status_code >= 500:
                    last_exc = e
                    wait = min(2 ** attempt * 2, 60)
                    logger.warning(f"Server error {e.status_code}, retry in {wait}s")
                    time.sleep(wait)
                else:
                    raise
            except openai.APIConnectionError as e:
                last_exc = e
                wait = min(2 ** attempt * 2, 30)
                logger.warning(f"Connection error, retry in {wait}s")
                time.sleep(wait)
        raise last_exc  # type: ignore[misc]

    def _send_structured_request(
        self,
        messages: list,
        json_schema: dict | None = None,
        **kwargs,
    ) -> Any:
        """Call vLLM with structured output, with compat shim for old guided_json API."""
        if json_schema is None:
            return self._api_call_with_retry(messages, **kwargs)

        # Try new vLLM >= 0.12 API first
        try:
            extra = {"structured_outputs": {"json": json_schema}}
            return self._api_call_with_retry(messages, extra_body=extra, **kwargs)
        except Exception as e:
            err_str = str(e).lower()
            if "structured_outputs" in err_str or "unknown" in err_str or "unexpected" in err_str:
                logger.info("structured_outputs rejected, falling back to guided_json")
                extra = {"guided_json": json_schema}
                return self._api_call_with_retry(messages, extra_body=extra, **kwargs)
            raise

    # ------------------------------------------------------------------
    # Message building
    # ------------------------------------------------------------------

    def _build_image_content(self, screenshot: np.ndarray | Image.Image) -> dict:
        return {
            "type": "image_url",
            "image_url": {"url": image_to_jpg_base64_url(screenshot), "detail": "high"},
        }

    # ------------------------------------------------------------------
    # Abstract methods each agent must implement
    # ------------------------------------------------------------------

    @abstractmethod
    def _build_messages(self, obs: dict) -> list[dict[str, Any]]:
        """Build the full OpenAI chat messages for this step."""
        ...

    @abstractmethod
    def _parse_response(self, raw: str, obs: dict) -> tuple[str | None, str | None]:
        """Parse model response into (thinking, browsergym_action)."""
        ...

    # ------------------------------------------------------------------
    # Main get_action (shared loop)
    # ------------------------------------------------------------------

    def get_action(self, obs: dict) -> tuple[str, dict]:
        assert obs.get("goal_object"), "Missing goal_object"

        messages = self._build_messages(obs)

        thinking: str | None = None
        action: str | None = None
        raw: str = ""

        for attempt in range(3):
            response = self._api_call_with_retry(messages)
            raw = (response.choices[0].message.content or "").strip()
            logger.info(f"[{self.__class__.__name__}] raw response (first 500): {raw[:500]}")

            if self.output_dir is not None:
                raw_path = self.output_dir / f"raw_response_step_{self.step_count}.txt"
                try:
                    raw_path.write_text(raw, encoding="utf-8")
                except OSError:
                    pass

            thinking, action = self._parse_response(raw, obs)

            if action and self._is_valid_bg_action(action):
                break

            # retry
            messages.append({"role": "assistant", "content": raw})
            messages.append({
                "role": "user",
                "content": "Invalid action. Output EXACTLY ONE valid BrowserGym action, e.g. mouse_click(500, 300)",
            })
            action = None

        if action is None:
            action = "noop(1000)"

        # Transform 0-1000 -> pixels
        screenshot = obs.get("screenshot")
        if screenshot is not None:
            if isinstance(screenshot, np.ndarray):
                sh, sw = screenshot.shape[:2]
            else:
                sw, sh = screenshot.size
            action = transform_normalized_to_pixel(action, sw, sh)

        logger.info(f"STEP {self.step_count}: {action}")
        self.action_history.append(action)
        self.thinking_history.append(thinking or "")
        self.step_count += 1
        return action, {"thinking": thinking, "raw_response": raw, "step": self.step_count - 1}

    @staticmethod
    def _is_valid_bg_action(action: str) -> bool:
        m = re.match(r'^(\w+)\s*\(', action)
        if not m:
            return False
        return m.group(1) in VALID_COORD_ACTIONS


# ---------------------------------------------------------------------------
# PixelAgentBaseArgs — shared dataclass for all pixel VLM agents
# ---------------------------------------------------------------------------

@dataclasses.dataclass
class PixelAgentBaseArgs(AbstractAgentArgs):
    """Shared args for pixel VLM agents."""
    provider: str = ""
    model_name: str = ""
    base_url: str = ""
    api_key: str = "EMPTY"
    demo_mode: str = "off"
    temperature: float = 0.0

    # Observation flags (always pixel-only)
    use_screenshot: bool = True
    use_grid_overlay: bool = False
    grid_size: int = 10
    save_grid_screenshots: bool = False
    save_som_screenshots: bool = False
    use_som_overlay: bool = False
    use_axtree: bool = False
    use_html: bool = False
    action_space: str = "coord"
    auto_close: bool = True

    _output_dir: str | None = None

    def _resolve_base_url(self) -> str:
        return self.base_url or os.environ.get("VLLM_BASE_URL", "http://localhost:8000/v1")

    def make_agent(self) -> Agent:
        raise NotImplementedError("Subclass must implement make_agent")
