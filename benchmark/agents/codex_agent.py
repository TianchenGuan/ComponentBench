"""
Codex CLI Agent for ComponentBench.

Uses `codex exec` (subprocess) to invoke OpenAI models with ChatGPT OAuth
credentials. No API key needed — authentication is handled by the Codex CLI
via ~/.codex/auth.json (file-based credential store).

Setup:
    npm i -g @openai/codex
    codex login --device-auth
    codex login status  # verify

Usage:
    The runner creates CodexAgentArgs with provider="codex_cli" and calls
    make_agent() to get a CodexAgent instance.
"""
from __future__ import annotations

import dataclasses
import io
import logging
import os
import re
import subprocess
import tempfile
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image

from browsergym.experiments import AbstractAgentArgs, Agent

# Reuse action parsing/validation from openai_agent
from agents.openai_agent import (
    _extract_thinking_and_action,
    _is_valid_action,
    _transform_normalized_to_pixel,
    _find_last_valid_action,
    _try_parse_single_action,
    _strip_code_fences,
    _safe_for_console,
    VALID_COORD_ACTIONS,
    VALID_BID_ACTIONS,
)

logger = logging.getLogger(__name__)


class CodexRateLimitError(Exception):
    """Raised when Codex CLI reports rate limit / usage limit exhaustion."""
    pass


# Keywords in stderr that indicate rate/usage limits
RATE_LIMIT_KEYWORDS = [
    "rate limit",
    "usage limit",
    "too many requests",
    "quota",
    "credits",
    "limit exceeded",
    "throttl",
]


def _save_screenshot_png(image: np.ndarray | Image.Image, path: str) -> None:
    """Save a screenshot as PNG to the given path."""
    if isinstance(image, np.ndarray):
        image = Image.fromarray(image)
    if image.mode in ("RGBA", "LA"):
        image = image.convert("RGB")
    image.save(path, format="PNG")


def _check_rate_limit(stderr: str) -> None:
    """Check stderr for rate limit signals and raise if found."""
    stderr_lower = stderr.lower()
    for kw in RATE_LIMIT_KEYWORDS:
        if kw in stderr_lower:
            raise CodexRateLimitError(f"Codex rate/usage limit detected: '{kw}' found in stderr")


class CodexAgent(Agent):
    """
    Agent that invokes `codex exec` for each LLM step.

    Each call:
    1. Saves screenshot(s) to temp files
    2. Builds a text prompt with instructions + goal + action history
    3. Runs `codex exec --image <img> --model <model> ... "<prompt>"`
    4. Reads the assistant's reply from --output-last-message file
    5. Parses the reply for thinking + action
    6. Validates and optionally retries on invalid actions
    """

    def __init__(
        self,
        model_name: str = "gpt-5.1-codex-mini",
        action_space: str = "coord",
        codex_binary: str = "codex",
        codex_home: str | None = None,
        timeout: int = 120,
        max_retries: int = 2,
        dry_run: bool = False,
        use_screenshot: bool = True,
        use_grid_overlay: bool = True,
        grid_size: int = 10,
        save_grid_screenshots: bool = True,
        save_som_screenshots: bool = False,
        use_som_overlay: bool = False,
        use_axtree: bool = False,
        use_html: bool = False,
        auto_close: bool = True,
    ) -> None:
        super().__init__()
        self.model_name = model_name
        self.action_space = action_space
        self.codex_binary = codex_binary
        self.codex_home = codex_home
        self.timeout = timeout
        self.max_retries = max_retries
        self.dry_run = dry_run
        self.use_screenshot = use_screenshot
        self.use_grid_overlay = use_grid_overlay
        self.grid_size = grid_size
        self.save_grid_screenshots = save_grid_screenshots
        self.save_som_screenshots = save_som_screenshots
        self.use_som_overlay = use_som_overlay
        self.use_axtree = use_axtree
        self.use_html = use_html
        self.auto_close = auto_close

        self.action_history: list[str] = []
        self.thinking_history: list[str] = []
        self.step_count = 0
        self._output_dir: str | None = None
        self.rate_limited = False  # Set True when rate limit is hit

        logger.info(f"CodexAgent initialized: model={model_name}, action_space={action_space}")

    def _build_instructions(self) -> str:
        """Build the system-level instructions for the prompt."""
        if self.action_space == "coord":
            action_example = "mouse_click(500, 300)"
        else:
            action_example = "click('42')"

        instructions = f"""\
You are a web UI agent. You look at a screenshot of a web page and perform actions to complete a task.

RESPONSE FORMAT:
First, optionally explain your reasoning in <think> tags, then output EXACTLY ONE action.

<think>
1. What you observe on the page
2. What you will do next and why
</think>

{action_example}

RULES:
- Output EXACTLY ONE action function call after your thinking
- Do NOT output multiple actions
- Do NOT use upload_file or mouse_upload_file actions
- File uploads are simulated via an in-page modal; interact with the modal UI instead"""

        if self.action_space == "coord":
            instructions += """
- For clicking: mouse_click(x, y) where x,y are integers 0-1000
- For typing: keyboard_type('text')
- For scrolling: scroll(dx, dy)
- Coordinates use a 0-1000 normalized scale"""
        else:
            instructions += """
- For clicking: click('element_id') using IDs from the accessibility tree
- For typing: fill('element_id', 'text')
- Element IDs appear in [brackets] in the accessibility tree"""

        return instructions

    def _build_prompt(self, obs: dict) -> str:
        """Build the full prompt string from observation."""
        parts = []

        # Instructions
        parts.append(self._build_instructions())
        parts.append("")

        # Goal
        parts.append("# Goal")
        for part in obs.get("goal_object", []):
            if isinstance(part, dict) and part.get("type") == "text":
                parts.append(part["text"])
            elif isinstance(part, str):
                parts.append(part)
        parts.append("")

        # Accessibility tree (for bid action space)
        if self.use_axtree and obs.get("axtree_txt"):
            parts.append("# Accessibility Tree")
            axtree = obs["axtree_txt"]
            if len(axtree) > 8000:
                axtree = axtree[:8000] + "\n... (truncated)"
            parts.append(axtree)
            parts.append("")

        # Action history (last 10 steps)
        if self.action_history:
            parts.append("# Recent Action History")
            start = max(0, len(self.action_history) - 10)
            for i, action in enumerate(self.action_history[start:], start=start):
                step_text = f"Step {i + 1}: {action}"
                if i < len(self.thinking_history) and self.thinking_history[i]:
                    reasoning = self.thinking_history[i][:150]
                    step_text = f"Step {i + 1} (reasoning: {reasoning}...): {action}"
                parts.append(step_text)
            parts.append("")

        parts.append("Look at the attached screenshot and output your next action.")
        return "\n".join(parts)

    def _call_codex(self, prompt: str, image_paths: list[str]) -> str:
        """Call `codex exec` and return the assistant's reply text."""
        with tempfile.NamedTemporaryFile(suffix=".txt", delete=False, mode="w") as reply_file:
            reply_path = reply_file.name

        try:
            cmd = [self.codex_binary, "exec"]
            cmd.extend(["--model", self.model_name])
            cmd.extend(["--sandbox", "read-only"])
            cmd.extend(["--skip-git-repo-check"])
            cmd.extend(["--output-last-message", reply_path])

            for img_path in image_paths:
                cmd.extend(["--image", img_path])

            # Pass prompt via stdin (using "-" placeholder) to avoid
            # shell argument length limits and special character issues
            cmd.append("-")

            env = os.environ.copy()
            if self.codex_home:
                env["CODEX_HOME"] = self.codex_home

            logger.info(f"Calling codex exec (model={self.model_name}, images={len(image_paths)}, prompt_len={len(prompt)})")

            result = subprocess.run(
                cmd,
                input=prompt,
                capture_output=True,
                text=True,
                timeout=self.timeout,
                env=env,
            )

            # Check for rate limits in stderr.
            # BrowserGym's experiment loop catches exceptions from get_action(),
            # so we can't propagate CodexRateLimitError directly. Instead we
            # write a marker file that the runner checks after each task.
            if result.stderr:
                try:
                    _check_rate_limit(result.stderr)
                except CodexRateLimitError as e:
                    logger.error(f"RATE LIMIT DETECTED: {e}")
                    self.rate_limited = True
                    # Write marker to the results output_dir (set by runner via env)
                    marker_dir = os.environ.get("COMPONENTBENCH_OUTPUT_DIR", "")
                    if marker_dir:
                        marker = Path(marker_dir) / ".rate_limited"
                        marker.write_text(str(e))
                        logger.error(f"Wrote rate limit marker: {marker}")
                    else:
                        logger.error("No COMPONENTBENCH_OUTPUT_DIR set; cannot write marker file")
                    return "noop(1000)"

            if result.returncode != 0:
                logger.warning(
                    f"codex exec exited with code {result.returncode}\n"
                    f"stderr: {result.stderr[:500]}"
                )

            # Read the reply
            if os.path.exists(reply_path) and os.path.getsize(reply_path) > 0:
                with open(reply_path, "r") as f:
                    reply = f.read().strip()
            else:
                # Fall back to stdout
                reply = result.stdout.strip()

            if not reply:
                logger.warning("Empty reply from codex exec")
                reply = "noop(1000)"

            return reply
        finally:
            try:
                os.unlink(reply_path)
            except OSError:
                pass

    def get_action(self, obs: dict) -> tuple[str, dict]:
        """Get the next action from the Codex CLI."""
        assert obs.get("goal_object"), "Missing goal_object."

        # Dry run mode: skip codex call
        if self.dry_run:
            self.action_history.append("noop(1000)")
            self.thinking_history.append("dry_run mode")
            self.step_count += 1
            return "noop(1000)", {"thinking": "dry_run mode", "step": self.step_count}

        # Save screenshot(s) to temp files
        image_paths = []
        tmp_files = []
        try:
            if self.use_screenshot and obs.get("screenshot") is not None:
                screenshot = obs["screenshot"]
                tmp = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
                tmp_files.append(tmp.name)
                _save_screenshot_png(screenshot, tmp.name)
                image_paths.append(tmp.name)

                # Grid overlay
                if self.use_grid_overlay:
                    try:
                        from utils.grid_overlay import create_grid_overlay
                        if isinstance(screenshot, np.ndarray):
                            pil_img = Image.fromarray(screenshot)
                        else:
                            pil_img = screenshot
                        grid_img = create_grid_overlay(pil_img, grid_size=self.grid_size)
                        tmp_grid = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
                        tmp_files.append(tmp_grid.name)
                        grid_img.save(tmp_grid.name, format="PNG")
                        image_paths.append(tmp_grid.name)

                        if self.save_grid_screenshots and self._output_dir:
                            grid_save_path = os.path.join(
                                self._output_dir, f"grid_step_{self.step_count}.png"
                            )
                            grid_img.save(grid_save_path, format="PNG")
                    except Exception as e:
                        logger.warning(f"Failed to create grid overlay: {e}")

            # Build prompt
            prompt = self._build_prompt(obs)

            # Call codex with retry on invalid actions
            thinking = None
            action = None
            repair_context = ""

            for attempt in range(self.max_retries + 1):
                if attempt > 0:
                    # Repair prompt
                    repair_prompt = (
                        f"{repair_context}\n\n"
                        f"Your last action was invalid. Output exactly one valid action line.\n"
                        f"Example: {('mouse_click(500, 300)' if self.action_space == 'coord' else 'click(42)')}"
                    )
                    raw_reply = self._call_codex(repair_prompt, image_paths)
                else:
                    raw_reply = self._call_codex(prompt, image_paths)

                logger.info(f"CODEX REPLY (first 500 chars): {_safe_for_console(raw_reply[:500])}")

                # Parse thinking + action
                thinking, action = _extract_thinking_and_action(raw_reply, self.action_space)

                if action is not None:
                    is_valid, error_msg = _is_valid_action(action, self.action_space)
                    if is_valid:
                        break
                    else:
                        logger.warning(f"Invalid action (attempt {attempt+1}): {action} - {error_msg}")
                        repair_context = f"ERROR: {error_msg}"
                        action = None
                else:
                    logger.warning(f"No action parsed (attempt {attempt+1})")
                    repair_context = "No valid action found in your response."

            # Fallback
            if action is None:
                action = "noop(1000)"
                logger.warning("All retries exhausted, falling back to noop(1000)")

            # Transform coordinates for coord mode
            if self.action_space == "coord" and obs.get("screenshot") is not None:
                screenshot = obs["screenshot"]
                if isinstance(screenshot, np.ndarray):
                    h, w = screenshot.shape[:2]
                elif isinstance(screenshot, Image.Image):
                    w, h = screenshot.size
                else:
                    w, h = 1280, 720
                action = _transform_normalized_to_pixel(action, w, h)

            # Record history
            self.action_history.append(action)
            self.thinking_history.append(thinking or "")
            self.step_count += 1

            metadata = {
                "thinking": thinking,
                "action": action,
                "step": self.step_count,
                "model": self.model_name,
                "backend": "codex_cli",
            }

            logger.info(f"STEP {self.step_count} ACTION: {action}")

            return action, metadata

        finally:
            # Clean up temp files
            for tmp in tmp_files:
                try:
                    os.unlink(tmp)
                except OSError:
                    pass


@dataclasses.dataclass
class CodexAgentArgs(AbstractAgentArgs):
    """Arguments for creating a CodexAgent."""

    model_name: str = "gpt-5.1-codex-mini"
    demo_mode: str = "off"
    use_screenshot: bool = True
    use_grid_overlay: bool = True
    grid_size: int = 10
    save_grid_screenshots: bool = True
    save_som_screenshots: bool = False
    use_som_overlay: bool = False
    use_axtree: bool = False
    use_html: bool = False
    action_space: str = "coord"
    auto_close: bool = True
    codex_binary: str = "codex"
    codex_home: str | None = None
    timeout: int = 120
    max_retries: int = 2
    dry_run: bool = False
    _output_dir: str | None = None

    def make_agent(self) -> CodexAgent:
        return CodexAgent(
            model_name=self.model_name,
            action_space=self.action_space,
            codex_binary=self.codex_binary,
            codex_home=self.codex_home,
            timeout=self.timeout,
            max_retries=self.max_retries,
            dry_run=self.dry_run,
            use_screenshot=self.use_screenshot,
            use_grid_overlay=self.use_grid_overlay,
            grid_size=self.grid_size,
            save_grid_screenshots=self.save_grid_screenshots,
            save_som_screenshots=self.save_som_screenshots,
            use_som_overlay=self.use_som_overlay,
            use_axtree=self.use_axtree,
            use_html=self.use_html,
            auto_close=self.auto_close,
        )
