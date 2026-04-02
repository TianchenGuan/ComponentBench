"""
ComponentBench Realized Audit – core logic.

CPU-only, Playwright-based, post-implementation measurement pass.
Inspects rendered task pages and records realized UI complexity signals,
then compares them against the intended difficulty metadata from YAML.
"""
from __future__ import annotations

import json
import logging
import math
import os
import re
import socket
import subprocess
import time
from collections import Counter, defaultdict
from dataclasses import dataclass, field, asdict
from datetime import datetime
from multiprocessing import Pool
from pathlib import Path
from typing import Any, Optional

from .types import ComponentBenchTask

logger = logging.getLogger(__name__)

AUDIT_PIPELINE_VERSION = "realized_audit_v1"

# ── Thresholds for mismatch flags ───────────────────────────────────
THRESH_HIGH_INTERACTIVE = 40
THRESH_LOW_INTERACTIVE = 5
THRESH_LARGE_TARGET_AREA = 2000  # px²
THRESH_SMALL_TARGET_PX = 44
THRESH_TINY_TARGET_PX = 24
THRESH_TIGHT_NEIGHBOR_PX = 12
THRESH_HIGH_PRECISION_AXIS = 3
THRESH_LOW_PRECISION_AXIS = 1
THRESH_HIGH_DISAMBIGUATION_AXIS = 3
THRESH_HIGH_DEPTH_AXIS = 3

# ARIA roles of interest
COUNTED_ROLES = [
    "button", "link", "textbox", "searchbox", "spinbutton",
    "checkbox", "radio", "tab", "option", "menuitem",
    "treeitem", "gridcell", "slider", "dialog",
]

# ── JS helpers injected into pages ──────────────────────────────────

JS_COLLECT_METRICS = r"""
() => {
    // Collect all visible interactive elements with bounding boxes
    const INTERACTIVE_SELECTORS = [
        'button', 'a[href]', 'input', 'select', 'textarea', 'summary',
        '[role]', '[tabindex]',
    ];
    const all = new Set();
    for (const sel of INTERACTIVE_SELECTORS) {
        for (const el of document.querySelectorAll(sel)) {
            all.add(el);
        }
    }

    const interactives = [];
    for (const el of all) {
        const r = el.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0) continue;
        const style = window.getComputedStyle(el);
        if (style.visibility === 'hidden' || style.display === 'none' ||
            parseFloat(style.opacity) === 0) continue;

        // Approximate label
        let label = (
            el.getAttribute('aria-label') ||
            ''
        );
        if (!label) {
            const lblById = el.getAttribute('aria-labelledby');
            if (lblById) {
                label = lblById.split(/\s+/).map(
                    id => document.getElementById(id)?.innerText || ''
                ).join(' ');
            }
        }
        if (!label && el.id) {
            const assocLabel = document.querySelector(`label[for="${el.id}"]`);
            if (assocLabel) label = assocLabel.innerText || '';
        }
        if (!label) label = el.innerText || '';
        if (!label) label = el.getAttribute('title') || '';
        if (!label) label = el.getAttribute('alt') || '';
        if (!label) label = el.getAttribute('placeholder') || '';
        label = label.replace(/\s+/g, ' ').trim().substring(0, 200);

        const role = el.getAttribute('role') || el.tagName.toLowerCase();

        interactives.push({
            tag: el.tagName.toLowerCase(),
            role: role,
            label: label,
            x: r.x, y: r.y,
            w: r.width, h: r.height,
            area: r.width * r.height,
            cx: r.x + r.width / 2,
            cy: r.y + r.height / 2,
        });
    }

    // DOM node count
    const domNodeCount = document.querySelectorAll('*').length;

    // Visible text density (chars in body)
    const bodyText = document.body?.innerText || '';
    const visibleTextChars = bodyText.length;

    // Document vs viewport height
    const docHeight = Math.max(
        document.body?.scrollHeight || 0,
        document.documentElement?.scrollHeight || 0
    );
    const vpHeight = window.innerHeight;

    // Role counts (from interactives)
    const roleCounts = {};
    for (const el of interactives) {
        roleCounts[el.role] = (roleCounts[el.role] || 0) + 1;
    }

    // JS errors (collected by our listener)
    const jsErrors = window.__cb_audit_js_errors || [];

    return {
        domNodeCount,
        visibleTextChars,
        docHeight,
        vpHeight,
        interactives,
        roleCounts,
        jsErrorCount: jsErrors.length,
    };
}
"""

JS_INSTALL_ERROR_LISTENER = r"""
() => {
    window.__cb_audit_js_errors = [];
    window.addEventListener('error', (e) => {
        window.__cb_audit_js_errors.push(e.message || String(e));
    });
    window.addEventListener('unhandledrejection', (e) => {
        window.__cb_audit_js_errors.push(e.reason?.message || String(e.reason));
    });
}
"""

JS_COUNT_POPUP_ELEMENTS = r"""
() => {
    let dialogCount = 0, optionCount = 0, treeitemCount = 0, menuitemCount = 0;
    for (const el of document.querySelectorAll('*')) {
        const r = el.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0) continue;
        const role = el.getAttribute('role') || '';
        if (role === 'dialog' || role === 'alertdialog' || el.tagName === 'DIALOG') dialogCount++;
        if (role === 'option' || role === 'listbox') optionCount++;
        if (role === 'treeitem') treeitemCount++;
        if (role === 'menuitem' || role === 'menuitemcheckbox' || role === 'menuitemradio') menuitemCount++;
    }
    return {dialogCount, optionCount, treeitemCount, menuitemCount};
}
"""


# ── Helper: extract quoted phrases from goal text ───────────────────

def extract_quoted_phrases(text: str) -> list[str]:
    """Pull out quoted substrings from goal / ui_copy text."""
    if not text:
        return []
    phrases = re.findall(r'"([^"]+)"', text)
    phrases += re.findall(r"\u201c([^\u201d]+)\u201d", text)  # curly quotes
    return [p.strip() for p in phrases if len(p.strip()) > 1]


# ── Mismatch flag logic ────────────────────────────────────────────

def compute_mismatch_flags(intended: dict, realized: dict) -> list[str]:
    """Return conservative mismatch flag strings."""
    flags: list[str] = []

    if not realized.get("page_loaded"):
        flags.append("PAGE_RENDER_FAILURE")
        return flags

    if realized.get("js_error_count", 0) > 0:
        flags.append("JS_ERROR_ON_LOAD")

    axes = intended.get("axes_ratings", {})
    vis_count = realized.get("visible_interactive_count", 0)
    precision = axes.get("precision_requirement", 0)
    disambig = axes.get("disambiguation_load", 0)
    depth = axes.get("depth_layering", 0)
    density = axes.get("density_choice_interference", 0)

    # Precision checks
    if precision >= THRESH_HIGH_PRECISION_AXIS:
        min_area = realized.get("min_target_area_px2", 99999)
        if min_area >= THRESH_LARGE_TARGET_AREA:
            flags.append("INTENDED_HIGH_PRECISION_BUT_LARGE_TARGETS_ONLY")
    if precision <= THRESH_LOW_PRECISION_AXIS:
        tiny = realized.get("tiny_target_count_lt24", 0)
        if tiny >= 3:
            flags.append("INTENDED_LOW_PRECISION_BUT_MANY_TINY_TARGETS")

    # Disambiguation checks
    if disambig >= THRESH_HIGH_DISAMBIGUATION_AXIS:
        gtp = realized.get("goal_text_probe", {})
        if gtp.get("unique_match"):
            flags.append("INTENDED_HIGH_DISAMBIGUATION_BUT_UNIQUE_TARGET_MATCH")

    # Text guidance check
    guidance = intended.get("scene_context", {}).get("guidance")
    if guidance == "text":
        gtp = realized.get("goal_text_probe", {})
        if gtp.get("visible_match_count", 0) == 0 and len(gtp.get("quoted_phrases", [])) > 0:
            flags.append("INTENDED_TEXT_GUIDANCE_BUT_NO_TARGET_TEXT_MATCH")

    # Clutter / interactive count
    clutter = intended.get("scene_context", {}).get("clutter", "none")
    if clutter == "none" and vis_count > THRESH_HIGH_INTERACTIVE:
        flags.append("INTENDED_LOW_CLUTTER_BUT_HIGH_INTERACTIVE_COUNT")

    # Depth checks
    if depth >= THRESH_HIGH_DEPTH_AXIS:
        probe = realized.get("probe", {})
        probe_dialog = probe.get("post_probe_dialog_count", 0)
        probe_option = probe.get("post_probe_option_count", 0)
        if probe_dialog == 0 and probe_option == 0 and not realized.get("scroll_required"):
            flags.append("INTENDED_HIGH_DEPTH_BUT_NO_OVERLAY_SIGNAL")
    if depth <= 1:
        probe = realized.get("probe", {})
        if probe.get("post_probe_dialog_count", 0) > 0:
            flags.append("INTENDED_LOW_DEPTH_BUT_PROBE_REVEALS_DIALOG_OR_POPUP")

    # Obvious shortcut check
    bucket = intended.get("difficulty_bucket", "")
    if bucket == "hard":
        shortcuts = realized.get("obvious_shortcuts", {})
        if any(shortcuts.values()):
            flags.append("HARD_TASK_HAS_OBVIOUS_SHORTCUT")

    # Multi-instance expectation
    instances = intended.get("scene_context", {}).get("instances", 1)
    if isinstance(instances, int) and instances > 1:
        dup_labels = realized.get("duplicate_accessible_label_count", 0)
        if dup_labels == 0 and vis_count < instances * 2:
            flags.append("MULTI_INSTANCE_EXPECTATION_MISMATCH")

    return flags


# ── Single-task audit (called per worker) ───────────────────────────

def audit_single_task(
    page,
    task: ComponentBenchTask,
    base_url: str,
    timeout_ms: int = 15000,
    probe_mode: str = "off",
    save_screenshot: bool = False,
    screenshot_dir: Path | None = None,
) -> dict:
    """Audit a single task page. Returns the full audit row dict."""
    task_url = f"{base_url}/task/{task.task_id}?mode=benchmark"

    intended = {
        "difficulty_bucket": task.difficulty_level,
        "difficulty_tier": task.difficulty_tier,
        "axes_ratings": task.axes_ratings,
        "scene_context": task.scene_context,
        "difficulty_justification": task.difficulty_justification or "",
    }

    realized: dict[str, Any] = {
        "page_loaded": False,
        "load_ms": 0,
        "js_error_count": 0,
        "dom_node_count": 0,
        "visible_interactive_count": 0,
        "role_counts": {r: 0 for r in COUNTED_ROLES},
        "visible_text_chars": 0,
        "icon_only_interactive_count": 0,
        "duplicate_accessible_label_count": 0,
        "document_height_px": 0,
        "viewport_height_px": 0,
        "scroll_required": False,
        "small_target_count_lt44": 0,
        "tiny_target_count_lt24": 0,
        "min_target_area_px2": 0,
        "median_target_area_px2": 0,
        "tight_neighbor_pairs_lt12px": 0,
        "obvious_shortcuts": {
            "search_input": False,
            "filter_input": False,
            "number_input": False,
            "direct_text_input": False,
        },
        "goal_text_probe": {
            "quoted_phrases": [],
            "visible_match_count": 0,
            "unique_match": False,
        },
        "probe": {
            "mode": probe_mode,
            "attempted": False,
            "clicked": False,
            "reason": None,
            "post_probe_dialog_count": 0,
            "post_probe_option_count": 0,
            "post_probe_treeitem_count": 0,
            "post_probe_menuitem_count": 0,
        },
    }

    artifact_paths: dict[str, str | None] = {"screenshot": None}

    t0 = time.monotonic()

    try:
        # Install error listener before navigation
        page.add_init_script(JS_INSTALL_ERROR_LISTENER.strip())

        resp = page.goto(task_url, wait_until="domcontentloaded", timeout=timeout_ms)
        if resp and resp.status >= 400:
            realized["page_loaded"] = False
            realized["load_ms"] = int((time.monotonic() - t0) * 1000)
            flags = compute_mismatch_flags(intended, realized)
            return _build_row(task, intended, realized, flags, artifact_paths)

        try:
            page.wait_for_load_state("networkidle", timeout=min(timeout_ms, 10000))
        except Exception:
            pass
        page.wait_for_timeout(300)

        realized["page_loaded"] = True
        realized["load_ms"] = int((time.monotonic() - t0) * 1000)

        # Collect metrics via JS
        metrics = page.evaluate(JS_COLLECT_METRICS.strip())

        realized["dom_node_count"] = metrics["domNodeCount"]
        realized["visible_text_chars"] = metrics["visibleTextChars"]
        realized["js_error_count"] = metrics["jsErrorCount"]
        realized["document_height_px"] = metrics["docHeight"]
        realized["viewport_height_px"] = metrics["vpHeight"]
        realized["scroll_required"] = metrics["docHeight"] > metrics["vpHeight"] + 50

        interactives = metrics["interactives"]
        realized["visible_interactive_count"] = len(interactives)

        # Role counts
        for role_key in COUNTED_ROLES:
            realized["role_counts"][role_key] = metrics["roleCounts"].get(role_key, 0)

        # Target size analysis
        areas = [el["area"] for el in interactives if el["area"] > 0]
        if areas:
            areas_sorted = sorted(areas)
            realized["min_target_area_px2"] = round(areas_sorted[0], 1)
            mid = len(areas_sorted) // 2
            realized["median_target_area_px2"] = round(areas_sorted[mid], 1)
        realized["small_target_count_lt44"] = sum(
            1 for el in interactives
            if el["w"] < THRESH_SMALL_TARGET_PX or el["h"] < THRESH_SMALL_TARGET_PX
        )
        realized["tiny_target_count_lt24"] = sum(
            1 for el in interactives
            if el["w"] < THRESH_TINY_TARGET_PX or el["h"] < THRESH_TINY_TARGET_PX
        )

        # Tight neighbor pairs
        tight_pairs = 0
        centers = [(el["cx"], el["cy"]) for el in interactives]
        n = len(centers)
        if n < 500:  # skip expensive O(n²) for very dense pages
            for i in range(n):
                for j in range(i + 1, n):
                    dx = centers[i][0] - centers[j][0]
                    dy = centers[i][1] - centers[j][1]
                    if math.sqrt(dx * dx + dy * dy) < THRESH_TIGHT_NEIGHBOR_PX:
                        tight_pairs += 1
        realized["tight_neighbor_pairs_lt12px"] = tight_pairs

        # Duplicate labels
        labels = [el["label"] for el in interactives if el["label"]]
        label_counts = Counter(labels)
        realized["duplicate_accessible_label_count"] = sum(
            c - 1 for c in label_counts.values() if c > 1
        )

        # Icon-only interactives (empty label)
        realized["icon_only_interactive_count"] = sum(
            1 for el in interactives if not el["label"]
        )

        # Obvious shortcuts
        roles_set = {el["role"] for el in interactives}
        tags_set = {el["tag"] for el in interactives}
        labels_lower = [l.lower() for l in labels]
        realized["obvious_shortcuts"]["search_input"] = (
            "searchbox" in roles_set or
            any("search" in l for l in labels_lower)
        )
        realized["obvious_shortcuts"]["filter_input"] = any(
            "filter" in l for l in labels_lower
        )
        realized["obvious_shortcuts"]["number_input"] = "spinbutton" in roles_set
        realized["obvious_shortcuts"]["direct_text_input"] = (
            "textbox" in roles_set or "input" in tags_set
        )

        # Goal text probe
        goal_text = task.browsergym_goal or ""
        ui_copy = task.ui_copy or ""
        quoted = extract_quoted_phrases(goal_text) + extract_quoted_phrases(ui_copy)
        quoted = list(dict.fromkeys(quoted))  # dedupe preserving order
        realized["goal_text_probe"]["quoted_phrases"] = quoted[:20]

        if quoted:
            body_text_lower = (page.evaluate("() => document.body?.innerText || ''") or "").lower()
            all_labels_text = " ".join(labels).lower()
            match_count = 0
            for phrase in quoted:
                pl = phrase.lower()
                if pl in body_text_lower or pl in all_labels_text:
                    match_count += 1
            realized["goal_text_probe"]["visible_match_count"] = match_count
            realized["goal_text_probe"]["unique_match"] = (match_count == 1 and len(quoted) == 1)

        # Generic reveal probe
        if probe_mode == "generic":
            _do_generic_probe(page, task, interactives, realized, timeout_ms)

    except Exception as e:
        logger.warning(f"Error auditing {task.task_id}: {e}")
        realized["page_loaded"] = False
        realized["load_ms"] = int((time.monotonic() - t0) * 1000)

    flags = compute_mismatch_flags(intended, realized)

    # Screenshot for flagged/error tasks
    should_screenshot = save_screenshot or (flags and screenshot_dir)
    if should_screenshot and screenshot_dir:
        try:
            screenshot_dir.mkdir(parents=True, exist_ok=True)
            ss_path = screenshot_dir / f"{task.task_id}.png"
            page.screenshot(path=str(ss_path))
            artifact_paths["screenshot"] = str(ss_path)
        except Exception:
            pass

    return _build_row(task, intended, realized, flags, artifact_paths)


def _do_generic_probe(
    page, task: ComponentBenchTask, interactives: list[dict],
    realized: dict, timeout_ms: int,
) -> None:
    """One-step generic reveal probe: click a likely primary entry control."""
    realized["probe"]["attempted"] = True

    # Find candidates with haspopup or combobox-like controls
    candidates = []
    for el in interactives:
        role = el["role"]
        if role in ("combobox", "listbox", "button", "summary"):
            candidates.append(el)

    if not candidates:
        realized["probe"]["reason"] = "no_candidate"
        return

    # Prefer element whose label matches a quoted phrase from the goal
    quoted = realized["goal_text_probe"]["quoted_phrases"]
    best = None
    for c in candidates:
        label_lower = c["label"].lower()
        for phrase in quoted:
            if phrase.lower() in label_lower:
                best = c
                break
        if best:
            break

    if not best:
        if len(candidates) == 1:
            best = candidates[0]
        else:
            realized["probe"]["reason"] = "ambiguous_candidates"
            return

    try:
        page.mouse.click(best["cx"], best["cy"])
        page.wait_for_timeout(500)
        realized["probe"]["clicked"] = True

        popup_counts = page.evaluate(JS_COUNT_POPUP_ELEMENTS.strip())
        realized["probe"]["post_probe_dialog_count"] = popup_counts["dialogCount"]
        realized["probe"]["post_probe_option_count"] = popup_counts["optionCount"]
        realized["probe"]["post_probe_treeitem_count"] = popup_counts["treeitemCount"]
        realized["probe"]["post_probe_menuitem_count"] = popup_counts["menuitemCount"]
    except Exception as e:
        realized["probe"]["reason"] = f"click_error: {str(e)[:100]}"


def _build_row(
    task: ComponentBenchTask,
    intended: dict,
    realized: dict,
    flags: list[str],
    artifact_paths: dict,
) -> dict:
    return {
        "task_id": task.task_id,
        "canonical_type": task.canonical_type,
        "implementation_source": task.implementation_source,
        "family_id": task.family_id or "",
        "task_template": task.task_template or "",
        "intended": intended,
        "realized": realized,
        "mismatch_flags": flags,
        "artifact_paths": artifact_paths,
    }


# ── Worker entry point (one per process) ────────────────────────────

def _worker_init(worker_args: dict) -> None:
    """Stored in global for the worker process."""
    import multiprocessing as mp
    global _WORKER_CTX
    _WORKER_CTX = worker_args


def _worker_run_batch(batch_args: dict) -> str:
    """Process a batch of tasks. Returns path to worker JSONL file."""
    from playwright.sync_api import sync_playwright

    tasks_data = batch_args["tasks"]
    base_url = batch_args["base_url"]
    output_dir = Path(batch_args["output_dir"])
    worker_id = batch_args["worker_id"]
    timeout_ms = batch_args["timeout_ms"]
    probe_mode = batch_args["probe_mode"]
    save_flagged = batch_args["save_flagged_artifacts"]
    save_all_ss = batch_args["save_all_screenshots"]
    headless = batch_args["headless"]

    screenshot_dir = output_dir / "screenshots" if (save_flagged or save_all_ss) else None

    worker_jsonl = output_dir / f"worker_{worker_id}.jsonl"
    errors_jsonl = output_dir / f"worker_{worker_id}_errors.jsonl"

    # Reconstruct task objects
    from .types import ComponentBenchTask
    tasks = [ComponentBenchTask(**td) for td in tasks_data]

    rows_written = 0
    errors_written = 0

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=headless)
        context = browser.new_context(viewport={"width": 1280, "height": 720})
        page = context.new_page()

        with open(worker_jsonl, "a", encoding="utf-8") as f_out, \
             open(errors_jsonl, "a", encoding="utf-8") as f_err:

            for task in tasks:
                try:
                    row = audit_single_task(
                        page=page,
                        task=task,
                        base_url=base_url,
                        timeout_ms=timeout_ms,
                        probe_mode=probe_mode,
                        save_screenshot=save_all_ss or (save_flagged and True),
                        screenshot_dir=screenshot_dir,
                    )
                    # Only keep screenshot for flagged/error if not save_all
                    if not save_all_ss and save_flagged and not row["mismatch_flags"]:
                        row["artifact_paths"]["screenshot"] = None
                    f_out.write(json.dumps(row, default=str) + "\n")
                    rows_written += 1
                except Exception as e:
                    err = {
                        "task_id": task.task_id,
                        "error": str(e),
                        "timestamp": datetime.now().isoformat(),
                    }
                    f_err.write(json.dumps(err) + "\n")
                    errors_written += 1
                    logger.warning(f"Worker {worker_id}: error on {task.task_id}: {e}")

        browser.close()

    logger.info(f"Worker {worker_id}: wrote {rows_written} rows, {errors_written} errors")
    return str(worker_jsonl)


# ── Orchestrator ────────────────────────────────────────────────────

def run_audit(
    tasks: list[ComponentBenchTask],
    base_url: str,
    output_dir: Path,
    run_id: str,
    concurrency: int = 4,
    timeout_ms: int = 15000,
    probe_mode: str = "off",
    save_flagged_artifacts: bool = True,
    save_all_screenshots: bool = False,
    headless: bool = True,
    resume: bool = False,
    shard_id: int = 0,
    num_shards: int = 1,
    verbose: bool = False,
) -> dict:
    """Run the realized audit on a list of tasks.

    Returns summary dict.
    """
    output_dir.mkdir(parents=True, exist_ok=True)

    # Resume: load already-audited task IDs
    completed_ids: set[str] = set()
    final_jsonl = output_dir / "audit_rows.jsonl"
    if resume and final_jsonl.exists():
        with open(final_jsonl, "r", encoding="utf-8") as f:
            for line in f:
                try:
                    row = json.loads(line)
                    completed_ids.add(row["task_id"])
                except (json.JSONDecodeError, KeyError):
                    pass
        logger.info(f"Resume: {len(completed_ids)} tasks already audited")

    pending = [t for t in tasks if t.id not in completed_ids]
    logger.info(f"Tasks to audit: {len(pending)} ({len(completed_ids)} already done)")

    if not pending:
        logger.info("Nothing to do.")
        return _load_or_build_summary(output_dir, run_id, shard_id, num_shards)

    # Split tasks into worker batches
    actual_concurrency = min(concurrency, len(pending))
    batches: list[list[ComponentBenchTask]] = [[] for _ in range(actual_concurrency)]
    for i, task in enumerate(pending):
        batches[i % actual_concurrency].append(task)

    batch_args_list = []
    for wid, batch in enumerate(batches):
        if not batch:
            continue
        batch_args_list.append({
            "tasks": [_task_to_serializable(t) for t in batch],
            "base_url": base_url,
            "output_dir": str(output_dir),
            "worker_id": wid,
            "timeout_ms": timeout_ms,
            "probe_mode": probe_mode,
            "save_flagged_artifacts": save_flagged_artifacts,
            "save_all_screenshots": save_all_screenshots,
            "headless": headless,
        })

    logger.info(f"Dispatching {len(pending)} tasks to {len(batch_args_list)} workers")
    t0 = time.monotonic()

    if len(batch_args_list) == 1:
        worker_jsonls = [_worker_run_batch(batch_args_list[0])]
    else:
        with Pool(processes=len(batch_args_list)) as pool:
            worker_jsonls = pool.map(_worker_run_batch, batch_args_list)

    elapsed = time.monotonic() - t0
    logger.info(f"Audit completed in {elapsed:.1f}s")

    # Merge worker outputs into final JSONL
    _merge_worker_outputs(output_dir, worker_jsonls, final_jsonl)

    # Build summary
    summary = _build_summary(output_dir, run_id, shard_id, num_shards)
    return summary


def _task_to_serializable(task: ComponentBenchTask) -> dict:
    """Convert task to a dict that can be reconstructed via ComponentBenchTask(**d)."""
    return {
        "task_id": task.task_id,
        "name": task.name,
        "canonical_type": task.canonical_type,
        "implementation_source": task.implementation_source,
        "browsergym_goal": task.browsergym_goal,
        "implementation_variant": task.implementation_variant,
        "implementation_component": task.implementation_component,
        "task_template": task.task_template,
        "secondary_template": task.secondary_template,
        "ui_copy": task.ui_copy,
        "setup_description": task.setup_description,
        "scene_context": task.scene_context,
        "difficulty_level": task.difficulty_level,
        "difficulty_tier": task.difficulty_tier,
        "axes_ratings": task.axes_ratings,
        "difficulty_justification": task.difficulty_justification,
        "success_trigger": task.success_trigger,
        "family_id": task.family_id,
    }


def _merge_worker_outputs(
    output_dir: Path,
    worker_jsonls: list[str],
    final_jsonl: Path,
) -> None:
    """Append worker JSONL files to the final audit_rows.jsonl."""
    with open(final_jsonl, "a", encoding="utf-8") as fout:
        for wf in worker_jsonls:
            wf_path = Path(wf)
            if wf_path.exists():
                with open(wf_path, "r", encoding="utf-8") as fin:
                    for line in fin:
                        fout.write(line)

    # Merge errors
    errors_jsonl = output_dir / "errors.jsonl"
    with open(errors_jsonl, "a", encoding="utf-8") as fout:
        for wf in worker_jsonls:
            err_path = Path(wf).parent / Path(wf).name.replace(".jsonl", "_errors.jsonl")
            if err_path.exists():
                with open(err_path, "r", encoding="utf-8") as fin:
                    for line in fin:
                        fout.write(line)

    # Clean up worker temp files
    for wf in worker_jsonls:
        try:
            Path(wf).unlink(missing_ok=True)
            err_path = Path(wf).parent / Path(wf).name.replace(".jsonl", "_errors.jsonl")
            err_path.unlink(missing_ok=True)
        except Exception:
            pass


def _load_or_build_summary(output_dir: Path, run_id: str, shard_id: int, num_shards: int) -> dict:
    summary_path = output_dir / "audit_summary.json"
    if summary_path.exists():
        with open(summary_path, "r") as f:
            return json.load(f)
    return _build_summary(output_dir, run_id, shard_id, num_shards)


def _build_summary(output_dir: Path, run_id: str, shard_id: int, num_shards: int) -> dict:
    """Build summary from audit_rows.jsonl and write summary files."""
    final_jsonl = output_dir / "audit_rows.jsonl"
    rows: list[dict] = []
    if final_jsonl.exists():
        with open(final_jsonl, "r", encoding="utf-8") as f:
            for line in f:
                try:
                    rows.append(json.loads(line))
                except json.JSONDecodeError:
                    pass

    # Counts
    total = len(rows)
    loaded = sum(1 for r in rows if r.get("realized", {}).get("page_loaded"))
    flagged = sum(1 for r in rows if r.get("mismatch_flags"))

    # Flag distribution
    flag_counter: Counter = Counter()
    for r in rows:
        for f in r.get("mismatch_flags", []):
            flag_counter[f] += 1

    # By canonical_type
    by_ct: dict[str, dict] = defaultdict(lambda: {"total": 0, "loaded": 0, "flagged": 0})
    for r in rows:
        ct = r.get("canonical_type", "unknown")
        by_ct[ct]["total"] += 1
        if r.get("realized", {}).get("page_loaded"):
            by_ct[ct]["loaded"] += 1
        if r.get("mismatch_flags"):
            by_ct[ct]["flagged"] += 1

    # By library
    by_lib: dict[str, dict] = defaultdict(lambda: {"total": 0, "loaded": 0, "flagged": 0})
    for r in rows:
        lib = r.get("implementation_source", "unknown")
        by_lib[lib]["total"] += 1
        if r.get("realized", {}).get("page_loaded"):
            by_lib[lib]["loaded"] += 1
        if r.get("mismatch_flags"):
            by_lib[lib]["flagged"] += 1

    # By family
    by_fam: dict[str, dict] = defaultdict(lambda: {"total": 0, "loaded": 0, "flagged": 0})
    for r in rows:
        fam = r.get("family_id", "unknown")
        by_fam[fam]["total"] += 1
        if r.get("realized", {}).get("page_loaded"):
            by_fam[fam]["loaded"] += 1
        if r.get("mismatch_flags"):
            by_fam[fam]["flagged"] += 1

    # By difficulty bucket
    by_bucket: dict[str, dict] = defaultdict(lambda: {"total": 0, "loaded": 0, "flagged": 0})
    for r in rows:
        bucket = r.get("intended", {}).get("difficulty_bucket", "unknown")
        by_bucket[bucket]["total"] += 1
        if r.get("realized", {}).get("page_loaded"):
            by_bucket[bucket]["loaded"] += 1
        if r.get("mismatch_flags"):
            by_bucket[bucket]["flagged"] += 1

    # Distributions for numeric metrics (among loaded pages)
    interactive_counts = [
        r["realized"]["visible_interactive_count"]
        for r in rows if r.get("realized", {}).get("page_loaded")
    ]
    target_areas = [
        r["realized"]["median_target_area_px2"]
        for r in rows if r.get("realized", {}).get("page_loaded") and r["realized"].get("median_target_area_px2", 0) > 0
    ]

    summary = {
        "run_id": run_id,
        "pipeline_version": AUDIT_PIPELINE_VERSION,
        "shard_id": shard_id,
        "num_shards": num_shards,
        "timestamp": datetime.now().isoformat(),
        "total_tasks": total,
        "pages_loaded": loaded,
        "pages_failed": total - loaded,
        "tasks_flagged": flagged,
        "flag_distribution": dict(flag_counter.most_common()),
        "by_canonical_type": dict(by_ct),
        "by_library": dict(by_lib),
        "by_family": dict(by_fam),
        "by_difficulty_bucket": dict(by_bucket),
        "interactive_count_stats": _stats(interactive_counts),
        "median_target_area_stats": _stats(target_areas),
    }

    # Write summary
    with open(output_dir / "audit_summary.json", "w") as f:
        json.dump(summary, f, indent=2, default=str)

    # Write mismatch counts
    with open(output_dir / "mismatch_counts.json", "w") as f:
        json.dump(dict(flag_counter.most_common()), f, indent=2)

    # Write flagged tasks CSV
    _write_flagged_csv(rows, output_dir / "flagged_tasks.csv")

    logger.info(
        f"Summary: {total} tasks, {loaded} loaded, {flagged} flagged, "
        f"{len(flag_counter)} distinct flag types"
    )
    return summary


def _stats(values: list[float | int]) -> dict:
    if not values:
        return {"count": 0, "min": 0, "max": 0, "mean": 0, "median": 0, "p10": 0, "p90": 0}
    vs = sorted(values)
    n = len(vs)
    return {
        "count": n,
        "min": round(vs[0], 1),
        "max": round(vs[-1], 1),
        "mean": round(sum(vs) / n, 1),
        "median": round(vs[n // 2], 1),
        "p10": round(vs[max(0, int(n * 0.1))], 1),
        "p90": round(vs[min(n - 1, int(n * 0.9))], 1),
    }


def _write_flagged_csv(rows: list[dict], path: Path) -> None:
    """Write flagged tasks to CSV."""
    import csv
    flagged = [r for r in rows if r.get("mismatch_flags")]
    flagged.sort(key=lambda r: (-len(r["mismatch_flags"]), r["task_id"]))
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["task_id", "canonical_type", "family_id", "difficulty_bucket",
                         "flag_count", "flags"])
        for r in flagged:
            writer.writerow([
                r["task_id"],
                r["canonical_type"],
                r.get("family_id", ""),
                r.get("intended", {}).get("difficulty_bucket", ""),
                len(r["mismatch_flags"]),
                "|".join(r["mismatch_flags"]),
            ])


# ── Run manifest helpers ────────────────────────────────────────────

def get_git_commit() -> str:
    try:
        return subprocess.check_output(
            ["git", "rev-parse", "--short", "HEAD"],
            cwd=Path(__file__).parent.parent.parent.parent,
            stderr=subprocess.DEVNULL,
        ).decode().strip()
    except Exception:
        return ""


def write_audit_manifest(
    output_dir: Path,
    run_id: str,
    base_url: str,
    shard_id: int,
    num_shards: int,
    task_count: int,
    extra: dict | None = None,
) -> None:
    manifest = {
        "pipeline": "realized_audit",
        "pipeline_version": AUDIT_PIPELINE_VERSION,
        "run_id": run_id,
        "git_commit": get_git_commit(),
        "start_ts": datetime.now().isoformat(),
        "end_ts": None,
        "base_url": base_url,
        "shard_id": shard_id,
        "num_shards": num_shards,
        "task_count": task_count,
        "hostname": socket.gethostname(),
        "slurm_job_id": os.environ.get("SLURM_JOB_ID"),
    }
    if extra:
        manifest.update(extra)
    with open(output_dir / "run_manifest.json", "w") as f:
        json.dump(manifest, f, indent=2)


def finalize_audit_manifest(output_dir: Path) -> None:
    manifest_path = output_dir / "run_manifest.json"
    if manifest_path.exists():
        with open(manifest_path) as f:
            m = json.load(f)
        m["end_ts"] = datetime.now().isoformat()
        with open(manifest_path, "w") as f:
            json.dump(m, f, indent=2)
