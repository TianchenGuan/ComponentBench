#!/usr/bin/env python3
"""
pack_run.py — Convert a BrowserGym run directory into packed episodes.

Each episode produces:
  episode.json       – metadata + per-step thinking/action
  frames_raw.mp4     – 1 fps, GOP=1, faststart; raw screenshots
  frames_annot.mp4   – (pixel modes) screenshots with action overlays
  frames_som.mp4     – (som mode) SoM overlay screenshots
  frames_grid.mp4    – (pixel_grid mode) grid overlay screenshots

Video spec:  1 fps, GOP=1, every frame is keyframe, faststart, frame count == step count.

Usage:
  python3 scripts/logpack/pack_run.py \
      --input /usr/xtmp/tg295/componentbench-results \
      --output /usr/xtmp/tg295/componentbench-packed/run_001 \
      --run-id qwen3-vl-235b-v03 \
      --model-name "Qwen/Qwen3-VL-235B-A22B-Thinking-FP8" \
      --agent-name openrouter_agent \
      [--modes ax_tree,pixel]  \
      [--limit 5]
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import tempfile
from concurrent.futures import ProcessPoolExecutor, as_completed
from dataclasses import dataclass, field, asdict
from datetime import datetime
from pathlib import Path
from typing import Optional


@dataclass
class StepInfo:
    step_idx: int
    timestamp: str = ""
    thinking: str = ""
    action: str = ""
    raw_model_output: str = ""
    error: str = ""
    transformed_action: str = ""


@dataclass
class EpisodeData:
    run_id: str
    packed_run_id: str
    mode: str
    task_id: str
    canonical_type: str
    library: str
    success: bool
    reward: float
    steps: int
    duration_seconds: float
    termination_reason: str
    difficulty_bucket: str = ""
    difficulty_tier: str = ""
    task_name: str = ""
    family_id: str = ""
    model_name: str = ""
    agent_name: str = ""
    commit_sha: str = ""
    hostname: str = ""
    start_ts: str = ""
    end_ts: str = ""
    step_list: list = field(default_factory=list)
    videos: dict = field(default_factory=dict)


# ---------------------------------------------------------------------------
# Log parser
# ---------------------------------------------------------------------------
_TS = r"\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d+"
_RE_STEP_HEADER = re.compile(rf"({_TS}).*?STEP (\d+)")
_RE_THINKING = re.compile(rf"({_TS}).*?THINKING:\s*$")
_RE_ACTION = re.compile(rf"({_TS}).*?ACTION:\s*(.+)")
_RE_RAW_RESPONSE = re.compile(rf"({_TS}).*?RAW RESPONSE \(first \d+ chars\):\s*(.*)")
_RE_TRANSFORMED = re.compile(r"Transformed coordinates:.*?->\s*(.+)")
_RE_COORD_TRANSFORM = re.compile(r"Coord transform:.*?->\s*(.+)")
_RE_LOG_PREFIX = re.compile(rf"^{_TS} - \d+ - [\w.]+ - \w+ -\s*")
# UI-TARS / PixelVLM logs action on the STEP line: "STEP N: action (native: ...)"
_RE_STEP_WITH_ACTION = re.compile(rf"({_TS}).*?STEP (\d+):\s*(\S+\(.*?\))(?:\s*\(native:\s*(.+?)\))?\s*$")
_RE_TS_START = re.compile(rf"^{_TS}")


def _collect_multiline(lines: list[str], start: int) -> tuple[str, int]:
    """Collect continuation lines until next timestamped log entry. Returns (text, next_index)."""
    parts = []
    j = start
    while j < len(lines):
        if _RE_TS_START.match(lines[j]):
            break
        parts.append(lines[j])
        j += 1
    return "\n".join(parts), j


def parse_experiment_log(log_path: Path) -> list[StepInfo]:
    """Parse experiment.log to extract per-step thinking/action/raw output.

    The log sequence for each step is:
      RAW RESPONSE ...   (appears BEFORE the STEP header for that step)
      Transformed ...    (pixel modes only)
      === STEP N ===
      THINKING:
        (no thinking captured)   OR   actual thinking lines
      --- (separator) ---
      ACTION: ...

    So RAW RESPONSE for step N is logged *before* STEP N header.
    We buffer it and attach to the next step header we see.

    Additionally, raw_response_step_N.txt files contain full (non-truncated)
    model output. We load those after log parsing to supplement any truncated
    raw_model_output from the log.
    """
    if not log_path.exists():
        return []

    text = log_path.read_text(errors="replace")
    lines = text.split("\n")
    steps: dict[int, StepInfo] = {}
    pending_raw = ""
    pending_transformed = ""

    i = 0
    while i < len(lines):
        line = lines[i]

        # RAW RESPONSE (multiline) — buffer for the upcoming step
        raw_m = _RE_RAW_RESPONSE.match(line)
        if raw_m:
            first_part = raw_m.group(2)
            continuation, j = _collect_multiline(lines, i + 1)
            pending_raw = (first_part + "\n" + continuation).strip() if continuation else first_part.strip()
            i = j
            continue

        # Transformed coordinates — also buffer for upcoming step
        trans_m = _RE_TRANSFORMED.search(line)
        if not trans_m:
            trans_m = _RE_COORD_TRANSFORM.search(line)
        if trans_m:
            pending_transformed = trans_m.group(1).strip()
            i += 1
            continue

        # STEP header — also handles inline action from PixelVLM/UI-TARS:
        #   "STEP 0: mouse_click(186, 296) (native: click(start_box='(188,300)'))"
        step_action_m = _RE_STEP_WITH_ACTION.match(line)
        if step_action_m:
            ts = step_action_m.group(1)
            idx = int(step_action_m.group(2))
            bg_action = step_action_m.group(3).strip()
            native_action = step_action_m.group(4)
            if idx not in steps:
                steps[idx] = StepInfo(step_idx=idx, timestamp=ts)
            else:
                steps[idx].timestamp = ts
            steps[idx].action = native_action.strip() if native_action else bg_action
            steps[idx].transformed_action = bg_action
            if pending_raw:
                steps[idx].raw_model_output = pending_raw
                pending_raw = ""
            if pending_transformed:
                steps[idx].transformed_action = pending_transformed
                pending_transformed = ""
            i += 1
            continue

        # Plain STEP header (BrowserGym standard format, no inline action)
        step_m = _RE_STEP_HEADER.match(line)
        if step_m:
            ts = step_m.group(1)
            idx = int(step_m.group(2))
            if idx not in steps:
                steps[idx] = StepInfo(step_idx=idx, timestamp=ts)
            else:
                steps[idx].timestamp = ts
            if pending_raw:
                steps[idx].raw_model_output = pending_raw
                pending_raw = ""
            if pending_transformed:
                steps[idx].transformed_action = pending_transformed
                pending_transformed = ""
            i += 1
            continue

        # THINKING
        think_m = _RE_THINKING.match(line)
        if think_m:
            thinking_lines = []
            j = i + 1
            while j < len(lines):
                nl = lines[j]
                if re.match(rf"{_TS}.*?(----|----|ACTION:|====)", nl):
                    break
                content = _RE_LOG_PREFIX.sub("", nl)
                thinking_lines.append(content)
                j += 1
            thinking_text = "\n".join(thinking_lines).strip()
            if thinking_text and thinking_text != "(no thinking captured)":
                cur_idx = _latest_step_idx(steps)
                if cur_idx is not None:
                    steps[cur_idx].thinking = thinking_text
            i = j
            continue

        # ACTION
        action_m = _RE_ACTION.match(line)
        if action_m:
            cur_idx = _latest_step_idx(steps)
            if cur_idx is not None:
                steps[cur_idx].action = action_m.group(2).strip()
            i += 1
            continue

        i += 1

    # Post-process: load full raw_response_step_N.txt files if present
    trace_dir = log_path.parent
    for s in steps.values():
        raw_file = trace_dir / f"raw_response_step_{s.step_idx}.txt"
        if raw_file.exists():
            try:
                full_raw = raw_file.read_text(errors="replace").strip()
                if full_raw and len(full_raw) > len(s.raw_model_output):
                    s.raw_model_output = full_raw
            except OSError:
                pass

    # Derive thinking: prefer explicit thinking from log; fall back to
    # raw_model_output with action lines stripped out.
    for s in steps.values():
        if not s.thinking and s.raw_model_output:
            s.thinking = _derive_thinking_from_raw(s.raw_model_output, s.action)

    return [steps[k] for k in sorted(steps.keys())]


def _derive_thinking_from_raw(raw: str, action: str) -> str:
    """Extract thinking from raw model output when no <think> tags exist.

    Priority:
      1. Content inside <think>...</think> tags
      2. Content after "Thought:" and before "Action:" (UI-TARS format)
      3. Everything before the last action call in the raw text
      4. The full raw text (better than nothing)
    """
    # Try <think> tags first
    think_m = re.search(r"<think>(.*?)</think>", raw, re.DOTALL | re.IGNORECASE)
    if think_m:
        return think_m.group(1).strip()

    # UI-TARS Thought: ... Action: ... format
    thought_m = re.search(r'Thought:\s*(.+?)(?=\nAction:|$)', raw, re.DOTALL)
    if thought_m:
        return thought_m.group(1).strip()

    # Strip action from the end to get reasoning
    if action:
        fn_name = action.split("(")[0] if "(" in action else action
        pattern = re.escape(fn_name) + r"\s*\("
        matches = list(re.finditer(pattern, raw))
        if matches:
            last = matches[-1]
            candidate = raw[:last.start()].strip()
            if candidate and len(candidate) > 10:
                # Also strip code fences
                candidate = re.sub(r"^```\w*\s*\n?", "", candidate)
                candidate = re.sub(r"\n?```$", "", candidate)
                return candidate.strip()

    return raw.strip()


def _latest_step_idx(steps: dict[int, StepInfo]) -> int | None:
    return max(steps.keys()) if steps else None


# ---------------------------------------------------------------------------
# Episode discovery
# ---------------------------------------------------------------------------
def discover_episodes(input_dir: Path, modes: list[str] | None) -> list[tuple[str, Path, dict | None]]:
    episodes = []
    results_index: dict[str, dict[str, dict]] = {}

    available_modes = sorted(
        d.name for d in input_dir.iterdir()
        if d.is_dir() and d.name in ("ax_tree", "webarena", "som", "pixel_grid", "pixel", "ui_tars_native")
    )
    if modes:
        available_modes = [m for m in available_modes if m in modes]

    for mode in available_modes:
        mode_dir = input_dir / mode
        results_jsonl = mode_dir / "results.jsonl"
        if results_jsonl.exists():
            for line in results_jsonl.read_text().strip().split("\n"):
                if not line.strip():
                    continue
                row = json.loads(line)
                tid = row.get("task_id", "")
                if mode not in results_index:
                    results_index[mode] = {}
                results_index[mode][tid] = row

        for trace_dir in sorted(mode_dir.iterdir()):
            if not trace_dir.is_dir() or trace_dir.name.startswith("."):
                continue
            parts = trace_dir.name.split("_", 4)
            if len(parts) < 5:
                continue

            row = None
            if mode in results_index:
                for tid, r in results_index[mode].items():
                    exp_dir = r.get("exp_dir", "")
                    if trace_dir.name in exp_dir or trace_dir.name == os.path.basename(exp_dir):
                        row = r
                        break
                    # Match _{canonical_type}_{task_id} suffix to avoid
                    # "button-antd-T01" matching "icon_button-antd-T01"
                    ct_m = re.match(r"(.+)-(?:antd|mui|mantine|external)-T\d+$", tid)
                    if ct_m:
                        expected = f"_{ct_m.group(1)}_{tid}"
                        if trace_dir.name.endswith(expected):
                            row = r
                            break

            episodes.append((mode, trace_dir, row))

    return episodes


# ---------------------------------------------------------------------------
# Screenshot utilities
# ---------------------------------------------------------------------------
def _glob_screenshots(trace_dir: Path, pattern: str) -> dict[int, Path]:
    """Glob for screenshots matching pattern, return {step_idx: path}."""
    result = {}
    for p in trace_dir.glob(pattern):
        m = re.search(r"(\d+)\.png$", p.name)
        if m:
            result[int(m.group(1))] = p
    return result


def get_frame_paths(trace_dir: Path, mode: str, n_steps: int) -> dict[str, list[Path]]:
    """Get frame paths for all video variants. Returns {variant_name: [path_per_step]}."""
    raw_shots = _glob_screenshots(trace_dir, "screenshot_step_*.png")
    som_shots = _glob_screenshots(trace_dir, "screenshot_som_step_*.png")
    grid_shots = _glob_screenshots(trace_dir, "grid_step_*.png")

    variants: dict[str, list[Path]] = {}

    # raw: always from screenshot_step_*.png
    # Include at least the initial screenshot for 0-step error tasks
    step_range = max(n_steps, max(raw_shots.keys()) + 1) if raw_shots else n_steps
    raw_frames = []
    for idx in range(step_range):
        if idx in raw_shots:
            raw_frames.append(raw_shots[idx])
    if raw_frames:
        variants["frames_raw"] = raw_frames

    # SoM overlay
    if mode == "som" and som_shots:
        som_frames = []
        for idx in range(n_steps):
            if idx in som_shots:
                som_frames.append(som_shots[idx])
            elif idx in raw_shots:
                som_frames.append(raw_shots[idx])
        if som_frames:
            variants["frames_som"] = som_frames

    # Grid overlay
    if mode == "pixel_grid" and grid_shots:
        grid_frames = []
        for idx in range(n_steps):
            if idx in grid_shots:
                grid_frames.append(grid_shots[idx])
            elif idx in raw_shots:
                grid_frames.append(raw_shots[idx])
        if grid_frames:
            variants["frames_grid"] = grid_frames

    return variants


# ---------------------------------------------------------------------------
# Action annotation for pixel/pixel_grid
# ---------------------------------------------------------------------------
def annotate_frame(img_path: Path, action: str, mode: str) -> Path | None:
    if mode not in ("pixel", "pixel_grid", "ui_tars_native"):
        return None
    if not action:
        return None

    try:
        from PIL import Image, ImageDraw
    except ImportError:
        return None

    click_m = re.match(r"mouse_click\((\d+),\s*(\d+)(?:,\s*button=['\"](\w+)['\"])?\)", action)
    dblclick_m = re.match(r"mouse_dblclick\((\d+),\s*(\d+)\)", action)
    drag_m = re.match(r"mouse_drag_and_drop\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)", action)
    scroll_m = re.match(r"scroll\((\d+),\s*(\d+),\s*(-?\d+),\s*(-?\d+)\)", action)

    if not (click_m or dblclick_m or drag_m or scroll_m):
        return None

    img = Image.open(img_path).convert("RGBA")
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    if click_m or dblclick_m:
        m = click_m or dblclick_m
        x, y = int(m.group(1)), int(m.group(2))
        r = 12
        right_click = bool(click_m and m.group(3) == "right")
        if dblclick_m:
            color = (50, 50, 255, 180)
        elif right_click:
            color = (255, 165, 0, 180)
        else:
            color = (255, 50, 50, 180)
        draw.ellipse([x - r, y - r, x + r, y + r], outline=color, width=3)
        draw.line([(x - r - 4, y), (x + r + 4, y)], fill=color, width=2)
        draw.line([(x, y - r - 4), (x, y + r + 4)], fill=color, width=2)
    elif drag_m:
        x1, y1 = int(drag_m.group(1)), int(drag_m.group(2))
        x2, y2 = int(drag_m.group(3)), int(drag_m.group(4))
        color = (50, 200, 50, 180)
        draw.line([(x1, y1), (x2, y2)], fill=color, width=3)
        r = 6
        draw.ellipse([x1 - r, y1 - r, x1 + r, y1 + r], fill=(50, 200, 50, 200))
        draw.ellipse([x2 - r, y2 - r, x2 + r, y2 + r], fill=(255, 100, 50, 200))
    elif scroll_m:
        x, y, dx, dy = map(int, scroll_m.groups())
        color = (160, 80, 255, 180)
        r = 10
        draw.ellipse([x - r, y - r, x + r, y + r], outline=color, width=3)
        end_x = x + dx
        end_y = y + dy
        draw.line([(x, y), (end_x, end_y)], fill=color, width=3)
        ah = 8
        # Simple arrow head
        if dx or dy:
            draw.line([(end_x, end_y), (end_x - ah, end_y - ah)], fill=color, width=2)
            draw.line([(end_x, end_y), (end_x + ah, end_y - ah)], fill=color, width=2)

    result = Image.alpha_composite(img, overlay).convert("RGB")
    tmp = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
    result.save(tmp.name)
    return Path(tmp.name)


def build_annotated_frames(raw_frames: list[Path], step_list: list[StepInfo], mode: str) -> list[Path] | None:
    """Build annotated frame list. Returns list of paths (some temp files) or None."""
    if mode not in ("pixel", "pixel_grid", "ui_tars_native"):
        return None

    annotated = []
    temp_files = []
    any_annotated = False

    for i, frame_path in enumerate(raw_frames):
        action = ""
        if i < len(step_list):
            action = step_list[i].transformed_action or step_list[i].action
        ann = annotate_frame(frame_path, action, mode)
        if ann:
            annotated.append(ann)
            temp_files.append(ann)
            any_annotated = True
        else:
            annotated.append(frame_path)

    if not any_annotated:
        for tf in temp_files:
            try: tf.unlink()
            except OSError: pass
        return None

    return annotated


# ---------------------------------------------------------------------------
# Video encoding
# ---------------------------------------------------------------------------
def encode_video(frame_paths: list[Path], output_path: Path) -> bool:
    if not frame_paths:
        return False

    with tempfile.TemporaryDirectory() as tmpdir:
        for i, fp in enumerate(frame_paths):
            os.symlink(fp.resolve(), os.path.join(tmpdir, f"frame_{i:06d}.png"))

        cmd = [
            "ffmpeg", "-y",
            "-framerate", "1",
            "-i", os.path.join(tmpdir, "frame_%06d.png"),
            "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
            "-c:v", "libx264",
            "-preset", "fast",
            "-crf", "23",
            "-g", "1",
            "-pix_fmt", "yuv420p",
            "-movflags", "+faststart",
            output_path.as_posix(),
        ]

        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
            return result.returncode == 0
        except Exception:
            return False


# ---------------------------------------------------------------------------
# Pack single episode
# ---------------------------------------------------------------------------
def pack_episode(
    mode: str,
    trace_dir: Path,
    results_row: dict | None,
    output_base: Path,
    run_id: str,
    packed_run_id: str,
    model_name: str,
    agent_name: str,
    commit_sha: str,
) -> dict | None:
    task_id = None
    if results_row:
        task_id = results_row.get("task_id")

    if not task_id:
        name = trace_dir.name
        m = re.match(r"\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}_\w+_(.*)", name)
        if m:
            rest = m.group(1)
            tid_m = re.search(r"(\w+-(?:antd|mui|mantine|external)-T\d+)", rest)
            if tid_m:
                task_id = tid_m.group(1)

    if not task_id:
        print(f"  [SKIP] Cannot determine task_id for {trace_dir.name}")
        return None

    log_path = trace_dir / "experiment.log"
    step_list = parse_experiment_log(log_path)

    summary_path = trace_dir / "summary_info.json"
    summary = {}
    if summary_path.exists():
        try:
            summary = json.loads(summary_path.read_text())
        except json.JSONDecodeError:
            pass

    n_steps = summary.get("n_steps", len(step_list))
    cum_reward = summary.get("cum_reward", 0)
    success = cum_reward >= 1.0
    terminated = summary.get("terminated", False)
    truncated = summary.get("truncated", False)

    if results_row:
        success = results_row.get("success", success)
        row_steps = results_row.get("steps", 0)
        if row_steps > 0:
            n_steps = row_steps

    canonical_type = ""
    library = ""
    if results_row:
        canonical_type = results_row.get("canonical_type", "")
        library = results_row.get("library", "")
    if not canonical_type and task_id:
        parts = task_id.rsplit("-", 2)
        if len(parts) >= 2:
            library = parts[-2] if parts[-2] in ("antd", "mui", "mantine", "external") else ""
            canonical_type = task_id.replace(f"-{library}-{parts[-1]}", "") if library else ""

    # Get frame paths for all variants
    frame_variants = get_frame_paths(trace_dir, mode, n_steps)
    if "frames_raw" not in frame_variants or not frame_variants["frames_raw"]:
        print(f"  [SKIP] No screenshots in {trace_dir.name}")
        return None

    out_dir = output_base / "runs" / run_id / mode / task_id
    out_dir.mkdir(parents=True, exist_ok=True)

    videos_produced: dict[str, str] = {}
    temp_files: list[Path] = []

    # Encode raw video
    raw_ok = encode_video(frame_variants["frames_raw"], out_dir / "frames_raw.mp4")
    if raw_ok:
        videos_produced["frames_raw"] = "frames_raw.mp4"
    else:
        print(f"  [WARN] Raw video failed for {task_id}")
        return None

    # Encode annotated video for pixel modes
    if mode in ("pixel", "pixel_grid", "ui_tars_native"):
        annot_frames = build_annotated_frames(frame_variants["frames_raw"], step_list, mode)
        if annot_frames:
            ann_ok = encode_video(annot_frames, out_dir / "frames_annot.mp4")
            if ann_ok:
                videos_produced["frames_annot"] = "frames_annot.mp4"
            for tf in annot_frames:
                if tf not in frame_variants["frames_raw"]:
                    temp_files.append(tf)

    # Encode SoM overlay video
    if "frames_som" in frame_variants:
        som_ok = encode_video(frame_variants["frames_som"], out_dir / "frames_som.mp4")
        if som_ok:
            videos_produced["frames_som"] = "frames_som.mp4"

    # Encode grid overlay video
    if "frames_grid" in frame_variants:
        grid_ok = encode_video(frame_variants["frames_grid"], out_dir / "frames_grid.mp4")
        if grid_ok:
            videos_produced["frames_grid"] = "frames_grid.mp4"

    # Cleanup temp annotated files
    for tf in temp_files:
        try:
            tf.unlink()
        except OSError:
            pass

    ep = EpisodeData(
        run_id=run_id,
        packed_run_id=packed_run_id,
        mode=mode,
        task_id=task_id,
        canonical_type=canonical_type,
        library=library,
        success=success,
        reward=cum_reward,
        steps=n_steps,
        duration_seconds=results_row.get("duration_seconds", summary.get("stats.cum_step_elapsed", 0)) if results_row else summary.get("stats.cum_step_elapsed", 0),
        termination_reason=results_row.get("termination_reason", "truncated" if truncated else ("success" if success else "max_steps")) if results_row else ("truncated" if truncated else ("success" if success else "max_steps")),
        difficulty_bucket=results_row.get("difficulty_bucket", "") if results_row else "",
        difficulty_tier=results_row.get("difficulty_tier", "") if results_row else "",
        task_name=results_row.get("task_name", "") if results_row else "",
        family_id=results_row.get("family_id", "") if results_row else "",
        model_name=model_name,
        agent_name=agent_name,
        commit_sha=commit_sha,
        hostname=results_row.get("hostname", "") if results_row else "",
        start_ts=results_row.get("start_ts", "") if results_row else "",
        end_ts=results_row.get("end_ts", "") if results_row else "",
        step_list=[asdict(s) for s in step_list],
        videos=videos_produced,
    )

    episode_path = out_dir / "episode.json"
    episode_path.write_text(json.dumps(asdict(ep), indent=2, default=str))

    return asdict(ep)


# ---------------------------------------------------------------------------
# Manifest
# ---------------------------------------------------------------------------
def build_manifest(
    packed_run_id: str,
    run_id: str,
    model_name: str,
    agent_name: str,
    commit_sha: str,
    modes: list[str],
    episode_summaries: list[dict],
    output_base: Path,
):
    total = len(episode_summaries)
    total_success = sum(1 for e in episode_summaries if e.get("success"))

    by_mode: dict[str, dict] = {}
    for e in episode_summaries:
        m = e["mode"]
        if m not in by_mode:
            by_mode[m] = {"total": 0, "success": 0, "steps_sum": 0, "dur_sum": 0}
        by_mode[m]["total"] += 1
        by_mode[m]["success"] += 1 if e.get("success") else 0
        by_mode[m]["steps_sum"] += e.get("steps", 0)
        by_mode[m]["dur_sum"] += e.get("duration_seconds", 0)

    manifest = {
        "packed_run_id": packed_run_id,
        "run_id": run_id,
        "model_name": model_name,
        "agent_name": agent_name,
        "commit_sha": commit_sha,
        "benchmark": "componentbench",
        "modes": modes,
        "total_episodes": total,
        "total_success": total_success,
        "pass_rate": round(total_success / total, 4) if total > 0 else 0,
        "by_mode": {
            m: {
                "total": d["total"],
                "success": d["success"],
                "pass_rate": round(d["success"] / d["total"], 4) if d["total"] > 0 else 0,
                "avg_steps": round(d["steps_sum"] / d["total"], 2) if d["total"] > 0 else 0,
                "avg_duration": round(d["dur_sum"] / d["total"], 2) if d["total"] > 0 else 0,
            }
            for m, d in by_mode.items()
        },
        "created_at": datetime.utcnow().isoformat() + "Z",
    }

    (output_base / "manifest.json").write_text(json.dumps(manifest, indent=2))
    return manifest


# ---------------------------------------------------------------------------
# Wrapper for parallel execution (must be top-level for pickling)
# ---------------------------------------------------------------------------
def _pack_one(args_tuple):
    mode, trace_dir_str, results_row, output_base_str, run_id, packed_run_id, model_name, agent_name, commit_sha = args_tuple
    try:
        return pack_episode(
            mode=mode,
            trace_dir=Path(trace_dir_str),
            results_row=results_row,
            output_base=Path(output_base_str),
            run_id=run_id,
            packed_run_id=packed_run_id,
            model_name=model_name,
            agent_name=agent_name,
            commit_sha=commit_sha,
        )
    except Exception as e:
        print(f"  [ERROR] {mode}/{Path(trace_dir_str).name}: {e}", flush=True)
        return None


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(description="Pack BrowserGym run into episode.json + multi-video MP4s")
    parser.add_argument("--input", required=True, help="Input run directory (contains ax_tree/, som/, etc.)")
    parser.add_argument("--output", required=True, help="Output directory for packed run")
    parser.add_argument("--run-id", required=True, help="Logical run ID (e.g. qwen3-vl-235b-v03)")
    parser.add_argument("--packed-run-id", default="", help="Packed run ID (auto-generated if empty)")
    parser.add_argument("--model-name", default="Qwen/Qwen3-VL-235B-A22B-Thinking-FP8")
    parser.add_argument("--agent-name", default="openrouter_agent")
    parser.add_argument("--commit-sha", default="")
    parser.add_argument("--modes", default="", help="Comma-separated modes to pack (empty = all)")
    parser.add_argument("--limit", type=int, default=0, help="Max episodes per mode (0 = all)")
    parser.add_argument("--workers", type=int, default=1, help="Parallel worker processes (default=1)")
    parser.add_argument("--dataset-version", default="v0.3.1")
    args = parser.parse_args()

    input_dir = Path(args.input)
    output_base = Path(args.output)
    output_base.mkdir(parents=True, exist_ok=True)

    packed_run_id = args.packed_run_id or f"pack_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    modes = [m.strip() for m in args.modes.split(",") if m.strip()] or None
    workers = max(1, args.workers)

    print(f"Input:   {input_dir}")
    print(f"Output:  {output_base}")
    print(f"Run ID:  {args.run_id}")
    print(f"Packed:  {packed_run_id}")
    print(f"Modes:   {modes or 'all'}")
    print(f"Limit:   {args.limit or 'none'}")
    print(f"Workers: {workers}")
    print()

    episodes = discover_episodes(input_dir, modes)
    print(f"Discovered {len(episodes)} episodes")

    if args.limit:
        limited = []
        mode_counts: dict[str, int] = {}
        for mode, trace, row in episodes:
            c = mode_counts.get(mode, 0)
            if c < args.limit:
                limited.append((mode, trace, row))
                mode_counts[mode] = c + 1
        episodes = limited
        print(f"  Limited to {len(episodes)} episodes")

    total = len(episodes)
    episode_summaries = []
    packed_modes = set()

    # Build work items (serialize Path to str for pickling)
    work_items = [
        (mode, str(trace_dir), row, str(output_base), args.run_id,
         packed_run_id, args.model_name, args.agent_name, args.commit_sha)
        for mode, trace_dir, row in episodes
    ]

    if workers == 1:
        for i, item in enumerate(work_items):
            mode = item[0]
            tname = Path(item[1]).name
            print(f"  [{i+1}/{total}] {mode}/{tname} ... ", end="", flush=True)
            result = _pack_one(item)
            if result:
                vids = list(result.get("videos", {}).keys())
                episode_summaries.append(result)
                packed_modes.add(result["mode"])
                print(f"OK ({result['steps']} steps, {'PASS' if result['success'] else 'FAIL'}, videos={vids})")
            else:
                print("SKIPPED")
    else:
        done = 0
        ok = 0
        with ProcessPoolExecutor(max_workers=workers) as pool:
            futures = {pool.submit(_pack_one, item): item for item in work_items}
            for future in as_completed(futures):
                done += 1
                result = future.result()
                if result:
                    episode_summaries.append(result)
                    packed_modes.add(result["mode"])
                    ok += 1
                if done % 50 == 0 or done == total:
                    print(f"  Progress: {done}/{total} done, {ok} OK", flush=True)

    manifest = build_manifest(
        packed_run_id=packed_run_id,
        run_id=args.run_id,
        model_name=args.model_name,
        agent_name=args.agent_name,
        commit_sha=args.commit_sha,
        modes=sorted(packed_modes),
        episode_summaries=episode_summaries,
        output_base=output_base,
    )

    print()
    print(f"Packed {len(episode_summaries)}/{total} episodes")
    print(f"Modes: {sorted(packed_modes)}")
    print(f"Pass rate: {manifest['pass_rate']:.1%}")
    print(f"Manifest: {output_base / 'manifest.json'}")


if __name__ == "__main__":
    main()
