"""
ComponentBenchTask - BrowserGym Task for ComponentBench v0.2.

This task class integrates with BrowserGym to provide:
1. Proper task setup (navigation to task page in benchmark mode)
2. Step-by-step validation via DOM success banner detection
3. Early termination when task succeeds

Success is detected purely via DOM: checking for #cb-success-banner element.
This is different from component_gym v0.1 which used an HTTP API.
"""
from __future__ import annotations

import logging
from typing import Tuple, Any, Optional

import playwright.sync_api

from browsergym.core.task import AbstractBrowserTask

logger = logging.getLogger(__name__)


# ── Mode normalization ──────────────────────────────────────────────
# Canonical internal id: "ax_tree"
# Legacy alias still accepted on input: "webarena"
# Display label: "AX-tree"

MODE_ALIASES: dict[str, str] = {}

VALID_MODES = ("ax_tree", "som", "pixel_grid", "pixel", "ui_tars_native")

MODE_DISPLAY_NAMES: dict[str, str] = {
    "ax_tree":          "AX-tree",
    "som":              "SoM",
    "pixel_grid":       "Pixel-grid",
    "pixel":            "Pixel",
    "ui_tars_native":   "UI-TARS Native",
}


def normalize_mode(mode: str) -> str:
    """Normalize a mode string to its canonical internal id.

    Accepts both canonical names (ax_tree, som, ...) and the legacy
    alias "webarena", mapping it to "ax_tree".
    """
    return MODE_ALIASES.get(mode, mode)


def mode_display_name(mode: str) -> str:
    """Return the user-facing display label for a mode."""
    canonical = normalize_mode(mode)
    return MODE_DISPLAY_NAMES.get(canonical, canonical)


# Observation mode configurations (same as run_full_benchmark.py)
OBS_MODES = {
    "ax_tree": {
        "use_screenshot": True,
        "use_axtree": True,
        "use_som_overlay": False,
        "use_grid_overlay": False,
        "use_html": False,
        "save_grid_screenshots": False,
        "pixel_only": False,
        "action_space": "bid",
    },
    "som": {
        "use_screenshot": True,
        "use_axtree": False,
        "use_som_overlay": True,
        "use_grid_overlay": False,
        "use_html": False,
        "save_grid_screenshots": False,
        "pixel_only": True,
        "action_space": "bid",
    },
    "pixel": {
        "use_screenshot": True,
        "use_axtree": False,
        "use_som_overlay": False,
        "use_grid_overlay": False,
        "use_html": False,
        "save_grid_screenshots": False,
        "pixel_only": True,
        "action_space": "coord",
    },
    "pixel_grid": {
        "use_screenshot": True,
        "use_axtree": False,
        "use_som_overlay": False,
        "use_grid_overlay": True,
        "use_html": False,
        "save_grid_screenshots": True,
        "pixel_only": True,
        "action_space": "coord",
    },
    "ui_tars_native": {
        "use_screenshot": True,
        "use_axtree": False,
        "use_som_overlay": False,
        "use_grid_overlay": False,
        "use_html": False,
        "save_grid_screenshots": False,
        "pixel_only": True,
        "action_space": "coord",
    },
}


def get_action_instructions(mode: str) -> str:
    """Get mode-specific action instructions for the agent.
    
    Args:
        mode: Observation mode (ax_tree, som, pixel_grid, pixel)
        
    Returns:
        Action instruction string
    """
    canonical = normalize_mode(mode)
    obs_config = OBS_MODES.get(canonical, OBS_MODES["ax_tree"])
    action_space = obs_config.get("action_space", "bid")
    
    if action_space == "bid":
        if canonical == "som":
            return """HOW TO INTERACT:
- Use element IDs from the Set-of-Mark overlay numbers shown on the screenshot
- Element IDs appear as numbered labels on interactive elements
- Use the number directly: click('42'), not click('[42]')
- For text input: fill('42', 'your text')"""
        else:  # ax_tree
            return """HOW TO INTERACT:
- Use element IDs from the accessibility tree, shown in square brackets like [123]
- Use just the number in quotes: click('123'), not click('[123]')
- For text input: fill('123', 'your text')
- The accessibility tree shows the page structure with element IDs"""
    else:  # coord
        if mode == "pixel_grid":
            return """HOW TO INTERACT:
- Use pixel coordinates based on the screenshot with grid overlay
- The grid divides the screen into a 10x10 reference system
- Estimate coordinates from grid intersections
- Click: mouse_click(x, y)
- Type: keyboard_type('your text')
- For text fields, click first then type"""
        elif mode == "ui_tars_native":
            return """HOW TO INTERACT:
- Use pixel coordinates based on the screenshot
- Click: mouse_click(x, y)
- Double-click: mouse_dblclick(x, y)
- Type text: keyboard_type('your text')
- Scroll: scroll(x, y, dx, dy)
- Drag: mouse_drag_and_drop(x1, y1, x2, y2)
- Keyboard shortcut: keyboard_press('key')
- For text fields, click first then type"""
        else:  # pixel
            return """HOW TO INTERACT:
- Use pixel coordinates based on the screenshot
- Estimate element positions visually
- Click: mouse_click(x, y)
- Type: keyboard_type('your text')
- For text fields, click first then type"""


def build_goal_string(
    task_goal: str,
    mode: str,
    task_id: Optional[str] = None,
) -> str:
    """Build the full goal string for the agent.
    
    Args:
        task_goal: The browsergym_goal from the task
        mode: Observation mode
        task_id: Optional task ID for reference
        
    Returns:
        Complete goal string with instructions
    """
    action_instructions = get_action_instructions(mode)
    
    goal = f"""GOAL: {task_goal}

COMPLETION RULE:
When the task is complete, a green success banner will appear at the top of the page.
The system will automatically detect this and end the task.

{action_instructions}

RULES:
- Do not navigate to other websites
- Stay on this page (unless the task requires in-site navigation)
- Use only the provided action functions
- Look at the screenshot carefully before acting
- If you see a success banner at the top, the task is complete
- File uploads are simulated via an in-page modal; interact with the modal UI. Do NOT use upload_file or mouse_upload_file actions."""
    
    return goal


class ComponentBenchBrowserTask(AbstractBrowserTask):
    """
    BrowserGym task for ComponentBench v0.2.
    
    Success is determined by detecting the #cb-success-banner element
    in the DOM, which appears when the task is completed correctly.
    """
    
    nondeterministic: bool = False
    
    def __init__(
        self,
        seed: int,
        base_url: str,
        task_config: dict,
        mode: str = "ax_tree",
    ) -> None:
        """
        Initialize the task.
        
        Args:
            seed: Random seed for reproducibility
            base_url: Base URL of ComponentBench site (e.g., http://localhost:3002)
            task_config: Task configuration dict containing:
                - task_id: Unique task identifier (e.g., button-antd-T01)
                - browsergym_goal: Goal text for the agent
                - canonical_type: Component type (e.g., button)
                - implementation_source: Library (antd/mui/mantine)
            mode: Observation mode (ax_tree, som, pixel_grid, pixel).
                  Legacy value "webarena" is accepted and normalized to "ax_tree".
        """
        super().__init__(seed)
        
        self.base_url = base_url.rstrip('/')
        self.task_config = task_config
        self.mode = normalize_mode(mode)
        
        self.task_id = task_config.get("task_id", "unknown")
        self.browsergym_goal = task_config.get("browsergym_goal", "Complete the task")
        self.canonical_type = task_config.get("canonical_type", "")
        self.implementation_source = task_config.get("implementation_source", "")
        self.benchmark_version = task_config.get("benchmark_version", "v1")
        
        # Task properties for BrowserGym
        self.viewport = {"width": 1280, "height": 720}
        self.slow_mo = 100
        self.timeout = 10000  # 10 seconds
        
        logger.info(f"ComponentBenchBrowserTask initialized: {self.task_id} (mode={mode})")
    
    @classmethod
    def get_task_id(cls, task_id: str | None = None) -> str:
        """Return the task ID (required by AbstractBrowserTask)."""
        if task_id is None:
            raise ValueError("task_id must be provided")
        return task_id
    
    def setup(self, page: playwright.sync_api.Page) -> Tuple[str, dict]:
        """
        Set up the task environment.
        
        1. Navigate to the task page in benchmark mode
        2. Wait for page to be ready
        
        Args:
            page: Playwright page object
            
        Returns:
            Tuple of (goal string, info dict)
        """
        self.page = page
        
        # Navigate to the task page in benchmark mode
        # URL format: /task/{taskId}?mode=benchmark[&bench=v2]
        start_url = f"{self.base_url}/task/{self.task_id}?mode=benchmark"
        if self.benchmark_version == "v2":
            start_url += "&bench=v2"
        logger.info(f"Navigating to: {start_url}")
        
        try:
            page.goto(start_url, wait_until="networkidle", timeout=30000)
        except Exception as e:
            logger.warning(f"Navigation timeout, continuing anyway: {e}")
            # Continue even if timeout - page might still be usable
        
        # Wait for main content to be ready
        try:
            page.wait_for_selector("main, [data-view-mode='benchmark'], body", timeout=5000)
        except Exception as e:
            logger.warning(f"Could not find main element: {e}")
        
        goal = build_goal_string(self.browsergym_goal, self.mode, self.task_id)
        info = self._get_info()
        
        return goal, info
    
    def validate(
        self,
        page: playwright.sync_api.Page,
        chat_messages: list[str]
    ) -> Tuple[float, bool, str, dict]:
        """
        Validate the current state - called after each agent action.
        
        Checks for the #cb-success-banner element in the DOM.
        This banner appears when the task is completed successfully.
        
        Args:
            page: Playwright page object
            chat_messages: List of chat messages from agent (unused)
            
        Returns:
            Tuple of (reward, done, message, info)
        """
        info = self._get_info()
        
        # Check for success banner in DOM
        try:
            # Primary check: #cb-success-banner element
            success_banner = page.locator("#cb-success-banner")
            if success_banner.count() > 0:
                logger.info(f"Task {self.task_id} SUCCEEDED: Success banner detected")
                return 1.0, True, "Task completed successfully", info
            
            # Secondary check: data attribute on document
            task_done = page.evaluate(
                "() => document.documentElement.dataset.taskDone === 'true'"
            )
            if task_done:
                logger.info(f"Task {self.task_id} SUCCEEDED: taskDone data attribute detected")
                return 1.0, True, "Task completed successfully", info
            
            # Tertiary check: window global
            window_done = page.evaluate(
                "() => window.__COMPONENT_BENCH_TASK_DONE__ === true"
            )
            if window_done:
                logger.info(f"Task {self.task_id} SUCCEEDED: Window global detected")
                return 1.0, True, "Task completed successfully", info
                
        except Exception as e:
            logger.warning(f"Error checking success state: {e}")
        
        # Task not yet complete
        return 0.0, False, "", info
    
    def teardown(self) -> None:
        """Clean up after task completion."""
        logger.info(f"Task {self.task_id} torn down")
    
    def _get_info(self) -> dict:
        """Get info dict for the current state."""
        return {
            "task_id": self.task_id,
            "canonical_type": self.canonical_type,
            "implementation_source": self.implementation_source,
            "mode": self.mode,
        }
