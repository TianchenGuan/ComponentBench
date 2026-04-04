#!/usr/bin/env python3
"""
ComponentBench v0.3 Benchmark Runner

Runs agents against the ComponentBench site (97 canonical types, 2910 tasks)
using BrowserGym for evaluation.

Usage:
    # Smoke test (2 tasks)
    python scripts/run_componentbench_benchmark.py \
        --mode pixel \
        --canonical_types button \
        --libraries antd \
        --max_tasks 2 \
        --output_dir /tmp/cb_smoke

    # Full run with sharding
    python scripts/run_componentbench_benchmark.py \
        --mode all \
        --shard_id 0 --num_shards 2 \
        --output_dir /results/shard_0

    # Dry run to see task counts
    python scripts/run_componentbench_benchmark.py \
        --mode all --dry_run
"""
from __future__ import annotations

import argparse
import json
import logging
import os
import sys
from datetime import datetime
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from omegaconf import OmegaConf, DictConfig

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger(__name__)


# Valid modes
VALID_MODES = ["ax_tree", "som", "set_of_marks", "pixel", "browser_use", "ui_tars_native", "all"]


def parse_args():
    parser = argparse.ArgumentParser(
        description="Run ComponentBench v0.2 benchmark",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    
    # Mode selection
    parser.add_argument(
        "--mode",
        choices=VALID_MODES,
        default="all",
        help="Observation mode (default: all)",
    )
    
    # Site URL
    parser.add_argument(
        "--base_url",
        type=str,
        default="http://127.0.0.1:3002",
        help="ComponentBench site URL (default: http://127.0.0.1:3002)",
    )
    
    # Filtering options
    parser.add_argument(
        "--canonical_types",
        type=str,
        default="",
        help="Comma-separated list of canonical types to include (default: all)",
    )
    parser.add_argument(
        "--libraries",
        type=str,
        default="",
        help="Comma-separated list of libraries: antd,mui,mantine (default: all)",
    )
    parser.add_argument(
        "--difficulty_tiers",
        type=str,
        default="",
        help="Comma-separated list of difficulty tiers: L0,L1,L2,L3 (default: all)",
    )
    parser.add_argument(
        "--difficulty_buckets",
        type=str,
        default="",
        help="Comma-separated list of difficulty buckets: easy,mid,hard (default: all)",
    )
    parser.add_argument(
        "--task_ids",
        type=str,
        default="",
        help="Comma-separated list of specific task IDs (default: all)",
    )
    parser.add_argument(
        "--max_tasks",
        type=int,
        default=None,
        help="Maximum number of tasks to run (default: no limit)",
    )
    parser.add_argument(
        "--families",
        type=str,
        default="",
        help="Comma-separated list of family IDs to include (default: all)",
    )
    
    # Sharding
    parser.add_argument(
        "--shard_id",
        type=int,
        default=0,
        help="Shard ID for distributed runs (0-indexed, default: 0)",
    )
    parser.add_argument(
        "--num_shards",
        type=int,
        default=1,
        help="Total number of shards (default: 1)",
    )
    parser.add_argument(
        "--shard_strategy",
        type=str,
        choices=["stride", "canonical_type", "family"],
        default="stride",
        help="Sharding strategy (default: stride)",
    )
    
    # List families
    parser.add_argument(
        "--list_families",
        action="store_true",
        help="Print available family IDs and task counts, then exit",
    )
    
    # Output
    parser.add_argument(
        "--output_dir",
        type=str,
        default="",
        help="Output directory (default: results/componentbench_<timestamp>)",
    )
    
    # Resume and dry run
    parser.add_argument(
        "--resume",
        action="store_true",
        help="Skip tasks that already have results in output_dir",
    )
    parser.add_argument(
        "--dry_run",
        action="store_true",
        help="Print task counts and exit without running",
    )
    
    # Agent and environment
    parser.add_argument(
        "--model_id",
        type=str,
        default="",
        help="Override agent model name (e.g., moonshotai/kimi-k2.5). Takes precedence over config.",
    )
    parser.add_argument(
        "--agent_config",
        type=str,
        default="gpt",
        help="Agent config file name (default: gpt)",
    )
    parser.add_argument(
        "--headless",
        action="store_true",
        default=True,
        help="Run browser headless (default: True)",
    )
    parser.add_argument(
        "--max_steps",
        type=int,
        default=20,
        help="Maximum steps per task (default: 20)",
    )
    parser.add_argument(
        "--max_task_walltime_seconds",
        type=int,
        default=600,
        help="Max wall-clock seconds per task before timeout (default: 600)",
    )
    
    # Debug options
    parser.add_argument(
        "--save_failure_artifacts",
        action="store_true",
        help="Save screenshots and HTML on task failure",
    )
    parser.add_argument(
        "--verbose",
        "-v",
        action="store_true",
        help="Enable verbose logging",
    )
    
    # Versioning
    parser.add_argument(
        "--data_dir",
        type=str,
        default="",
        help="Override task YAML directory (default: from config, or auto-set by --benchmark_version)",
    )
    parser.add_argument(
        "--benchmark_version",
        type=str,
        choices=["v1", "v2"],
        default="v1",
        help="Benchmark version: v1 (2910 tasks) or v2 (912 tasks). Sets data_dir and task URL automatically.",
    )
    
    return parser.parse_args()


def load_config(agent_config: str) -> DictConfig:
    """Load Hydra configuration."""
    config_dir = Path("configs")

    # Load main config
    main_cfg = OmegaConf.load(config_dir / "config.yaml")

    # Load benchmark config
    bench_cfg = OmegaConf.load(config_dir / "benchmark" / "componentbench.yaml")

    # Load agent config
    agent_cfg_path = config_dir / "agents" / f"{agent_config}.yaml"
    if not agent_cfg_path.exists():
        # Fall back to gpt
        agent_cfg_path = config_dir / "agents" / "gpt.yaml"
    agent_cfg = OmegaConf.load(agent_cfg_path)
    logger.info(f"Using agent config: {agent_cfg_path}")

    # Load env args
    env_cfg = OmegaConf.load(config_dir / "environment" / "default.yaml")
    
    # Merge
    config = OmegaConf.merge(
        main_cfg,
        {"benchmark": bench_cfg},
        {"agent": agent_cfg},
        {"browsergym_env_args": env_cfg},
    )
    
    return config


def main():
    args = parse_args()
    
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    # Change to project root
    script_dir = Path(__file__).parent
    project_dir = script_dir.parent
    os.chdir(project_dir)
    
    # Import after changing directory so relative imports work
    from benchmark.core import (
        load_all_tasks,
        filter_tasks,
        shard_tasks,
        print_task_statistics,
        get_task_statistics,
        run_single_task,
        append_result_jsonl,
        load_results_jsonl,
        write_summary_from_disk,
        print_summary,
        load_completed_task_ids,
        load_ontology_family_map,
        write_run_manifest,
        finalize_run_manifest,
        write_resume_manifest,
        PIPELINE_VERSION,
        OBS_MODES,
        TaskResult,
    )

    from benchmark.agents.openai_agent import BrowserGymRateLimitAbort

    # Conditional import: CodexRateLimitError (only available with codex backend)
    try:
        from benchmark.agents.codex_agent import CodexRateLimitError
    except ImportError:
        CodexRateLimitError = None  # type: ignore[assignment,misc]
    
    # Load configuration
    config = load_config(args.agent_config)
    
    # Override config with CLI args
    OmegaConf.update(config, "benchmark.base_url", args.base_url)
    OmegaConf.update(config, "browsergym_env_args.headless", args.headless)
    OmegaConf.update(config, "browsergym_env_args.max_steps", args.max_steps)
    
    # Get model name from config, allow --model_id override
    model_name = config.agent.model_name
    if args.model_id:
        model_name = args.model_id
        OmegaConf.update(config, "agent.model_name", model_name)
        logger.info(f"Model overridden by --model_id: {model_name}")
    
    # Determine output directory
    if args.output_dir:
        output_dir = Path(args.output_dir)
    else:
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        output_dir = Path("results") / f"componentbench_{timestamp}"
    
    # Load all tasks
    if args.data_dir:
        data_dir = args.data_dir
    elif args.benchmark_version == "v2":
        data_dir = "data/componentbench_v2"
    else:
        data_dir = config.benchmark.data_dir
    all_tasks = load_all_tasks(data_dir)
    
    if args.benchmark_version == "v2":
        for t in all_tasks:
            t.benchmark_version = "v2"
    
    # Handle --list_families
    if args.list_families:
        _, family_names = load_ontology_family_map()
        stats = get_task_statistics(all_tasks)
        family_counts = stats["by_family"]
        
        print("\nAvailable Families:")
        print("=" * 60)
        for fam_id in sorted(family_names.keys()):
            name = family_names[fam_id]
            count = family_counts.get(fam_id, 0)
            print(f"  {fam_id}: {name} ({count} tasks)")
        print(f"\nTotal: {len(family_names)} families, {len(all_tasks)} tasks")
        print("=" * 60)
        return 0
    
    # Apply filters
    canonical_types = [t.strip() for t in args.canonical_types.split(",") if t.strip()] or None
    libraries = [t.strip() for t in args.libraries.split(",") if t.strip()] or None
    difficulty_tiers = [t.strip() for t in args.difficulty_tiers.split(",") if t.strip()] or None
    difficulty_buckets = [t.strip() for t in args.difficulty_buckets.split(",") if t.strip()] or None
    task_ids = [t.strip() for t in args.task_ids.split(",") if t.strip()] or None
    families = [t.strip() for t in args.families.split(",") if t.strip()] or None
    
    filtered_tasks = filter_tasks(
        all_tasks,
        canonical_types=canonical_types,
        libraries=libraries,
        difficulty_tiers=difficulty_tiers,
        difficulty_buckets=difficulty_buckets,
        task_ids=task_ids,
        families=families,
        max_tasks=args.max_tasks,
    )
    
    # Apply sharding with strategy
    sharded_tasks, shard_plan = shard_tasks(
        filtered_tasks, 
        args.shard_id, 
        args.num_shards,
        strategy=args.shard_strategy,
    )
    
    # Determine modes (normalize aliases: set_of_marks → som)
    from benchmark.core.task import normalize_mode
    if args.mode == "all":
        modes = ["ax_tree", "som", "pixel"]
    else:
        modes = [normalize_mode(args.mode)]
    
    # Calculate total tasks to run
    total_tasks_to_run = len(sharded_tasks) * len(modes)
    
    # Print statistics
    print_task_statistics(sharded_tasks, f"Tasks to run (shard {args.shard_id}/{args.num_shards})")
    
    logger.info(f"Modes: {modes}")
    logger.info(f"Total task-mode combinations: {total_tasks_to_run}")
    logger.info(f"Output directory: {output_dir}")
    
    if args.dry_run:
        logger.info("DRY RUN - exiting without running tasks")
        print(f"\nDry run summary:")
        print(f"  Total tasks: {len(all_tasks)}")
        print(f"  After filters: {len(filtered_tasks)}")
        print(f"  Shard strategy: {args.shard_strategy}")
        print(f"  After sharding (shard {args.shard_id}/{args.num_shards}): {len(sharded_tasks)}")
        print(f"  Modes: {modes}")
        print(f"  Total runs: {total_tasks_to_run}")
        
        # Print shard plan details for group-based strategies
        if args.shard_strategy in ["canonical_type", "family"] and "assignments" in shard_plan:
            print(f"\n  Shard assignments:")
            for sid, groups in sorted(shard_plan["assignments"].items()):
                count = shard_plan["counts"].get(sid, 0)
                print(f"    Shard {sid}: {count} tasks from {len(groups)} groups")
                if sid == args.shard_id:
                    print(f"      Groups: {', '.join(sorted(groups)[:10])}{'...' if len(groups) > 10 else ''}")
        
        # Show task IDs in this shard (first 10)
        print(f"\n  Tasks in this shard (first 10):")
        for task in sharded_tasks[:10]:
            print(f"    {task.task_id} ({task.canonical_type}, {task.family_id or 'unknown'})")
        if len(sharded_tasks) > 10:
            print(f"    ... and {len(sharded_tasks) - 10} more")
        
        return 0
    
    # Create output directory
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate stable run_id
    run_id = f"componentbench_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    
    # Load completed tasks for resume
    completed_ids = set()
    if args.resume:
        completed_ids = load_completed_task_ids(output_dir)
        if completed_ids:
            # Try to reuse existing run_id from manifest
            existing_manifest = output_dir / "run_manifest.json"
            if existing_manifest.exists():
                with open(existing_manifest) as f:
                    old_manifest = json.load(f)
                run_id = old_manifest.get("run_id", run_id)
                logger.info(f"Resuming run {run_id} ({len(completed_ids)} tasks already done)")
            remaining = len(sharded_tasks) * len(modes) - len(completed_ids)
            write_resume_manifest(output_dir, run_id, len(completed_ids), remaining)
    
    # Write run_manifest.json (only if not resuming or no existing manifest)
    manifest_path = output_dir / "run_manifest.json"
    if not manifest_path.exists():
        mode_str = ",".join(modes) if len(modes) > 1 else modes[0]
        write_run_manifest(
            output_dir=output_dir,
            run_id=run_id,
            mode=mode_str,
            model_name=model_name,
            base_url=args.base_url,
            shard_id=args.shard_id,
            num_shards=args.num_shards,
            task_count=len(sharded_tasks),
            extra={
                "shard_strategy": args.shard_strategy,
                "shard_plan": shard_plan,
                "args": vars(args),
            },
        )
    
    # Save run config (for backwards compat)
    run_config = {
        "args": vars(args),
        "model_name": model_name,
        "modes": modes,
        "total_tasks": len(sharded_tasks),
        "shard_id": args.shard_id,
        "num_shards": args.num_shards,
        "shard_strategy": args.shard_strategy,
        "shard_plan": shard_plan,
        "start_time": datetime.now().isoformat(),
        "pipeline_version": PIPELINE_VERSION,
    }
    with open(output_dir / "run_config.json", "w") as f:
        json.dump(run_config, f, indent=2)
    
    # Set output dir env var so agents can write marker files
    os.environ["COMPONENTBENCH_OUTPUT_DIR"] = str(output_dir)
    
    # Run benchmark
    # v0.3.1: results.jsonl is APPEND-ONLY. Each result is written to disk
    # immediately. Summary is computed from the on-disk file at the end.
    new_results_count = 0
    
    for mode in modes:
        logger.info(f"\n{'='*60}")
        logger.info(f"Running mode: {mode}")
        logger.info(f"{'='*60}")
        
        for i, task in enumerate(sharded_tasks):
            # Check if already completed (for resume)
            task_key = f"{mode}:{task.task_id}"
            if task_key in completed_ids:
                logger.info(f"Skipping {task.task_id} ({mode}) - already completed")
                continue
            
            logger.info(f"\n[{i+1}/{len(sharded_tasks)}] Running {task.task_id} ({mode})")
            
            try:
                result = run_single_task(
                    task=task,
                    base_url=args.base_url,
                    mode=mode,
                    config=config.copy(),
                    run_dir=output_dir,
                    model_name=model_name,
                    shard_id=args.shard_id,
                    num_shards=args.num_shards,
                    run_id=run_id,
                    max_task_walltime_seconds=args.max_task_walltime_seconds,
                )
                # v0.3.1: Append to disk immediately (never overwrite)
                append_result_jsonl(result, output_dir)
                new_results_count += 1
                
                # Check for rate limit marker (written by CodexCliAgent)
                rate_limit_marker = output_dir / ".rate_limited"
                if rate_limit_marker.exists():
                    logger.error(f"RATE LIMIT: Agent signaled rate limit via {rate_limit_marker}")
                    logger.error("Stopping shard cleanly. Resume after limit resets.")
                    write_summary_from_disk(
                        output_dir=output_dir, run_id=run_id,
                        model_name=model_name, shard_id=args.shard_id,
                        num_shards=args.num_shards,
                    )
                    finalize_run_manifest(output_dir)
                    sys.exit(42)
            
            except BaseException as e:
                if isinstance(e, BrowserGymRateLimitAbort):
                    logger.error(f"RATE LIMITED on {task.task_id} ({mode}): {e}")
                    logger.error("Stopping shard. Resume after rate limit resets.")
                    write_summary_from_disk(
                        output_dir=output_dir, run_id=run_id,
                        model_name=model_name, shard_id=args.shard_id,
                        num_shards=args.num_shards,
                    )
                    finalize_run_manifest(output_dir)
                    sys.exit(42)

                # Rate limit: stop the entire shard immediately, exit 42 for resume
                if CodexRateLimitError is not None and isinstance(e, CodexRateLimitError):
                    logger.error(f"RATE LIMITED on {task.task_id} ({mode}): {e}")
                    logger.error("Stopping shard. Resume after rate limit resets.")
                    write_summary_from_disk(
                        output_dir=output_dir, run_id=run_id,
                        model_name=model_name, shard_id=args.shard_id,
                        num_shards=args.num_shards,
                    )
                    finalize_run_manifest(output_dir)
                    sys.exit(42)
                
                # KeyboardInterrupt / SystemExit: propagate without writing failure row
                if isinstance(e, (KeyboardInterrupt, SystemExit)):
                    raise
                
                # v0.3.1: Write a failure row so denominators remain correct
                logger.exception(f"Failed to run {task.task_id} ({mode}): {e}")
                import socket as _socket
                error_result = TaskResult(
                    task_id=task.task_id,
                    canonical_type=task.canonical_type,
                    library=task.implementation_source,
                    mode=mode,
                    success=False,
                    reward=0.0,
                    steps=0,
                    termination_reason="runner_error",
                    start_ts=datetime.now().isoformat(),
                    end_ts=datetime.now().isoformat(),
                    duration_seconds=0.0,
                    hostname=_socket.gethostname(),
                    slurm_job_id=os.environ.get("SLURM_JOB_ID"),
                    shard_id=args.shard_id,
                    num_shards=args.num_shards,
                    model_name=model_name,
                    git_commit="",
                    run_id=run_id,
                    pipeline_version=PIPELINE_VERSION,
                    error_message=str(e),
                    difficulty_level=task.difficulty_level,
                    difficulty_tier=task.difficulty_tier,
                    task_name=task.name,
                    family_id=task.family_id or "",
                )
                append_result_jsonl(error_result, output_dir)
                new_results_count += 1
    
    # v0.3.1: Compute summary from the FULL on-disk JSONL (includes pre-resume rows)
    # This is the ONLY place summary.json is written. results.jsonl is NEVER overwritten.
    summary = write_summary_from_disk(
        output_dir=output_dir,
        run_id=run_id,
        model_name=model_name,
        shard_id=args.shard_id,
        num_shards=args.num_shards,
    )
    if summary:
        print_summary(summary)
    else:
        logger.warning("No results to summarize")
    
    # Finalize run manifest with end timestamp
    finalize_run_manifest(output_dir)
    
    logger.info(f"\nBenchmark complete! Results saved to {output_dir}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
