#!/usr/bin/env python3
"""
clean_human_traces.py — Clean human trajectory run into best-of-two + normalized dataset.

Steps:
  A) Load pass1/pass2 traces per base task
  B) Fix trace integrity resets (keep last non-empty segment)
  C) Normalize typing (merge consecutive type events, collapse Ctrl chords)
  D) Compute per-attempt metrics
  E) Select best attempt (lower step count, tie-break by duration, prefer pass2)
  F) Write cleaned dataset
  G) Produce tar.zst archive

Usage:
  python3 scripts/clean_human_traces.py \
      --input /usr/xtmp/tg295/componentbench-human-traces/human0_20260312 \
      --output /usr/xtmp/tg295/componentbench-human-traces/human0_20260312_clean \
      --archive ~/projects/ComponentBench/data/human_traces/v1_clean.tar.zst
"""
from __future__ import annotations

import argparse
import csv
import json
import os
import random
import subprocess
import sys
from collections import defaultdict
from dataclasses import dataclass, field, asdict
from pathlib import Path


# ---------------------------------------------------------------------------
# Step B: Fix trace integrity resets
# ---------------------------------------------------------------------------

def split_segments(steps: list[dict]) -> list[list[dict]]:
    """Split trace into segments wherever step index resets."""
    if not steps:
        return []
    segments: list[list[dict]] = [[]]
    prev_i = -1
    for s in steps:
        i = s.get("i", 0)
        if i <= prev_i or (i == 0 and prev_i >= 0):
            segments.append([])
        segments[-1].append(s)
        prev_i = i
    return [seg for seg in segments if seg]


def fix_resets(steps: list[dict]) -> tuple[list[dict], int]:
    """Keep only the last non-empty segment. Returns (fixed_steps, n_segments)."""
    segments = split_segments(steps)
    n_seg = len(segments)
    if n_seg <= 1:
        return steps, n_seg
    # Pick last non-empty segment; fall back to previous if last is empty
    for seg in reversed(segments):
        if seg:
            return seg, n_seg
    return [], n_seg


# ---------------------------------------------------------------------------
# Step C: Normalize typing
# ---------------------------------------------------------------------------

BREAK_KEYS = {"Backspace", "Enter", "Tab", "Escape", "Delete"}
TYPE_MERGE_GAP_MS = 800
CTRL_CHORD_GAP_MS = 200


def normalize_typing(steps: list[dict]) -> list[dict]:
    """Merge consecutive type events and collapse Ctrl chords."""
    if not steps:
        return []

    result: list[dict] = []
    i = 0
    while i < len(steps):
        s = steps[i]

        # Ctrl chord detection: key:"Control" followed by key:"v/c/a/x/z" within gap
        if (s.get("type") == "key" and s.get("key") == "Control"
                and i + 1 < len(steps)):
            nxt = steps[i + 1]
            if (nxt.get("type") == "key"
                    and nxt.get("key", "").lower() in ("v", "c", "a", "x", "z")
                    and nxt.get("t_ms", 0) - s.get("t_ms", 0) <= CTRL_CHORD_GAP_MS):
                merged = dict(s)
                merged["key"] = f"Ctrl+{nxt['key'].upper()}"
                merged["t_ms_end"] = nxt.get("t_ms", merged.get("t_ms", 0))
                result.append(merged)
                i += 2
                continue

        # Type merging
        if s.get("type") == "type":
            buf_text = s.get("text", "")
            buf_step = dict(s)
            buf_t_start = s.get("t_ms", 0)
            buf_t_end = buf_t_start
            j = i + 1
            while j < len(steps):
                nxt = steps[j]
                if nxt.get("type") == "type":
                    gap = nxt.get("t_ms", 0) - buf_t_end
                    if gap <= TYPE_MERGE_GAP_MS:
                        buf_text += nxt.get("text", "")
                        buf_t_end = nxt.get("t_ms", buf_t_end)
                        j += 1
                        continue
                    else:
                        break
                elif nxt.get("type") == "key" and nxt.get("key") in BREAK_KEYS:
                    break
                else:
                    break
            buf_step["text"] = buf_text
            buf_step["t_ms_end"] = buf_t_end
            result.append(buf_step)
            i = j
            continue

        result.append(s)
        i += 1

    # Reindex
    for idx, s in enumerate(result):
        s["i"] = idx

    return result


# ---------------------------------------------------------------------------
# Step D: Compute metrics
# ---------------------------------------------------------------------------

@dataclass
class AttemptInfo:
    pass_num: int
    episode_dir: str
    raw_steps: int
    normalized_steps: int
    duration_ms: int
    had_resets: bool
    n_segments: int
    steps: list[dict] = field(default_factory=list)


def compute_metrics(steps: list[dict], pass_num: int, ep_dir: str,
                    raw_count: int, had_resets: bool, n_seg: int) -> AttemptInfo:
    duration = max((s.get("t_ms", 0) for s in steps), default=0) if steps else 0
    return AttemptInfo(
        pass_num=pass_num,
        episode_dir=ep_dir,
        raw_steps=raw_count,
        normalized_steps=len(steps),
        duration_ms=duration,
        had_resets=had_resets,
        n_segments=n_seg,
        steps=steps,
    )


# ---------------------------------------------------------------------------
# Step E: Select best attempt
# ---------------------------------------------------------------------------

def select_best(p1: AttemptInfo | None, p2: AttemptInfo | None) -> AttemptInfo | None:
    candidates = [a for a in [p1, p2] if a is not None and a.normalized_steps > 0]
    if not candidates:
        # Both are hover-only (0 steps)
        return p2 or p1
    if len(candidates) == 1:
        return candidates[0]
    a, b = candidates
    if a.normalized_steps < b.normalized_steps:
        return a
    if b.normalized_steps < a.normalized_steps:
        return b
    if a.duration_ms < b.duration_ms:
        return a
    if b.duration_ms < a.duration_ms:
        return b
    # Tie: prefer pass2
    return b if b.pass_num == 2 else a


# ---------------------------------------------------------------------------
# Main pipeline
# ---------------------------------------------------------------------------

def process_one_task(base_task_id: str, src_episodes: Path) -> dict:
    """Process one base task, return summary dict."""
    result = {
        "task_id": base_task_id,
        "status": "SUCCESS",
        "chosen_pass": 0,
        "source_episode_dir": "",
        "raw_steps": 0,
        "normalized_steps": 0,
        "duration_ms": 0,
        "hover_only": False,
        "had_resets": False,
        "pass1_steps": None,
        "pass2_steps": None,
    }

    attempts: dict[int, AttemptInfo | None] = {1: None, 2: None}

    for pass_num in [1, 2]:
        ep_dir = src_episodes / f"{base_task_id}_pass{pass_num}"
        trace_path = ep_dir / "trace.jsonl"
        meta_path = ep_dir / "meta.json"

        if not meta_path.exists():
            continue

        meta = json.loads(meta_path.read_text())
        if meta.get("status") not in ("SUCCESS", "FAILED"):
            continue

        if not trace_path.exists():
            attempts[pass_num] = AttemptInfo(
                pass_num=pass_num, episode_dir=str(ep_dir),
                raw_steps=0, normalized_steps=0, duration_ms=0,
                had_resets=False, n_segments=0, steps=[],
            )
            continue

        raw_lines = [l for l in trace_path.read_text().strip().split("\n") if l.strip()]
        raw_steps = [json.loads(l) for l in raw_lines]
        raw_count = len(raw_steps)

        fixed, n_seg = fix_resets(raw_steps)
        had_resets = n_seg > 1
        normalized = normalize_typing(fixed)

        attempts[pass_num] = compute_metrics(
            normalized, pass_num, str(ep_dir), raw_count, had_resets, n_seg,
        )

    best = select_best(attempts[1], attempts[2])
    if best is None:
        result["status"] = "MISSING"
        return result

    result["chosen_pass"] = best.pass_num
    result["source_episode_dir"] = best.episode_dir
    result["raw_steps"] = best.raw_steps
    result["normalized_steps"] = best.normalized_steps
    result["duration_ms"] = best.duration_ms
    result["had_resets"] = best.had_resets
    result["hover_only"] = best.normalized_steps == 0
    result["pass1_steps"] = attempts[1].normalized_steps if attempts[1] else None
    result["pass2_steps"] = attempts[2].normalized_steps if attempts[2] else None
    result["_best_steps"] = best.steps  # transient, not written to meta

    return result


def main():
    parser = argparse.ArgumentParser(description="Clean human trajectory run")
    parser.add_argument("--input", required=True, help="Raw trace root")
    parser.add_argument("--output", required=True, help="Clean output root")
    parser.add_argument("--archive", default="", help="Path for tar.zst archive")
    args = parser.parse_args()

    src = Path(args.input)
    dst = Path(args.output)
    dst.mkdir(parents=True, exist_ok=True)

    # Load run config
    run_json = json.loads((src / "run.json").read_text())
    progress = json.loads((src / "progress.json").read_text())

    # Discover base task IDs
    base_tasks: set[str] = set()
    for d in (src / "episodes").iterdir():
        if d.is_dir():
            name = d.name
            base = name.replace("_pass1", "").replace("_pass2", "")
            base_tasks.add(base)
    base_tasks_sorted = sorted(base_tasks)

    print(f"Base tasks: {len(base_tasks_sorted)}")
    print(f"Processing...")

    # Process all tasks
    summaries: list[dict] = []
    stats = defaultdict(int)
    anomalies: list[dict] = []

    for i, task_id in enumerate(base_tasks_sorted):
        result = process_one_task(task_id, src / "episodes")
        summaries.append(result)

        stats["total"] += 1
        if result["status"] == "MISSING":
            stats["missing"] += 1
            anomalies.append({"task_id": task_id, "issue": "no valid trace"})
        elif result["hover_only"]:
            stats["hover_only"] += 1
        else:
            stats["with_trace"] += 1
        if result["had_resets"]:
            stats["resets_fixed"] += 1

        if (i + 1) % 500 == 0:
            print(f"  {i+1}/{len(base_tasks_sorted)}...")

    # Write cleaned episodes
    ep_out = dst / "episodes"
    ep_out.mkdir(parents=True, exist_ok=True)

    for s in summaries:
        task_id = s["task_id"]
        task_dir = ep_out / task_id
        task_dir.mkdir(parents=True, exist_ok=True)

        best_steps = s.pop("_best_steps", [])

        meta = {
            "task_id": task_id,
            "status": s["status"],
            "chosen_pass": s["chosen_pass"],
            "source_episode_dir": s["source_episode_dir"],
            "raw_steps": s["raw_steps"],
            "normalized_steps": s["normalized_steps"],
            "duration_ms": s["duration_ms"],
            "hover_only": s["hover_only"],
            "had_resets": s["had_resets"],
            "pass1_steps": s["pass1_steps"],
            "pass2_steps": s["pass2_steps"],
        }
        (task_dir / "meta.json").write_text(json.dumps(meta, indent=2) + "\n")

        if best_steps:
            lines = [json.dumps(step) for step in best_steps]
            (task_dir / "trace.jsonl").write_text("\n".join(lines) + "\n")

    # Write run.json with cleaning notes
    clean_run = dict(run_json)
    clean_run["cleaning"] = {
        "source": str(src),
        "policy": "best-of-two + normalized",
        "type_merge_gap_ms": TYPE_MERGE_GAP_MS,
        "ctrl_chord_gap_ms": CTRL_CHORD_GAP_MS,
        "break_keys": sorted(BREAK_KEYS),
    }
    (dst / "run.json").write_text(json.dumps(clean_run, indent=2) + "\n")

    # Write clean_summary.json
    pass_choices = defaultdict(int)
    for s in summaries:
        if s["chosen_pass"]:
            pass_choices[s["chosen_pass"]] += 1

    summary = {
        "tasks_total": stats["total"],
        "tasks_with_trace": stats["with_trace"],
        "hover_only_tasks": stats["hover_only"],
        "missing_tasks": stats["missing"],
        "traces_with_resets_fixed": stats["resets_fixed"],
        "chosen_pass1": pass_choices.get(1, 0),
        "chosen_pass2": pass_choices.get(2, 0),
        "avg_normalized_steps": round(
            sum(s["normalized_steps"] for s in summaries if not s["hover_only"] and s["status"] != "MISSING")
            / max(stats["with_trace"], 1), 2
        ),
        "avg_duration_ms": round(
            sum(s["duration_ms"] for s in summaries if not s["hover_only"] and s["status"] != "MISSING")
            / max(stats["with_trace"], 1), 1
        ),
    }
    (dst / "clean_summary.json").write_text(json.dumps(summary, indent=2) + "\n")

    # Write hover_only.csv
    hover_tasks = [s for s in summaries if s["hover_only"]]
    if hover_tasks:
        with open(dst / "hover_only.csv", "w", newline="") as f:
            w = csv.writer(f)
            w.writerow(["task_id"])
            for s in hover_tasks:
                w.writerow([s["task_id"]])

    # Write anomalies.csv
    if anomalies:
        with open(dst / "anomalies.csv", "w", newline="") as f:
            w = csv.writer(f)
            w.writerow(["task_id", "issue"])
            for a in anomalies:
                w.writerow([a["task_id"], a["issue"]])

    print(f"\n{'='*60}")
    print(f"CLEANING SUMMARY")
    print(f"{'='*60}")
    for k, v in summary.items():
        print(f"  {k}: {v}")
    print(f"  anomalies: {len(anomalies)}")
    print(f"  output: {dst}")

    # --- Sanity checks ---
    print(f"\n{'='*60}")
    print(f"SANITY CHECKS")
    print(f"{'='*60}")

    # Check no resets in cleaned traces
    reset_violations = 0
    contiguity_violations = 0
    for task_dir in sorted(ep_out.iterdir()):
        trace = task_dir / "trace.jsonl"
        if not trace.exists():
            continue
        lines = [l for l in trace.read_text().strip().split("\n") if l.strip()]
        steps = [json.loads(l) for l in lines]
        prev_i = -1
        for s in steps:
            if s["i"] <= prev_i and prev_i >= 0:
                reset_violations += 1
                break
            if s["i"] != prev_i + 1:
                contiguity_violations += 1
                break
            prev_i = s["i"]

    print(f"  Traces with index resets: {reset_violations}")
    print(f"  Traces with non-contiguous indices: {contiguity_violations}")

    # Top 20 by step count
    ranked = sorted(
        [s for s in summaries if s["normalized_steps"] > 0],
        key=lambda x: -x["normalized_steps"]
    )
    print(f"\n  Top 20 tasks by step count:")
    for s in ranked[:20]:
        print(f"    {s['task_id']:45s} steps={s['normalized_steps']:3d}  dur={s['duration_ms']:6d}ms  pass={s['chosen_pass']}")

    # Sample merged typing examples
    print(f"\n  Sample merged typing (3 random tasks with type steps):")
    type_tasks = []
    for s in summaries:
        trace = ep_out / s["task_id"] / "trace.jsonl"
        if not trace.exists():
            continue
        lines = [l for l in trace.read_text().strip().split("\n") if l.strip()]
        if any(json.loads(l).get("type") == "type" for l in lines):
            type_tasks.append(s)

    for s in random.sample(type_tasks, min(3, len(type_tasks))):
        trace = ep_out / s["task_id"] / "trace.jsonl"
        steps = [json.loads(l) for l in trace.read_text().strip().split("\n") if l.strip()]
        type_steps = [st for st in steps if st.get("type") == "type"]
        print(f"    {s['task_id']}: {len(type_steps)} type steps")
        for ts in type_steps[:3]:
            print(f"      step {ts['i']}: text={ts.get('text','')!r}")

    # Archive
    if args.archive:
        print(f"\n{'='*60}")
        print(f"Creating archive: {args.archive}")
        archive_path = Path(args.archive)
        archive_path.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(
            ["tar", "--zstd", "-cf", str(archive_path), "-C", str(dst.parent), dst.name],
            check=True,
        )
        size_mb = archive_path.stat().st_size / 1024 / 1024
        print(f"  Archive: {archive_path} ({size_mb:.1f} MB)")

    print(f"\nDone.")


if __name__ == "__main__":
    main()
