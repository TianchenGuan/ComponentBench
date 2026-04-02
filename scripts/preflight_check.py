#!/usr/bin/env python3
"""
ComponentBench v0.3.1 Preflight Health Check (Playwright-based)

Verifies task pages load correctly by actually rendering them with Playwright.
This catches client-side hydration errors (e.g., "Task not found") that
urllib-based checks miss because the pages are client-rendered React apps.

Default ON in Slurm (PRECHECK=1).

Behavior:
- Default: sample 1 task per canonical type (~97 URLs) + fragile types
- --full: check ALL tasks (~2910 URLs)
- Detects "Task not found" / "Task component not found" / other error signatures
- Outputs CSV report
- Exit non-zero if any task fails (unless --allow-failures)

Usage:
    python scripts/preflight_componentbench_health.py --base-url http://localhost:3002
    python scripts/preflight_componentbench_health.py --base-url http://localhost:3002 --full
    python scripts/preflight_componentbench_health.py --base-url http://localhost:3002 --allow-failures
"""
from __future__ import annotations

import argparse
import csv
import logging
import os
import random
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
logger = logging.getLogger(__name__)

# Known fragile canonical types that MUST always be checked
FRAGILE_TYPES = [
    "transfer_list",
    "markdown_editor",
    "rich_text_editor",
    "code_editor",
    "json_editor",
    "kanban_board_drag_drop",
    "select_native",
]

# Error signatures in rendered page text (case-insensitive check)
ERROR_SIGNATURES = [
    "task not found",
    "task component not found",
    "task ui not implemented",
    "application error",
    "internal server error",
    "cannot find module",
    "unhandled runtime error",
]


def check_task_playwright(page, url: str, task_id: str, timeout_ms: int) -> dict:
    """Check a single task URL using Playwright. Returns result dict."""
    result = {
        "task_id": task_id,
        "url": url,
        "status": "ok",
        "detail": "",
    }
    try:
        resp = page.goto(url, wait_until="domcontentloaded", timeout=timeout_ms)
        if resp and resp.status >= 400:
            result["status"] = "nav_error"
            result["detail"] = f"HTTP {resp.status}"
            return result
        
        # Wait for hydration (JS rendering)
        try:
            page.wait_for_load_state("networkidle", timeout=timeout_ms)
        except Exception:
            pass  # networkidle can timeout on some pages; continue anyway
        
        # Small buffer for React hydration
        page.wait_for_timeout(500)
        
        # Get rendered text content
        body_text = page.evaluate("() => document.body?.innerText || ''")
        body_lower = body_text.lower()
        
        for sig in ERROR_SIGNATURES:
            if sig in body_lower:
                result["status"] = "error_signature"
                result["detail"] = f"Found: '{sig}'"
                return result
        
        return result
    
    except Exception as e:
        err_str = str(e)
        if "timeout" in err_str.lower():
            result["status"] = "timeout"
        else:
            result["status"] = "nav_error"
        result["detail"] = err_str[:200]
        return result


def main():
    parser = argparse.ArgumentParser(
        description="ComponentBench preflight health check (Playwright-based)"
    )
    parser.add_argument("--base-url", "--base_url", type=str, default="http://localhost:3002")
    parser.add_argument("--full", action="store_true", help="Check ALL tasks")
    parser.add_argument("--sample-per-type", type=int, default=1, help="Tasks per canonical type (default: 1)")
    parser.add_argument("--timeout-ms", type=int, default=15000, help="Per-page timeout in ms (default: 15000)")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for sampling (default: 42)")
    parser.add_argument("--output-csv", "--output_csv", type=str, default="reports/tables/preflight_health.csv")
    parser.add_argument("--allow-failures", "--allow_failures", action="store_true",
                        help="Exit 0 even if failures exist")
    parser.add_argument("--data-dir", "--data_dir", type=str, default="data/tasks_v1")
    args = parser.parse_args()

    os.chdir(Path(__file__).parent.parent)

    from benchmark.core.loader import load_all_tasks

    all_tasks = load_all_tasks(args.data_dir)
    logger.info(f"Loaded {len(all_tasks)} tasks")

    # Sampling
    if args.full:
        tasks_to_check = list(all_tasks)
        logger.info("Full mode: checking all tasks")
    else:
        rng = random.Random(args.seed)
        # Group by canonical type
        by_type: dict[str, list] = {}
        for t in all_tasks:
            by_type.setdefault(t.canonical_type, []).append(t)
        
        tasks_to_check = []
        seen_types = set()
        
        # Always include fragile types first
        for ct in FRAGILE_TYPES:
            if ct in by_type:
                sample = by_type[ct][:args.sample_per_type]
                tasks_to_check.extend(sample)
                seen_types.add(ct)
        
        # Sample from remaining types
        for ct in sorted(by_type.keys()):
            if ct not in seen_types:
                pool = by_type[ct]
                sample = rng.sample(pool, min(args.sample_per_type, len(pool)))
                tasks_to_check.extend(sample)
                seen_types.add(ct)
        
        logger.info(f"Sample mode: {len(tasks_to_check)} tasks ({len(seen_types)} types, seed={args.seed})")

    # Playwright check
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        logger.error("Playwright not installed. Run: pip install playwright && playwright install chromium")
        return 1

    all_results = []
    ok_count = 0
    fail_count = 0
    error_count = 0
    start = time.time()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()

        for i, task in enumerate(tasks_to_check):
            url = f"{args.base_url}/task/{task.id}?mode=benchmark"
            result = check_task_playwright(page, url, task.id, args.timeout_ms)
            result["canonical_type"] = task.canonical_type
            all_results.append(result)

            if result["status"] == "ok":
                ok_count += 1
            elif result["status"] in ("error_signature",):
                fail_count += 1
                logger.error(f"FAIL [{task.id}] ({task.canonical_type}): {result['detail']}")
            else:
                error_count += 1
                logger.warning(f"ERROR [{task.id}] ({task.canonical_type}): {result['status']} - {result['detail']}")

            if (i + 1) % 20 == 0:
                logger.info(f"  Checked {i+1}/{len(tasks_to_check)}...")

        browser.close()

    elapsed = time.time() - start

    # Write CSV
    csv_path = Path(args.output_csv)
    csv_path.parent.mkdir(parents=True, exist_ok=True)
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["task_id", "canonical_type", "url", "status", "detail"])
        writer.writeheader()
        writer.writerows(all_results)
    logger.info(f"Wrote {len(all_results)} results to {csv_path}")

    # Summary
    total_failures = fail_count + error_count
    print(f"\nPRECHECK: ok={ok_count} fail={fail_count} errors={error_count} "
          f"csv={csv_path} elapsed={elapsed:.1f}s")

    if total_failures > 0:
        if args.allow_failures:
            logger.warning(f"{total_failures} failures detected but --allow-failures is set")
            return 0
        logger.error(f"{total_failures} failures detected! Fix the site deployment.")
        return 1

    logger.info("All preflight checks passed!")
    return 0


if __name__ == "__main__":
    sys.exit(main())
