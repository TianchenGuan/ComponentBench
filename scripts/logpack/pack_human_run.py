#!/usr/bin/env python3
"""
pack_human_run.py — Replay recorded human traces with Playwright to produce
packed episodes (episode.json + frames.mp4) compatible with the log viewer.

For each task with meta.json status SUCCESS:
  1. Navigate to /task/<taskId>?mode=benchmark
  2. Replay steps from trace.jsonl using Playwright mouse/keyboard
  3. Capture a screenshot after each step
  4. Encode screenshots into frames_raw.mp4 (1fps, GOP=1, faststart)
  5. Write episode.json in the same schema as pack_run.py

Usage:
  python3 scripts/logpack/pack_human_run.py \
      --trace-root /usr/xtmp/tg295/componentbench-human-traces/human_pass1_20260311 \
      --out /usr/xtmp/tg295/componentbench-packed/human_pass1 \
      --base-url http://127.0.0.1:3002 \
      [--workers 4]
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import tempfile
import time
from concurrent.futures import ProcessPoolExecutor, as_completed
from dataclasses import asdict, dataclass, field
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
            "-c:v", "libx264", "-preset", "fast", "-crf", "23",
            "-g", "1", "-pix_fmt", "yuv420p",
            "-movflags", "+faststart",
            output_path.as_posix(),
        ]
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
            return result.returncode == 0
        except Exception:
            return False


def step_to_action_str(step: dict) -> str:
    """Convert a recorded step to a human-readable action description."""
    t = step.get("type", "")
    if t == "click":
        p = step.get("pointer", {})
        target = step.get("target", {})
        tag = target.get("tag", "")
        name = target.get("name", "")[:40]
        return f"click({p.get('x')}, {p.get('y')}) on <{tag}> {name}"
    elif t == "type":
        return f"type({step.get('text', '')!r})"
    elif t == "key":
        return f"key({step.get('key', '')})"
    elif t == "drag":
        d = step.get("drag", {})
        return f"drag({d.get('x1')},{d.get('y1')} -> {d.get('x2')},{d.get('y2')})"
    elif t == "scroll":
        s = step.get("scroll", {})
        return f"scroll(dx={s.get('dx')}, dy={s.get('dy')})"
    elif t == "wait":
        return "wait"
    return t


def replay_and_pack_one(
    task_dir: Path,
    out_dir: Path,
    base_url: str,
    run_id: str,
    packed_run_id: str,
    mode: str,
) -> Optional[dict]:
    """Replay one task trace with Playwright and produce packed episode."""
    meta_path = task_dir / "meta.json"
    trace_path = task_dir / "trace.jsonl"
    if not meta_path.exists() or not trace_path.exists():
        return None

    meta = json.loads(meta_path.read_text())
    if meta.get("status") != "SUCCESS":
        return None

    task_id = meta["task_id"]

    steps: list[dict] = []
    for line in trace_path.read_text().strip().split("\n"):
        if line.strip():
            steps.append(json.loads(line))

    if not steps:
        return None

    # Resolve task metadata from the task index (best-effort)
    canonical_type = task_id.rsplit("-", 1)[0] if "-" in task_id else task_id
    parts = task_id.split("-")
    library = parts[-2] if len(parts) >= 3 else ""

    ep_dir = out_dir / "runs" / run_id / mode / task_id
    ep_dir.mkdir(parents=True, exist_ok=True)

    frame_paths: list[Path] = []
    step_list: list[dict] = []

    try:
        from playwright.sync_api import sync_playwright

        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(viewport={"width": 1280, "height": 720})
            page = context.new_page()

            task_url = f"{base_url}/task/{task_id}?mode=benchmark"
            page.goto(task_url, wait_until="domcontentloaded", timeout=30000)
            page.wait_for_timeout(1000)

            # Screenshot before any action (step 0 baseline)
            frame0 = ep_dir / "frame_000000.png"
            page.screenshot(path=str(frame0))
            frame_paths.append(frame0)

            for step in steps:
                action_str = step_to_action_str(step)
                t = step.get("type", "")

                try:
                    if t == "click":
                        ptr = step.get("pointer", {})
                        page.mouse.click(ptr.get("x", 0), ptr.get("y", 0))
                    elif t == "type":
                        page.keyboard.type(step.get("text", ""), delay=20)
                    elif t == "key":
                        page.keyboard.press(step.get("key", ""))
                    elif t == "drag":
                        d = step.get("drag", {})
                        page.mouse.move(d.get("x1", 0), d.get("y1", 0))
                        page.mouse.down()
                        page.mouse.move(d.get("x2", 0), d.get("y2", 0), steps=d.get("steps", 10))
                        page.mouse.up()
                    elif t == "scroll":
                        s = step.get("scroll", {})
                        page.mouse.wheel(s.get("dx", 0), s.get("dy", 0))
                    elif t == "wait":
                        page.wait_for_timeout(500)
                except Exception as e:
                    action_str += f" [REPLAY_ERROR: {e}]"

                page.wait_for_timeout(200)

                frame_path = ep_dir / f"frame_{len(frame_paths):06d}.png"
                page.screenshot(path=str(frame_path))
                frame_paths.append(frame_path)

                step_list.append(asdict(StepInfo(
                    step_idx=step.get("i", len(step_list)),
                    timestamp=str(step.get("t_ms", 0)),
                    thinking="[human]",
                    action=action_str,
                )))

            browser.close()

    except Exception as e:
        print(f"  ERROR replaying {task_id}: {e}", flush=True)
        return None

    # Encode video
    videos: dict[str, str] = {}
    if frame_paths:
        mp4_path = ep_dir / "frames_raw.mp4"
        if encode_video(frame_paths, mp4_path):
            videos["frames_raw"] = "frames_raw.mp4"

    # Clean up PNGs
    for fp in frame_paths:
        try:
            fp.unlink()
        except OSError:
            pass

    duration = meta.get("ended_at", "")
    ep = EpisodeData(
        run_id=run_id,
        packed_run_id=packed_run_id,
        mode=mode,
        task_id=task_id,
        canonical_type=canonical_type,
        library=library,
        success=True,
        reward=1.0,
        steps=len(step_list),
        duration_seconds=0,
        termination_reason="success",
        model_name="human",
        agent_name="human",
        hostname=os.uname().nodename,
        start_ts=meta.get("started_at", ""),
        end_ts=meta.get("ended_at", ""),
        step_list=step_list,
        videos=videos,
    )

    (ep_dir / "episode.json").write_text(json.dumps(asdict(ep), indent=2, default=str))
    return asdict(ep)


def _pack_one_wrapper(args_tuple):
    return replay_and_pack_one(*args_tuple)


def build_manifest(run_id, packed_run_id, mode, episodes, output_base):
    total = len(episodes)
    success = sum(1 for e in episodes if e.get("success"))
    steps_sum = sum(e.get("steps", 0) for e in episodes)
    dur_sum = sum(e.get("duration_seconds", 0) for e in episodes)

    manifest = {
        "packed_run_id": packed_run_id,
        "run_id": run_id,
        "model_name": "human",
        "agent_name": "human",
        "commit_sha": "",
        "benchmark": "componentbench",
        "modes": [mode],
        "total_episodes": total,
        "total_success": success,
        "pass_rate": round(success / total, 4) if total > 0 else 0,
        "by_mode": {
            mode: {
                "total": total,
                "success": success,
                "pass_rate": round(success / total, 4) if total > 0 else 0,
                "avg_steps": round(steps_sum / total, 2) if total > 0 else 0,
                "avg_duration": round(dur_sum / total, 2) if total > 0 else 0,
            }
        },
        "created_at": datetime.utcnow().isoformat() + "Z",
    }

    (output_base / "manifest.json").write_text(json.dumps(manifest, indent=2))
    return manifest


def main():
    parser = argparse.ArgumentParser(description="Pack human recording traces via Playwright replay")
    parser.add_argument("--trace-root", required=True, help="Root of raw traces (contains episodes/)")
    parser.add_argument("--out", required=True, help="Output packed directory")
    parser.add_argument("--base-url", default="http://127.0.0.1:3002")
    parser.add_argument("--run-id", default="", help="Override run_id (default: from run.json)")
    parser.add_argument("--mode", default="human", help="Mode label (default: human)")
    parser.add_argument("--workers", type=int, default=1, help="Parallel workers")
    args = parser.parse_args()

    trace_root = Path(args.trace_root)
    output_base = Path(args.out)
    output_base.mkdir(parents=True, exist_ok=True)

    run_json = trace_root / "run.json"
    if run_json.exists():
        run_config = json.loads(run_json.read_text())
        run_id = args.run_id or run_config.get("run_id", trace_root.name)
    else:
        run_id = args.run_id or trace_root.name

    packed_run_id = run_id

    episodes_dir = trace_root / "episodes"
    if not episodes_dir.exists():
        print(f"ERROR: {episodes_dir} not found")
        sys.exit(1)

    task_dirs = sorted([d for d in episodes_dir.iterdir() if d.is_dir()])
    print(f"Found {len(task_dirs)} episode directories")

    pack_args = [
        (td, output_base, args.base_url, run_id, packed_run_id, args.mode)
        for td in task_dirs
    ]

    episode_summaries: list[dict] = []

    if args.workers <= 1:
        for i, pa in enumerate(pack_args):
            result = _pack_one_wrapper(pa)
            if result:
                episode_summaries.append(result)
            print(f"  [{i+1}/{len(pack_args)}] {pa[0].name}: {'OK' if result else 'SKIP'}", flush=True)
    else:
        with ProcessPoolExecutor(max_workers=args.workers) as pool:
            futures = {pool.submit(_pack_one_wrapper, pa): pa for pa in pack_args}
            done = 0
            for future in as_completed(futures):
                done += 1
                result = future.result()
                if result:
                    episode_summaries.append(result)
                if done % 50 == 0 or done == len(pack_args):
                    print(f"  Progress: {done}/{len(pack_args)}, {len(episode_summaries)} OK", flush=True)

    manifest = build_manifest(run_id, packed_run_id, args.mode, episode_summaries, output_base)
    print(f"\nPacked {len(episode_summaries)}/{len(task_dirs)} episodes")
    print(f"Pass rate: {manifest['pass_rate']:.1%}")
    print(f"Output: {output_base}")


if __name__ == "__main__":
    main()
