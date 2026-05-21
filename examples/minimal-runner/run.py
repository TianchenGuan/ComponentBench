#!/usr/bin/env python3
"""Minimal one-task runner — a hand-rolled example without the bundled harness.

This is intentionally bare-bones. See scripts/run_benchmark.py for the real thing.
"""

from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

try:
    import yaml  # type: ignore
except ImportError:
    print("Need PyYAML: pip install pyyaml", file=sys.stderr)
    sys.exit(1)

try:
    from playwright.sync_api import sync_playwright  # type: ignore
except ImportError:
    print("Need Playwright: pip install playwright && playwright install chromium", file=sys.stderr)
    sys.exit(1)


REPO_ROOT = Path(__file__).resolve().parent.parent.parent


def load_task(task_id: str) -> dict:
    """Load one task spec from data/tasks_v{1,2}/."""
    canonical = task_id.split("-")[0]
    for suite in ("tasks_v1", "tasks_v2"):
        yaml_path = REPO_ROOT / "data" / suite / f"{canonical}.yaml"
        if not yaml_path.exists():
            continue
        with yaml_path.open() as f:
            tasks = yaml.safe_load(f) or []
        for t in tasks:
            if t.get("id") == task_id:
                return t
    raise FileNotFoundError(f"task_id {task_id!r} not found in data/tasks_v{{1,2}}/")


def model_pick_coord(task: dict, screenshot_bytes: bytes) -> tuple[int, int]:
    """PLACEHOLDER. Replace with your model's response parser.

    Receives the task spec and a screenshot. Returns (x, y) pixel coords.
    """
    # Hardcoded center-click placeholder. Most tasks will not pass.
    return (640, 384)


def run_one(task: dict, site_url: str, max_steps: int = 20) -> dict:
    task_id = task["id"]
    url = f"{site_url.rstrip('/')}/task/{task_id}?mode=benchmark"

    started = time.time()
    passed = False
    n_steps = 0

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 768})
        page = context.new_page()
        page.goto(url, wait_until="networkidle")

        for step in range(max_steps):
            n_steps = step + 1
            shot = page.screenshot()
            x, y = model_pick_coord(task, shot)
            page.mouse.click(x, y)
            # Poll for success banner. Programmatic verification only.
            try:
                page.wait_for_selector("#cb-success-banner", timeout=1500)
                passed = True
                break
            except Exception:
                continue

        browser.close()

    elapsed = time.time() - started
    return {
        "task_id": task_id,
        "canonical_type": task.get("canonical_type"),
        "library": task.get("implementation_source"),
        "benchmark_version": "v1" if "T" in task_id and task_id.split("-")[0] in task.get("canonical_type", "") else "v1",
        "model_id": "placeholder",
        "mode": "pixel",
        "passed": passed,
        "cum_reward": 1.0 if passed else 0.0,
        "n_steps": n_steps,
        "elapsed_s": elapsed,
        "terminated": passed,
        "truncated": not passed,
        "err_msg": None,
    }


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--task-id", required=True)
    ap.add_argument("--version", default="0.5.0")
    ap.add_argument("--site-url", default="https://www.interfacegym.com")
    ap.add_argument("--max-steps", type=int, default=20)
    ap.add_argument("--out", default="-", help="Path to write result JSON (- for stdout)")
    args = ap.parse_args()

    task = load_task(args.version, args.task_id)
    result = run_one(task, args.site_url, args.max_steps)
    payload = json.dumps(result, indent=2)

    if args.out == "-":
        print(payload)
    else:
        Path(args.out).write_text(payload + "\n")
        print(f"wrote {args.out}")
    return 0 if result["passed"] else 1


if __name__ == "__main__":
    sys.exit(main())
