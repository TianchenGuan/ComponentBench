"""
ComponentBench v0.3.3 benchmark runner.

Main run loop for executing tasks against the ComponentBench site
using BrowserGym.

v0.3 additions:
- run_manifest.json written per run for reproducibility
- resume_manifest.json on resume
- --max_task_walltime_seconds for per-task hard timeout
- pipeline_version tracking

v0.3.3:
- Run each task in a child process (multiprocessing.Process) with
  process.join(timeout=...) + process.kill() for reliable timeout.
  Previous approaches (SIGALRM, threading watchdog + ctypes async
  exception) all failed because Playwright's C-level blocking calls
  (drag_and_drop etc.) prevent Python signal/exception delivery.
"""
from __future__ import annotations

import json
import logging
import os
import socket
import subprocess
from dataclasses import asdict
from datetime import datetime
from pathlib import Path
from typing import Optional, Any

from omegaconf import DictConfig, OmegaConf

from browsergym.experiments import EnvArgs, ExpArgs, get_exp_result
from browsergym.core.registration import register_task

from agents.openai_agent import BrowserGymRateLimitAbort
from .types import ComponentBenchTask, TaskResult, BenchmarkSummary, ModeSummary
from .task import ComponentBenchBrowserTask, OBS_MODES, build_goal_string

logger = logging.getLogger(__name__)

PIPELINE_VERSION = "v0.3"


def get_git_commit() -> str:
    """Get current git commit hash."""
    try:
        result = subprocess.run(
            ["git", "rev-parse", "--short", "HEAD"],
            capture_output=True,
            text=True,
            timeout=5,
        )
        return result.stdout.strip() if result.returncode == 0 else "unknown"
    except Exception:
        return "unknown"


def write_run_manifest(
    output_dir: Path,
    run_id: str,
    mode: str,
    model_name: str,
    base_url: str,
    shard_id: int,
    num_shards: int,
    task_count: int,
    extra: Optional[dict] = None,
) -> dict:
    """Write run_manifest.json for reproducibility.
    
    Every benchmark run MUST produce this file. It records all parameters
    needed to reproduce or verify the run.
    """
    manifest = {
        "run_id": run_id,
        "pipeline_version": PIPELINE_VERSION,
        "mode": mode,
        "git_commit": get_git_commit(),
        "task_spec_commit": get_git_commit(),
        "hostname": socket.gethostname(),
        "slurm_job_id": os.environ.get("SLURM_JOB_ID"),
        "slurm_array_task_id": os.environ.get("SLURM_ARRAY_TASK_ID"),
        "shard_id": shard_id,
        "num_shards": num_shards,
        "base_url": base_url,
        "model_id": model_name,
        "task_count": task_count,
        "timestamp_start": datetime.now().isoformat(),
        "timestamp_end": None,  # filled on completion
    }
    if extra:
        manifest.update(extra)
    
    output_dir.mkdir(parents=True, exist_ok=True)
    manifest_path = output_dir / "run_manifest.json"
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    logger.info(f"Wrote run manifest to {manifest_path}")
    return manifest


def finalize_run_manifest(output_dir: Path):
    """Update run_manifest.json with end timestamp."""
    manifest_path = output_dir / "run_manifest.json"
    if manifest_path.exists():
        with open(manifest_path) as f:
            manifest = json.load(f)
        manifest["timestamp_end"] = datetime.now().isoformat()
        with open(manifest_path, "w", encoding="utf-8") as f:
            json.dump(manifest, f, indent=2)
        logger.info(f"Finalized run manifest: {manifest_path}")


def write_resume_manifest(
    output_dir: Path,
    run_id: str,
    completed_count: int,
    remaining_count: int,
):
    """Write resume_manifest.json when resuming a run.
    
    MUST NOT overwrite the original run_manifest.json.
    """
    resume = {
        "run_id": run_id,
        "pipeline_version": PIPELINE_VERSION,
        "resume_timestamp": datetime.now().isoformat(),
        "git_commit": get_git_commit(),
        "hostname": socket.gethostname(),
        "slurm_job_id": os.environ.get("SLURM_JOB_ID"),
        "completed_count_at_resume": completed_count,
        "remaining_count": remaining_count,
    }
    resume_path = output_dir / "resume_manifest.json"
    with open(resume_path, "w", encoding="utf-8") as f:
        json.dump(resume, f, indent=2)
    logger.info(f"Wrote resume manifest to {resume_path}")


def register_componentbench_task(
    task: ComponentBenchTask,
    base_url: str,
    mode: str,
) -> str:
    """
    Register a ComponentBench task with BrowserGym.
    
    Returns the registered task ID.
    """
    # Create unique task ID to avoid registration conflicts
    registered_id = f"componentbench.{mode}.{task.task_id}"
    
    # Build task config dict
    task_config = {
        "task_id": task.task_id,
        "browsergym_goal": task.browsergym_goal,
        "canonical_type": task.canonical_type,
        "implementation_source": task.implementation_source,
        "name": task.name,
        "difficulty_level": task.difficulty_level,
        "difficulty_tier": task.difficulty_tier,
        "benchmark_version": getattr(task, "benchmark_version", "v1"),
    }
    
    try:
        register_task(
            id=registered_id,
            task_class=ComponentBenchBrowserTask,
            task_kwargs={
                "base_url": base_url,
                "task_config": task_config,
                "mode": mode,
            },
            nondeterministic=False,
        )
        logger.debug(f"Registered task: {registered_id}")
    except ValueError as e:
        # Task already registered (can happen in loops)
        if "already registered" in str(e).lower():
            logger.debug(f"Task already registered: {registered_id}")
        else:
            raise
    
    return registered_id


def run_single_task(
    task: ComponentBenchTask,
    base_url: str,
    mode: str,
    config: DictConfig,
    run_dir: Path,
    model_name: str,
    shard_id: int = 0,
    num_shards: int = 1,
    run_id: str = "",
    max_task_walltime_seconds: int = 600,
) -> TaskResult:
    """
    Run a single task and return the result.
    
    Args:
        task: The task to run
        base_url: ComponentBench site URL
        mode: Observation mode (ax_tree, som, pixel_grid, pixel)
        config: Configuration dict
        run_dir: Directory to save results
        model_name: Name of the model being used
        shard_id: Current shard ID
        num_shards: Total number of shards
        
    Returns:
        TaskResult with outcome
    """
    start_time = datetime.now()
    start_ts = start_time.isoformat()
    
    # Register the task
    registered_task_id = register_componentbench_task(task, base_url, mode)
    
    # Get observation settings for this mode
    obs_settings = OBS_MODES.get(mode, OBS_MODES["ax_tree"])
    action_space = obs_settings.get("action_space", "bid")
    
    # Build agent args based on provider
    provider = str(getattr(config.agent, "provider", "openrouter"))
    common_kwargs = dict(
        model_name=model_name,
        demo_mode=str(getattr(config.agent, "demo_mode", "off")),
        use_screenshot=True,
        use_grid_overlay=obs_settings.get("use_grid_overlay", False),
        grid_size=int(getattr(config.agent, "grid_size", 10)),
        save_grid_screenshots=obs_settings.get("save_grid_screenshots", False),
        save_som_screenshots=obs_settings.get("use_som_overlay", False),
        use_som_overlay=obs_settings.get("use_som_overlay", False),
        use_axtree=obs_settings.get("use_axtree", False),
        use_html=obs_settings.get("use_html", False),
        action_space=action_space,
        normalize_coordinates=bool(getattr(config.agent, "normalize_coordinates", True)),
        auto_close=True,
    )
    
    if provider == "codex_cli":
        from agents.codex_agent import CodexAgentArgs
        agent_args = CodexAgentArgs(
            **common_kwargs,
            codex_binary=str(getattr(config.agent, "codex_binary", "codex")),
            codex_home=getattr(config.agent, "codex_home", None),
            timeout=int(getattr(config.agent, "timeout", 120)),
            max_retries=int(getattr(config.agent, "max_retries", 2)),
        )
    elif provider == "mai_ui":
        from agents.mai_ui_agent import MAIUIAgentArgs
        agent_args = MAIUIAgentArgs(
            provider="mai_ui",
            model_name=model_name,
            base_url=str(getattr(config.agent, "base_url", "")),
            api_key=str(getattr(config.agent, "api_key", "EMPTY")),
            demo_mode=common_kwargs.get("demo_mode", "off"),
            action_space=action_space,
        )
    elif provider == "ui_tars":
        from agents.ui_tars_agent import UITarsAgentArgs
        agent_args = UITarsAgentArgs(
            provider="ui_tars",
            model_name=model_name,
            base_url=str(getattr(config.agent, "base_url", "")),
            api_key=str(getattr(config.agent, "api_key", "EMPTY")),
            demo_mode=common_kwargs.get("demo_mode", "off"),
            action_space=action_space,
        )
    elif provider == "holo2":
        from agents.holo2_agent import Holo2AgentArgs
        agent_args = Holo2AgentArgs(
            provider="holo2",
            model_name=model_name,
            base_url=str(getattr(config.agent, "base_url", "")),
            api_key=str(getattr(config.agent, "api_key", "EMPTY")),
            demo_mode=common_kwargs.get("demo_mode", "off"),
            action_space=action_space,
        )
    else:
        from agents.openai_agent import OpenAIAgentArgs
        agent_args = OpenAIAgentArgs(**common_kwargs)
    
    # Build env args
    env_args = EnvArgs(
        task_name=registered_task_id,
        task_seed=int(getattr(config.browsergym_env_args, "task_seed", 42)),
        max_steps=int(getattr(config.browsergym_env_args, "max_steps", 20)),
        headless=bool(getattr(config.browsergym_env_args, "headless", True)),
        record_video=bool(getattr(config.browsergym_env_args, "record_video", False)),
        wait_for_user_message=False,
        slow_mo=getattr(config.browsergym_env_args, "slow_mo", None),
    )
    
    # Create experiment args
    exp_name = f"{mode}_{task.canonical_type}_{task.task_id}"
    use_som = obs_settings.get("use_som_overlay", False)
    
    exp_args = ExpArgs(
        env_args=env_args,
        agent_args=agent_args,
        exp_name=exp_name,
        save_som=use_som,
        save_screenshot=True,
    )
    exp_args.prepare(str(run_dir))
    
    # Set output directory for grid screenshots
    agent_args._output_dir = str(exp_args.exp_dir)
    
    # Run the task with a per-task timeout to prevent Playwright hangs.
    # v0.3: Use explicit max_task_walltime_seconds (default 600s = 10 min).
    task_timeout = max_task_walltime_seconds
    step_timeout = int(getattr(config.browsergym_env_args, "step_timeout", 300))
    max_steps = int(getattr(config.browsergym_env_args, "max_steps", 20))
    
    error_message: Optional[str] = None
    success = False
    reward = 0.0
    steps = 0
    termination_reason = "error"
    
    # v0.3.4: Run task in main process. Use a threading watchdog to detect
    # timeouts. If a task hangs in Playwright C code, the watchdog logs the
    # timeout but does NOT kill the process (os._exit and killpg both cause
    # worse problems). Instead, we rely on BrowserGym's built-in step timeout
    # and max_steps to eventually terminate. The watchdog sets a flag so we
    # can record the timeout in results even if the task eventually completes.
    # Previous approaches that failed:
    # - SIGALRM: can't interrupt C-level blocking calls
    # - ctypes async exception + os._exit fallback: kills next task
    # - multiprocessing.Process: NFS stale file handles (Errno 116)
    import threading
    
    _watchdog_fired = threading.Event()
    _watchdog_timer: Optional[threading.Timer] = None
    
    def _watchdog_handler():
        _watchdog_fired.set()
        logger.error(
            f"Task {task.task_id} timed out after {task_timeout}s "
            f"(step_timeout={step_timeout}s x max_steps={max_steps}). "
            f"Task will be marked as timed out when it eventually finishes."
        )
    
    try:
        _watchdog_timer = threading.Timer(float(task_timeout), _watchdog_handler)
        _watchdog_timer.daemon = True
        _watchdog_timer.start()
        
        exp_args.run()
        
        _watchdog_timer.cancel()
        
        if _watchdog_fired.is_set():
            termination_reason = "task_timeout"
            error_message = f"Task {task.task_id} exceeded {task_timeout}s walltime"
        else:
            exp_result = get_exp_result(exp_args.exp_dir)
            
            steps = int(exp_result.summary_info.get("n_steps", 0))
            reward = float(exp_result.summary_info.get("cum_reward", 0.0))
            terminated = bool(exp_result.summary_info.get("terminated", False))
            
            success = reward >= 1.0
            
            if success:
                termination_reason = "success"
            elif terminated:
                termination_reason = "terminated"
            else:
                termination_reason = "max_steps"
            
            if exp_result.summary_info.get("err_msg"):
                error_message = str(exp_result.summary_info["err_msg"])
    
    except BrowserGymRateLimitAbort:
        if _watchdog_timer:
            _watchdog_timer.cancel()
        raise
    except Exception as e:
        if _watchdog_timer:
            _watchdog_timer.cancel()
        logger.exception(f"Task {task.task_id} failed: {e}")
        error_message = str(e)
        if _watchdog_fired.is_set():
            termination_reason = "task_timeout"
        else:
            termination_reason = "error"
    
    finally:
        if _watchdog_timer:
            _watchdog_timer.cancel()
    
    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds()
    
    # Build result
    result = TaskResult(
        task_id=task.task_id,
        canonical_type=task.canonical_type,
        implementation_source=task.implementation_source,
        mode=mode,
        success=success,
        reward=reward,
        steps=steps,
        termination_reason=termination_reason,
        start_ts=start_ts,
        end_ts=end_time.isoformat(),
        duration_seconds=duration,
        hostname=socket.gethostname(),
        slurm_job_id=os.environ.get("SLURM_JOB_ID"),
        shard_id=shard_id,
        num_shards=num_shards,
        model_name=model_name,
        git_commit=get_git_commit(),
        run_id=run_id,
        pipeline_version=PIPELINE_VERSION,
        error_message=error_message,
        exp_dir=str(exp_args.exp_dir) if exp_args.exp_dir else None,
        difficulty_level=task.difficulty_level,
        difficulty_tier=task.difficulty_tier,
        task_name=task.name,
    )
    
    # Log result
    status = "[PASS]" if success else "[FAIL]"
    logger.info(
        f"{status} {task.task_id} ({mode}) - {steps} steps, "
        f"reward={reward:.1f}, {termination_reason}, {duration:.1f}s"
    )
    
    return result


def compute_mode_summary(results: list[TaskResult], mode: str) -> ModeSummary:
    """Compute summary statistics for a mode."""
    mode_results = [r for r in results if r.mode == mode]
    
    if not mode_results:
        return ModeSummary(
            mode=mode,
            total_tasks=0,
            passed=0,
            failed=0,
            pass_rate=0.0,
            avg_steps=0.0,
            avg_duration_seconds=0.0,
        )
    
    total = len(mode_results)
    passed = sum(1 for r in mode_results if r.success)
    
    # Breakdown by canonical type
    by_ct = {}
    for r in mode_results:
        ct = r.canonical_type
        if ct not in by_ct:
            by_ct[ct] = {"total": 0, "passed": 0}
        by_ct[ct]["total"] += 1
        if r.success:
            by_ct[ct]["passed"] += 1
    for ct in by_ct:
        by_ct[ct]["pass_rate"] = by_ct[ct]["passed"] / by_ct[ct]["total"]
    
    # Breakdown by library
    by_lib = {}
    for r in mode_results:
        lib = r.implementation_source
        if lib not in by_lib:
            by_lib[lib] = {"total": 0, "passed": 0}
        by_lib[lib]["total"] += 1
        if r.success:
            by_lib[lib]["passed"] += 1
    for lib in by_lib:
        by_lib[lib]["pass_rate"] = by_lib[lib]["passed"] / by_lib[lib]["total"]
    
    # Breakdown by difficulty bucket
    by_bucket = {}
    for r in mode_results:
        bucket = r.difficulty_level
        if bucket not in by_bucket:
            by_bucket[bucket] = {"total": 0, "passed": 0}
        by_bucket[bucket]["total"] += 1
        if r.success:
            by_bucket[bucket]["passed"] += 1
    for bucket in by_bucket:
        by_bucket[bucket]["pass_rate"] = by_bucket[bucket]["passed"] / by_bucket[bucket]["total"]
    
    # Breakdown by difficulty tier
    by_tier = {}
    for r in mode_results:
        tier = r.difficulty_tier
        if tier not in by_tier:
            by_tier[tier] = {"total": 0, "passed": 0}
        by_tier[tier]["total"] += 1
        if r.success:
            by_tier[tier]["passed"] += 1
    for tier in by_tier:
        by_tier[tier]["pass_rate"] = by_tier[tier]["passed"] / by_tier[tier]["total"]
    
    return ModeSummary(
        mode=mode,
        total_tasks=total,
        passed=passed,
        failed=total - passed,
        pass_rate=passed / total if total > 0 else 0.0,
        avg_steps=sum(r.steps for r in mode_results) / total,
        avg_duration_seconds=sum(r.duration_seconds for r in mode_results) / total,
        by_canonical_type=by_ct,
        by_library=by_lib,
        by_difficulty_level=by_bucket,
        by_difficulty_tier=by_tier,
    )


def append_result_jsonl(result: TaskResult, output_dir: Path):
    """Append a single TaskResult to results.jsonl (append-only, never truncate).
    
    v0.3.1: results.jsonl is treated as an APPEND-ONLY EVENT LOG.
    This function is the ONLY way new rows should be added.
    """
    output_dir.mkdir(parents=True, exist_ok=True)
    jsonl_path = output_dir / "results.jsonl"
    with open(jsonl_path, "a", encoding="utf-8") as f:
        f.write(result.to_jsonl() + "\n")


def load_results_jsonl(output_dir: Path) -> list[TaskResult]:
    """Load all TaskResult objects from results.jsonl on disk.
    
    v0.3.1: This is the source of truth. Malformed lines are skipped
    with a warning (handles partial writes from crashes).
    
    Returns:
        List of TaskResult objects parsed from disk.
    """
    jsonl_path = output_dir / "results.jsonl"
    results = []
    if not jsonl_path.exists():
        return results
    
    with open(jsonl_path, "r", encoding="utf-8") as f:
        for line_num, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            try:
                data = json.loads(line)
                # Build TaskResult from dict, tolerating missing fields
                results.append(TaskResult(
                    task_id=data.get("task_id", ""),
                    canonical_type=data.get("canonical_type", ""),
                    implementation_source=data.get("library", data.get("implementation_source", "")),
                    mode=data.get("mode", ""),
                    success=data.get("success", False),
                    reward=data.get("reward", 0.0),
                    steps=data.get("steps", 0),
                    termination_reason=data.get("termination_reason", "unknown"),
                    start_ts=data.get("start_ts", ""),
                    end_ts=data.get("end_ts", ""),
                    duration_seconds=data.get("duration_seconds", 0.0),
                    hostname=data.get("hostname", ""),
                    slurm_job_id=data.get("slurm_job_id"),
                    shard_id=data.get("shard_id", 0),
                    num_shards=data.get("num_shards", 1),
                    model_name=data.get("model_name", ""),
                    git_commit=data.get("git_commit", ""),
                    run_id=data.get("run_id", ""),
                    pipeline_version=data.get("pipeline_version", ""),
                    error_message=data.get("error_message"),
                    exp_dir=data.get("exp_dir"),
                    difficulty_level=data.get("difficulty_bucket", data.get("difficulty_level", "")),
                    difficulty_tier=data.get("difficulty_tier", ""),
                    task_name=data.get("task_name", ""),
                    family_id=data.get("family_id", ""),
                ))
            except (json.JSONDecodeError, TypeError) as e:
                logger.warning(f"Skipping malformed line {line_num} in results.jsonl: {e}")
                continue
    
    logger.info(f"Loaded {len(results)} results from {jsonl_path}")
    return results


def write_summary_from_disk(
    output_dir: Path,
    run_id: str,
    model_name: str,
    shard_id: int,
    num_shards: int,
) -> Optional[BenchmarkSummary]:
    """Compute and write summary.json from the results.jsonl on disk.
    
    v0.3.1: summary is ALWAYS computed from the on-disk JSONL (source of truth),
    never from an in-memory list that might be incomplete on resume.
    """
    results = load_results_jsonl(output_dir)
    if not results:
        logger.warning("No results found on disk for summary")
        return None
    
    # Compute summaries
    modes = list(set(r.mode for r in results))
    mode_summaries = {mode: compute_mode_summary(results, mode) for mode in modes}
    
    total = len(results)
    passed = sum(1 for r in results if r.success)
    
    summary = BenchmarkSummary(
        run_id=run_id,
        start_time=min(r.start_ts for r in results) if results else "",
        end_time=max(r.end_ts for r in results) if results else "",
        model_name=model_name,
        git_commit=get_git_commit(),
        shard_id=shard_id,
        num_shards=num_shards,
        total_tasks=total,
        total_passed=passed,
        total_failed=total - passed,
        overall_pass_rate=passed / total if total > 0 else 0.0,
        mode_summaries=mode_summaries,
    )
    
    # Write summary JSON
    summary_path = output_dir / "summary.json"
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(summary.to_dict(), indent=2, fp=f, default=str)
    logger.info(f"Saved summary ({total} results) to {summary_path}")
    
    return summary


def save_results(
    results: list[TaskResult],
    output_dir: Path,
    run_id: str,
    model_name: str,
    shard_id: int,
    num_shards: int,
):
    """Compute and write summary from disk (v0.3.1 resume-safe).
    
    IMPORTANT: This function NO LONGER overwrites results.jsonl.
    Results are appended incrementally during execution.
    This function only writes summary.json from the disk JSONL.
    """
    return write_summary_from_disk(output_dir, run_id, model_name, shard_id, num_shards)


def print_summary(summary: BenchmarkSummary):
    """Print summary to console."""
    print("\n" + "=" * 70)
    print(f"COMPONENTBENCH RESULTS - {summary.run_id}")
    print("=" * 70)
    print(f"Model: {summary.model_name}")
    print(f"Shard: {summary.shard_id + 1}/{summary.num_shards}")
    print(f"Total: {summary.total_tasks} tasks")
    print(f"Passed: {summary.total_passed} ({summary.overall_pass_rate * 100:.1f}%)")
    print(f"Failed: {summary.total_failed}")
    
    for mode, mode_summary in summary.mode_summaries.items():
        if isinstance(mode_summary, dict):
            ms = ModeSummary(**mode_summary)
        else:
            ms = mode_summary
        print(f"\n{mode.upper()}:")
        print(f"  Pass rate: {ms.pass_rate * 100:.1f}% ({ms.passed}/{ms.total_tasks})")
        print(f"  Avg steps: {ms.avg_steps:.1f}")
        print(f"  Avg duration: {ms.avg_duration_seconds:.1f}s")
    
    print("=" * 70 + "\n")


def load_completed_task_ids(output_dir: Path) -> set[str]:
    """Load task IDs that have already been completed (for resume).
    
    Args:
        output_dir: Directory containing results.jsonl
        
    Returns:
        Set of completed task IDs (as "mode:task_id" strings)
    """
    completed = set()
    jsonl_path = output_dir / "results.jsonl"
    
    if jsonl_path.exists():
        with open(jsonl_path, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    try:
                        data = json.loads(line)
                        task_id = data.get("task_id", "")
                        mode = data.get("mode", "")
                        if task_id and mode:
                            completed.add(f"{mode}:{task_id}")
                    except json.JSONDecodeError:
                        continue
    
    if completed:
        logger.info(f"Loaded {len(completed)} completed tasks for resume")
    
    return completed
