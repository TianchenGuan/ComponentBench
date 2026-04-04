#!/usr/bin/env python3
"""
Browser-Use + Gemini baseline runner for ComponentBench.

Runs ComponentBench tasks using the browser-use library with Google Gemini
(vision-based, pixel-mode only). Produces packed episode.json + MP4 videos
compatible with the existing log viewer pipeline.

Usage:
    # Smoke test (3 tasks)
    python scripts/browser_use/run_and_pack.py \
        --run-id smoke_test_01 \
        --output-root /tmp/bu_smoke \
        --limit 3

    # Full run with sharding
    python scripts/browser_use/run_and_pack.py \
        --run-id gemini_flash_lite_full \
        --output-root /usr/xtmp/$USER/bu_results \
        --shard-id 0 --num-shards 2

Environment:
    GOOGLE_API_KEY   — Google AI API key (required, never printed)
"""
from __future__ import annotations

import argparse
import asyncio
import base64
import json
import logging
import os
import re
import shutil
import signal
import socket
import subprocess
import sys
import tempfile
import time
from dataclasses import asdict, dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Optional

# ---------------------------------------------------------------------------
# Ensure project root is importable so `benchmark.core` can be resolved
# ---------------------------------------------------------------------------
_SCRIPT_DIR = Path(__file__).resolve().parent
_PROJECT_DIR = _SCRIPT_DIR.parent.parent
sys.path.insert(0, str(_PROJECT_DIR))

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("browser_use_runner")


# ---------------------------------------------------------------------------
# Data classes (mirrors pack_run.py for episode.json compatibility)
# ---------------------------------------------------------------------------

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
# Video encoding (standalone; avoids import dependency on pack_run.py)
# ---------------------------------------------------------------------------

def encode_video(frame_paths: list[Path], output_path: Path) -> bool:
    """Encode a list of PNG frames into an MP4 at 1 fps, GOP=1, faststart."""
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


def annotate_frame(img_path: Path, action_str: str) -> Optional[Path]:
    """Draw click crosshair or drag arrow on a screenshot. Returns temp path or None."""
    click_m = re.match(r"(?:click|mouse_click)\w*\(\s*(\d+),\s*(\d+)\s*\)", action_str)
    drag_m = re.match(
        r"(?:drag|mouse_drag_and_drop)\w*\(\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)\s*\)",
        action_str,
    )
    if not click_m and not drag_m:
        return None
    try:
        from PIL import Image, ImageDraw
    except ImportError:
        return None

    img = Image.open(img_path).convert("RGBA")
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    if click_m:
        x, y = int(click_m.group(1)), int(click_m.group(2))
        r = 12
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

    result = Image.alpha_composite(img, overlay).convert("RGB")
    tmp = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
    result.save(tmp.name)
    return Path(tmp.name)


# ---------------------------------------------------------------------------
# Git helper
# ---------------------------------------------------------------------------

def _git_commit() -> str:
    try:
        r = subprocess.run(
            ["git", "rev-parse", "--short", "HEAD"],
            capture_output=True, text=True, timeout=5, cwd=_PROJECT_DIR,
        )
        return r.stdout.strip() if r.returncode == 0 else "unknown"
    except Exception:
        return "unknown"


# ---------------------------------------------------------------------------
# History -> packed episode
# ---------------------------------------------------------------------------

def _action_str_from_model_action(action) -> str:
    """Convert a browser-use model action object to a human-readable string."""
    if action is None:
        return ""
    if isinstance(action, str):
        return action
    if isinstance(action, list):
        parts = []
        for a in action:
            parts.append(_action_str_from_model_action(a))
        return "; ".join(p for p in parts if p)
    if isinstance(action, dict):
        # browser-use often returns dicts like {"click": {"index": 7}}
        parts = []
        for k, v in action.items():
            if isinstance(v, dict):
                param_str = ", ".join(f"{pk}={pv!r}" for pk, pv in v.items())
                parts.append(f"{k}({param_str})")
            elif v is not None:
                parts.append(f"{k}({v!r})")
            else:
                parts.append(str(k))
        return "; ".join(parts) if parts else str(action)
    name = getattr(action, "name", "") or getattr(action, "__class__", type(action)).__name__
    params = {}
    for attr in ("x", "y", "text", "index", "url", "xpath", "selector", "keys",
                  "success", "new_tab"):
        val = getattr(action, attr, None)
        if val is not None:
            params[attr] = val
    if params:
        param_str = ", ".join(f"{k}={v!r}" for k, v in params.items())
        return f"{name}({param_str})"
    # Last resort: try to serialize cleanly
    try:
        import json as _json
        return _json.dumps(action, default=str)
    except Exception:
        return str(action)


def _extract_thinking(thought) -> str:
    """Extract thinking text from an AgentBrain object.

    Concatenates all available reasoning fields to preserve the full
    chain-of-thought (evaluation, memory, next_goal).
    """
    if thought is None:
        return ""
    if isinstance(thought, str):
        return thought
    parts = []
    for attr in ("evaluation_previous_goal", "memory", "next_goal", "thought"):
        val = getattr(thought, attr, None)
        if val:
            parts.append(str(val))
    if parts:
        return "\n".join(parts)
    # Fallback: serialize the whole object
    try:
        import json as _json
        d = {k: v for k, v in vars(thought).items() if v}
        return _json.dumps(d, default=str) if d else str(thought)
    except Exception:
        return str(thought)


async def pack_episode(
    history,
    task,
    *,
    run_id: str,
    mode: str,
    model_name: str,
    output_dir: Path,
    success: bool,
    start_ts: str,
    end_ts: str,
    duration_seconds: float,
) -> EpisodeData:
    """Convert browser-use AgentHistoryList into our packed episode format."""
    n_steps = history.number_of_steps()
    thoughts = history.model_thoughts()
    actions = history.model_actions()
    outputs = history.model_outputs()
    errors = history.errors()
    screenshots_b64 = history.screenshots()

    step_list: list[dict] = []
    for i in range(n_steps):
        thinking = _extract_thinking(thoughts[i]) if i < len(thoughts) else ""
        action = _action_str_from_model_action(actions[i]) if i < len(actions) else ""
        raw_output = str(outputs[i]) if i < len(outputs) else ""
        error = str(errors[i]) if i < len(errors) and errors[i] else ""

        step_list.append(asdict(StepInfo(
            step_idx=i,
            timestamp=datetime.now().isoformat(),
            thinking=thinking,
            action=action,
            raw_model_output=raw_output,
            error=error,
        )))

    # Write screenshots as temp PNGs for video encoding
    ep_dir = output_dir / "episodes" / task.task_id
    ep_dir.mkdir(parents=True, exist_ok=True)

    raw_frame_paths: list[Path] = []
    for i, b64_img in enumerate(screenshots_b64):
        if not b64_img:
            continue
        try:
            img_data = base64.b64decode(b64_img)
            frame_path = ep_dir / f"frame_{i:04d}.png"
            frame_path.write_bytes(img_data)
            raw_frame_paths.append(frame_path)
        except Exception as e:
            logger.warning(f"Failed to decode screenshot {i} for {task.task_id}: {e}")

    videos: dict[str, str] = {}

    # Encode raw video
    if raw_frame_paths:
        raw_mp4 = ep_dir / "frames_raw.mp4"
        if encode_video(raw_frame_paths, raw_mp4):
            videos["frames_raw"] = "frames_raw.mp4"

    # Encode annotated video (click/drag overlays)
    if raw_frame_paths:
        annot_paths: list[Path] = []
        temp_annots: list[Path] = []
        any_annotated = False
        for i, fp in enumerate(raw_frame_paths):
            action_text = step_list[i]["action"] if i < len(step_list) else ""
            ann = annotate_frame(fp, action_text)
            if ann:
                annot_paths.append(ann)
                temp_annots.append(ann)
                any_annotated = True
            else:
                annot_paths.append(fp)
        if any_annotated:
            annot_mp4 = ep_dir / "frames_annot.mp4"
            if encode_video(annot_paths, annot_mp4):
                videos["frames_annot"] = "frames_annot.mp4"
        for tf in temp_annots:
            try:
                tf.unlink()
            except OSError:
                pass

    # Clean up raw PNGs (keep MP4s)
    for fp in raw_frame_paths:
        try:
            fp.unlink()
        except OSError:
            pass

    reward = 1.0 if success else 0.0
    termination = "success" if success else "max_steps"

    ep = EpisodeData(
        run_id=run_id,
        packed_run_id=run_id,
        mode=mode,
        task_id=task.task_id,
        canonical_type=task.canonical_type,
        library=task.implementation_source,
        success=success,
        reward=reward,
        steps=n_steps,
        duration_seconds=duration_seconds,
        termination_reason=termination,
        difficulty_bucket=task.difficulty_level,
        difficulty_tier=task.difficulty_tier,
        task_name=task.name,
        family_id=task.family_id or "",
        model_name=model_name,
        agent_name="browser_use",
        commit_sha=_git_commit(),
        hostname=socket.gethostname(),
        start_ts=start_ts,
        end_ts=end_ts,
        step_list=step_list,
        videos=videos,
    )

    episode_path = ep_dir / "episode.json"
    episode_path.write_text(json.dumps(asdict(ep), indent=2, default=str))
    return ep


# ---------------------------------------------------------------------------
# Single-task runner
# ---------------------------------------------------------------------------

async def run_one_task(
    task,
    *,
    server_url: str,
    model_name: str,
    max_steps: int,
    run_id: str,
    mode: str,
    output_dir: Path,
    task_timeout: int,
    benchmark_version: str = "v1",
):
    """Run a single ComponentBench task with browser-use and pack the result."""
    from browser_use import Agent, Browser

    api_base = os.environ.get("VLLM_BASE_URL", "")
    api_key = os.environ.get("VLLM_API_KEY", "")

    if api_base and api_key:
        from browser_use.llm.openai.chat import ChatOpenAI as BUChatOpenAI
        llm = BUChatOpenAI(model=model_name, base_url=api_base, api_key=api_key)
    else:
        from browser_use import ChatGoogle
        llm = ChatGoogle(model=model_name)

    task_url = f"{server_url}/task/{task.task_id}?mode=benchmark"
    if benchmark_version == "v2":
        task_url += "&bench=v2"
    goal_text = (
        f"Go to {task_url} and complete the following task:\n\n"
        f"{task.browsergym_goal}\n\n"
        "COMPLETION RULE:\n"
        "When the task is complete, a green success banner will appear at the "
        "top of the page. The system will automatically detect this and end "
        "the task.\n\n"
        "RULES:\n"
        "- Do not navigate to other websites\n"
        "- Stay on this page\n"
        "- Look at the screenshot carefully before acting\n"
        "- If you see a success banner at the top, stop immediately"
    )

    tmp_root = Path(os.environ.get("TMPDIR", tempfile.gettempdir()))
    tmp_root.mkdir(parents=True, exist_ok=True)
    browser_tmp_root = Path(tempfile.mkdtemp(prefix=f"browser-use-{task.task_id}-", dir=tmp_root))
    downloads_path = browser_tmp_root / "downloads"
    user_data_dir = browser_tmp_root / "user-data"
    traces_dir = browser_tmp_root / "traces"
    downloads_path.mkdir(parents=True, exist_ok=True)
    user_data_dir.mkdir(parents=True, exist_ok=True)
    traces_dir.mkdir(parents=True, exist_ok=True)

    browser = Browser(
        headless=True,
        viewport={"width": 1280, "height": 720},
        highlight_elements=False,
        allowed_domains=["localhost", "127.0.0.1"],
        downloads_path=downloads_path,
        user_data_dir=user_data_dir,
        traces_dir=traces_dir,
    )

    task_succeeded = False

    async def _on_step_end(agent_instance):
        nonlocal task_succeeded
        try:
            page = await agent_instance.browser_session.get_current_page()
            # browser-use Page.evaluate() returns strings, not native booleans:
            # JS false -> "False", JS true -> "True". Must compare explicitly.
            done_str = await page.evaluate(
                "() => !!document.getElementById('cb-success-banner') "
                "|| document.documentElement.dataset.taskDone === 'true' "
                "|| window.__COMPONENT_BENCH_TASK_DONE__ === true"
            )
            if str(done_str).lower() == "true":
                task_succeeded = True
                agent_instance.stop()
        except Exception:
            pass

    agent = Agent(
        task=goal_text,
        llm=llm,
        browser=browser,
        use_vision=True,
        use_thinking=True,
        flash_mode=False,
        max_actions_per_step=4,
        max_failures=3,
        step_timeout=120,
        generate_gif=False,
    )

    start_ts = datetime.now().isoformat()
    t0 = time.monotonic()

    try:
        history = await asyncio.wait_for(
            agent.run(max_steps=max_steps, on_step_end=_on_step_end),
            timeout=task_timeout,
        )
    except asyncio.TimeoutError:
        logger.error(f"Task {task.task_id} timed out after {task_timeout}s")
        # Build a minimal history so we can still pack what we have
        history = agent.history
    except Exception as e:
        logger.exception(f"Task {task.task_id} failed: {e}")
        history = agent.history
    finally:
        duration = time.monotonic() - t0
        end_ts = datetime.now().isoformat()

        # Final DOM check: the authoritative success signal is the #cb-success-banner
        # element in the page. Check it BEFORE killing the browser, regardless of
        # what the agent self-reported via done(success=True).
        if not task_succeeded:
            try:
                await asyncio.sleep(1)  # Brief delay for React state to settle
                page = await agent.browser_session.get_current_page()
                page_url = await page.evaluate("() => window.location.href")
                logger.info(f"Final DOM check: page URL = {page_url}")
                done_str = await page.evaluate(
                    "() => !!document.getElementById('cb-success-banner') "
                    "|| document.documentElement.dataset.taskDone === 'true' "
                    "|| window.__COMPONENT_BENCH_TASK_DONE__ === true"
                )
                task_succeeded = str(done_str).lower() == "true"
                if not task_succeeded:
                    banner_html = await page.evaluate(
                        "() => document.getElementById('cb-success-banner')?.outerHTML || 'NO BANNER'"
                    )
                    logger.info(f"Final DOM check: task_succeeded={task_succeeded}, banner={banner_html[:100]}")
            except Exception as e:
                logger.warning(f"Final DOM check failed: {e}")

        try:
            await browser.kill()
        except Exception:
            pass
        shutil.rmtree(browser_tmp_root, ignore_errors=True)

    if history is not None and history.number_of_steps() > 0:
        ep = await pack_episode(
            history, task,
            run_id=run_id,
            mode=mode,
            model_name=model_name,
            output_dir=output_dir,
            success=task_succeeded,
            start_ts=start_ts,
            end_ts=end_ts,
            duration_seconds=duration,
        )
    else:
        ep = None

    return task_succeeded, duration, ep


# ---------------------------------------------------------------------------
# CLI + main loop
# ---------------------------------------------------------------------------

def parse_args():
    p = argparse.ArgumentParser(
        description="Browser-Use + Gemini baseline runner for ComponentBench",
    )
    p.add_argument("--run-id", required=True, help="Experiment run identifier")
    p.add_argument("--output-root", required=True, help="Root output directory")
    p.add_argument("--output-subdir", default="",
                    help="Subdirectory under <output-root>/<run-id>/ for this worker")
    p.add_argument("--server-url", default="http://127.0.0.1:3002")
    p.add_argument("--model", default="gemini-3.1-flash-lite-preview")
    p.add_argument("--max-steps", type=int, default=20)
    p.add_argument("--task-timeout", type=int, default=600,
                    help="Per-task wall-clock timeout in seconds")
    p.add_argument("--mode", default="pixel",
                    help="Mode label for results (default: pixel)")

    # Task selection
    p.add_argument("--task-ids", default="", help="Comma-separated task IDs")
    p.add_argument("--limit", type=int, default=0, help="Max tasks (0=all)")
    p.add_argument("--canonical-types", default="", help="Comma-separated types")
    p.add_argument("--libraries", default="", help="Comma-separated libraries")
    p.add_argument("--families", default="", help="Comma-separated family IDs")

    # Sharding
    p.add_argument("--shard-id", type=int, default=0)
    p.add_argument("--num-shards", type=int, default=1)

    # Resume
    p.add_argument("--resume", action="store_true",
                    help="Skip tasks that already have episode.json")

    # Retry
    p.add_argument("--retry-delay", type=int, default=30,
                    help="Seconds to wait after API error before retrying")

    p.add_argument("--data-dir", default="data/tasks_v1")
    p.add_argument("--benchmark-version", choices=["v1", "v2"], default="v1",
                    help="Benchmark version: v1 or v2. Auto-sets data-dir if not overridden.")
    p.add_argument("-v", "--verbose", action="store_true")
    args = p.parse_args()
    if args.benchmark_version == "v2" and args.data_dir == "data/tasks_v1":
        args.data_dir = "data/tasks_v2"
    return args


def _load_completed(output_dir: Path) -> set[str]:
    """Scan episodes/ dir for already-packed task IDs."""
    completed = set()
    ep_root = output_dir / "episodes"
    if ep_root.exists():
        for d in ep_root.iterdir():
            if d.is_dir() and (d / "episode.json").exists():
                completed.add(d.name)
    return completed


async def main():
    args = parse_args()
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    has_google = bool(os.environ.get("GOOGLE_API_KEY"))
    has_vllm = bool(os.environ.get("VLLM_BASE_URL")) and bool(os.environ.get("VLLM_API_KEY"))
    if not has_google and not has_vllm:
        logger.error("No API credentials. Set GOOGLE_API_KEY, or VLLM_BASE_URL + VLLM_API_KEY.")
        sys.exit(1)

    os.chdir(_PROJECT_DIR)

    from benchmark.core import (
        load_all_tasks, filter_tasks, shard_tasks, TaskResult,
        write_run_manifest, finalize_run_manifest,
        append_result_jsonl, write_summary_from_disk,
    )

    output_dir = Path(args.output_root) / args.run_id
    if args.output_subdir:
        output_dir = output_dir / args.output_subdir
    output_dir.mkdir(parents=True, exist_ok=True)

    all_tasks = load_all_tasks(args.data_dir)

    canonical_types = [t.strip() for t in args.canonical_types.split(",") if t.strip()] or None
    libraries = [t.strip() for t in args.libraries.split(",") if t.strip()] or None
    task_ids = [t.strip() for t in args.task_ids.split(",") if t.strip()] or None
    families = [t.strip() for t in args.families.split(",") if t.strip()] or None

    filtered = filter_tasks(
        all_tasks,
        canonical_types=canonical_types,
        libraries=libraries,
        task_ids=task_ids,
        families=families,
        max_tasks=args.limit if args.limit > 0 else None,
    )

    sharded, shard_plan = shard_tasks(
        filtered, args.shard_id, args.num_shards, strategy="stride",
    )

    logger.info(f"Tasks to run: {len(sharded)} (shard {args.shard_id}/{args.num_shards})")

    completed_ids = set()
    if args.resume:
        completed_ids = _load_completed(output_dir)
        logger.info(f"Resume: {len(completed_ids)} tasks already done")

    manifest_path = output_dir / "run_manifest.json"
    if not manifest_path.exists():
        write_run_manifest(
            output_dir=output_dir,
            run_id=args.run_id,
            mode=args.mode,
            model_name=args.model,
            base_url=args.server_url,
            shard_id=args.shard_id,
            num_shards=args.num_shards,
            task_count=len(sharded),
            extra={
                "agent": "browser_use",
                "shard_plan": shard_plan,
                "args": vars(args),
            },
        )

    passed = 0
    failed = 0
    consecutive_rate_limits = 0
    MAX_CONSECUTIVE_RATE_LIMITS = 5

    for i, task in enumerate(sharded):
        if task.task_id in completed_ids:
            logger.info(f"[{i+1}/{len(sharded)}] Skipping {task.task_id} (already done)")
            continue

        logger.info(f"[{i+1}/{len(sharded)}] Running {task.task_id} "
                     f"({task.canonical_type}, {task.implementation_source})")

        retries = 0
        max_retries = 2
        success = False
        duration = 0.0
        ep = None
        error_message = None

        while retries <= max_retries:
            try:
                success, duration, ep = await run_one_task(
                    task,
                    server_url=args.server_url,
                    model_name=args.model,
                    max_steps=args.max_steps,
                    run_id=args.run_id,
                    mode=args.mode,
                    output_dir=output_dir,
                    task_timeout=args.task_timeout,
                    benchmark_version=args.benchmark_version,
                )
                break
            except Exception as e:
                retries += 1
                error_message = str(e)
                logger.error(f"Task {task.task_id} error (attempt {retries}): {e}")
                if retries <= max_retries:
                    logger.info(f"Retrying in {args.retry_delay}s...")
                    await asyncio.sleep(args.retry_delay)

        error_text = (error_message or "").lower()
        looks_disk_full = (
            "no space left on device" in error_text
            or "[errno 28]" in error_text
        )
        looks_rate_limited = (
            not looks_disk_full
            and (
                "429" in error_text
                or "resource_exhausted" in error_text
                or "rate limit" in error_text
                or "quota" in error_text
                or (
                    not success
                    and not error_message
                    and duration < 15
                    and (ep is None or ep.steps <= 5)
                )
            )
        )

        if looks_disk_full:
            logger.error(
                f"Task {task.task_id} failed due to local storage exhaustion "
                f"({error_message}). Exiting so the run can be resumed after "
                f"cleaning temp storage."
            )
            sys.exit(43)
        elif looks_rate_limited:
            consecutive_rate_limits += 1
            backoff = min(2 ** consecutive_rate_limits, 300)
            logger.warning(
                f"Task {task.task_id} looks rate-limited "
                f"(consecutive={consecutive_rate_limits}, "
                f"duration={duration:.1f}s, steps={ep.steps if ep else 0}). "
                f"Backing off {backoff}s..."
            )
            if consecutive_rate_limits >= MAX_CONSECUTIVE_RATE_LIMITS:
                logger.error(
                    f"Hit {MAX_CONSECUTIVE_RATE_LIMITS} consecutive rate-limited "
                    f"tasks. API quota likely exhausted. Exiting so --resume "
                    f"can pick up later without wasting remaining tasks."
                )
                sys.exit(42)
            await asyncio.sleep(backoff)
        else:
            consecutive_rate_limits = 0

        if success:
            passed += 1
        else:
            failed += 1

        status = "[PASS]" if success else "[FAIL]"
        logger.info(f"  {status} {task.task_id} — {duration:.1f}s, "
                     f"{ep.steps if ep else 0} steps")

        result = TaskResult(
            task_id=task.task_id,
            canonical_type=task.canonical_type,
            implementation_source=task.implementation_source,
            mode=args.mode,
            success=success,
            reward=1.0 if success else 0.0,
            steps=ep.steps if ep else 0,
            termination_reason="success" if success else "max_steps",
            start_ts=ep.start_ts if ep else datetime.now().isoformat(),
            end_ts=ep.end_ts if ep else datetime.now().isoformat(),
            duration_seconds=duration,
            hostname=socket.gethostname(),
            slurm_job_id=os.environ.get("SLURM_JOB_ID"),
            shard_id=args.shard_id,
            num_shards=args.num_shards,
            model_name=args.model,
            git_commit=_git_commit(),
            run_id=args.run_id,
            pipeline_version="v0.3-browser-use",
            error_message=error_message,
            difficulty_level=task.difficulty_level,
            difficulty_tier=task.difficulty_tier,
            task_name=task.name,
            family_id=task.family_id or "",
        )
        append_result_jsonl(result, output_dir)

    # Write summary
    write_summary_from_disk(
        output_dir=output_dir,
        run_id=args.run_id,
        model_name=args.model,
        shard_id=args.shard_id,
        num_shards=args.num_shards,
    )
    finalize_run_manifest(output_dir)

    total = passed + failed
    rate = passed / total * 100 if total else 0
    logger.info(f"\nDone! {passed}/{total} passed ({rate:.1f}%)")
    logger.info(f"Results: {output_dir}")


if __name__ == "__main__":
    asyncio.run(main())
