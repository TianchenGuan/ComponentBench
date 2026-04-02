#!/usr/bin/env python3
"""
Merge ComponentBench shard results into a single result set.

After running distributed shards via Slurm, use this script to:
1. Merge all results.jsonl files into results_merged.jsonl
2. Compute aggregate statistics
3. Generate summary_merged.json and aggregates.csv

Usage:
    python scripts/merge_componentbench_shards.py \
        --input_dir /results/componentbench_run/ \
        --output_dir /results/componentbench_merged/

    # Auto-detect shard directories
    python scripts/merge_componentbench_shards.py \
        --input_dir /results/componentbench_run/
"""
from __future__ import annotations

import argparse
import csv
import json
import logging
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger(__name__)


def find_shard_dirs(input_dir: Path) -> list[Path]:
    """Find shard directories or result files.
    
    Looks for:
    - shard_*/results.jsonl
    - */results.jsonl
    - results.jsonl (single file)
    """
    shard_dirs = []
    
    # Check for shard_* subdirectories
    shard_pattern = list(input_dir.glob("shard_*/results.jsonl"))
    if shard_pattern:
        shard_dirs = [p.parent for p in sorted(shard_pattern)]
        logger.info(f"Found {len(shard_dirs)} shard directories")
        return shard_dirs
    
    # Check for any subdirectories with results.jsonl
    any_results = list(input_dir.glob("*/results.jsonl"))
    if any_results:
        shard_dirs = [p.parent for p in sorted(any_results)]
        logger.info(f"Found {len(shard_dirs)} directories with results")
        return shard_dirs
    
    # Check for single results.jsonl
    if (input_dir / "results.jsonl").exists():
        logger.info("Found single results.jsonl file")
        return [input_dir]
    
    return []


def load_results(results_file: Path) -> list[dict]:
    """Load results from a JSONL file."""
    results = []
    with open(results_file, "r", encoding="utf-8") as f:
        for line_num, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            try:
                results.append(json.loads(line))
            except json.JSONDecodeError as e:
                logger.warning(f"Invalid JSON on line {line_num} in {results_file}: {e}")
    return results


def merge_results(shard_dirs: list[Path]) -> list[dict]:
    """Merge results from multiple shard directories."""
    all_results = []
    seen_keys = set()
    
    for shard_dir in shard_dirs:
        results_file = shard_dir / "results.jsonl"
        if not results_file.exists():
            logger.warning(f"No results.jsonl in {shard_dir}")
            continue
        
        results = load_results(results_file)
        logger.info(f"Loaded {len(results)} results from {shard_dir}")
        
        for result in results:
            # Deduplicate by (mode, task_id)
            key = (result.get("mode", ""), result.get("task_id", ""))
            if key in seen_keys:
                logger.debug(f"Skipping duplicate: {key}")
                continue
            seen_keys.add(key)
            all_results.append(result)
    
    logger.info(f"Total merged results: {len(all_results)}")
    return all_results


def compute_aggregates(results: list[dict]) -> dict:
    """Compute aggregate statistics from results."""
    if not results:
        return {}
    
    # Overall stats
    total = len(results)
    passed = sum(1 for r in results if r.get("success", False))
    
    # Per-mode stats
    by_mode = defaultdict(lambda: {"total": 0, "passed": 0, "steps": [], "durations": []})
    for r in results:
        mode = r.get("mode", "unknown")
        by_mode[mode]["total"] += 1
        if r.get("success", False):
            by_mode[mode]["passed"] += 1
        by_mode[mode]["steps"].append(r.get("steps", 0))
        by_mode[mode]["durations"].append(r.get("duration_seconds", 0))
    
    mode_stats = {}
    for mode, stats in by_mode.items():
        mode_stats[mode] = {
            "total": stats["total"],
            "passed": stats["passed"],
            "failed": stats["total"] - stats["passed"],
            "pass_rate": stats["passed"] / stats["total"] if stats["total"] > 0 else 0,
            "avg_steps": sum(stats["steps"]) / len(stats["steps"]) if stats["steps"] else 0,
            "avg_duration_seconds": sum(stats["durations"]) / len(stats["durations"]) if stats["durations"] else 0,
        }
    
    # Per canonical_type stats
    by_canonical_type = defaultdict(lambda: defaultdict(lambda: {"total": 0, "passed": 0}))
    for r in results:
        mode = r.get("mode", "unknown")
        ct = r.get("canonical_type", "unknown")
        by_canonical_type[mode][ct]["total"] += 1
        if r.get("success", False):
            by_canonical_type[mode][ct]["passed"] += 1
    
    canonical_type_stats = {}
    for mode, ct_stats in by_canonical_type.items():
        canonical_type_stats[mode] = {}
        for ct, stats in ct_stats.items():
            canonical_type_stats[mode][ct] = {
                "total": stats["total"],
                "passed": stats["passed"],
                "pass_rate": stats["passed"] / stats["total"] if stats["total"] > 0 else 0,
            }
    
    # Per library stats
    by_library = defaultdict(lambda: defaultdict(lambda: {"total": 0, "passed": 0}))
    for r in results:
        mode = r.get("mode", "unknown")
        lib = r.get("library", "unknown")
        by_library[mode][lib]["total"] += 1
        if r.get("success", False):
            by_library[mode][lib]["passed"] += 1
    
    library_stats = {}
    for mode, lib_stats in by_library.items():
        library_stats[mode] = {}
        for lib, stats in lib_stats.items():
            library_stats[mode][lib] = {
                "total": stats["total"],
                "passed": stats["passed"],
                "pass_rate": stats["passed"] / stats["total"] if stats["total"] > 0 else 0,
            }
    
    # Per difficulty tier stats
    by_tier = defaultdict(lambda: defaultdict(lambda: {"total": 0, "passed": 0}))
    for r in results:
        mode = r.get("mode", "unknown")
        tier = r.get("difficulty_tier", "unknown")
        by_tier[mode][tier]["total"] += 1
        if r.get("success", False):
            by_tier[mode][tier]["passed"] += 1
    
    tier_stats = {}
    for mode, t_stats in by_tier.items():
        tier_stats[mode] = {}
        for tier, stats in t_stats.items():
            tier_stats[mode][tier] = {
                "total": stats["total"],
                "passed": stats["passed"],
                "pass_rate": stats["passed"] / stats["total"] if stats["total"] > 0 else 0,
            }
    
    # Per difficulty bucket stats
    by_bucket = defaultdict(lambda: defaultdict(lambda: {"total": 0, "passed": 0}))
    for r in results:
        mode = r.get("mode", "unknown")
        bucket = r.get("difficulty_bucket", "unknown")
        by_bucket[mode][bucket]["total"] += 1
        if r.get("success", False):
            by_bucket[mode][bucket]["passed"] += 1
    
    bucket_stats = {}
    for mode, b_stats in by_bucket.items():
        bucket_stats[mode] = {}
        for bucket, stats in b_stats.items():
            bucket_stats[mode][bucket] = {
                "total": stats["total"],
                "passed": stats["passed"],
                "pass_rate": stats["passed"] / stats["total"] if stats["total"] > 0 else 0,
            }
    
    return {
        "overall": {
            "total": total,
            "passed": passed,
            "failed": total - passed,
            "pass_rate": passed / total if total > 0 else 0,
        },
        "by_mode": mode_stats,
        "by_canonical_type": canonical_type_stats,
        "by_library": library_stats,
        "by_difficulty_tier": tier_stats,
        "by_difficulty_bucket": bucket_stats,
    }


def generate_csv(results: list[dict], aggregates: dict, output_dir: Path):
    """Generate CSV files for aggregates."""
    
    # Per-task results CSV
    results_csv = output_dir / "results_all.csv"
    if results:
        fieldnames = list(results[0].keys())
        with open(results_csv, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(results)
        logger.info(f"Wrote {len(results)} results to {results_csv}")
    
    # Mode summary CSV
    mode_csv = output_dir / "aggregates_by_mode.csv"
    mode_stats = aggregates.get("by_mode", {})
    if mode_stats:
        rows = []
        for mode, stats in sorted(mode_stats.items()):
            rows.append({
                "mode": mode,
                "total": stats["total"],
                "passed": stats["passed"],
                "failed": stats["failed"],
                "pass_rate": f"{stats['pass_rate']*100:.1f}%",
                "avg_steps": f"{stats['avg_steps']:.1f}",
                "avg_duration_seconds": f"{stats['avg_duration_seconds']:.1f}",
            })
        with open(mode_csv, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=rows[0].keys())
            writer.writeheader()
            writer.writerows(rows)
        logger.info(f"Wrote mode summary to {mode_csv}")
    
    # Canonical type summary CSV (per mode)
    ct_csv = output_dir / "aggregates_by_canonical_type.csv"
    ct_stats = aggregates.get("by_canonical_type", {})
    if ct_stats:
        rows = []
        for mode, types in sorted(ct_stats.items()):
            for ct, stats in sorted(types.items()):
                rows.append({
                    "mode": mode,
                    "canonical_type": ct,
                    "total": stats["total"],
                    "passed": stats["passed"],
                    "pass_rate": f"{stats['pass_rate']*100:.1f}%",
                })
        with open(ct_csv, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=rows[0].keys())
            writer.writeheader()
            writer.writerows(rows)
        logger.info(f"Wrote canonical type summary to {ct_csv}")
    
    # Library summary CSV
    lib_csv = output_dir / "aggregates_by_library.csv"
    lib_stats = aggregates.get("by_library", {})
    if lib_stats:
        rows = []
        for mode, libs in sorted(lib_stats.items()):
            for lib, stats in sorted(libs.items()):
                rows.append({
                    "mode": mode,
                    "library": lib,
                    "total": stats["total"],
                    "passed": stats["passed"],
                    "pass_rate": f"{stats['pass_rate']*100:.1f}%",
                })
        with open(lib_csv, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=rows[0].keys())
            writer.writeheader()
            writer.writerows(rows)
        logger.info(f"Wrote library summary to {lib_csv}")
    
    # Difficulty tier summary CSV
    tier_csv = output_dir / "aggregates_by_difficulty_tier.csv"
    tier_stats = aggregates.get("by_difficulty_tier", {})
    if tier_stats:
        rows = []
        for mode, tiers in sorted(tier_stats.items()):
            for tier, stats in sorted(tiers.items()):
                rows.append({
                    "mode": mode,
                    "difficulty_tier": tier,
                    "total": stats["total"],
                    "passed": stats["passed"],
                    "pass_rate": f"{stats['pass_rate']*100:.1f}%",
                })
        with open(tier_csv, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=rows[0].keys())
            writer.writeheader()
            writer.writerows(rows)
        logger.info(f"Wrote difficulty tier summary to {tier_csv}")


def validate_merge_integrity(results: list[dict], shard_dirs: list[Path],
                             allow_mixed_commits: bool = False,
                             allow_mixed_run_ids: bool = False,
                             allow_mixed_models: bool = False) -> bool:
    """Validate merge integrity: fail on mixed commits/run_ids/models by default.
    
    v0.3 strict merge guardrail: prevents silently merging results from
    different git commits, run_ids, or models, which produces invalid comparisons.
    """
    # Check git_commit consistency
    commits = set()
    for r in results:
        c = r.get("git_commit", "")
        if c:
            commits.add(c)
    
    if len(commits) > 1 and not allow_mixed_commits:
        logger.error(
            f"STRICT MERGE FAILURE: Found {len(commits)} different git_commits: {commits}\n"
            f"  This means results were produced from different code versions.\n"
            f"  Use --allow_mixed_commits to override (NOT recommended for paper results)."
        )
        return False
    elif len(commits) > 1:
        logger.warning(f"Mixed git_commits detected (allowed via flag): {commits}")
    
    # Check run_id consistency
    run_ids = set()
    for r in results:
        rid = r.get("run_id", "")
        if rid:
            run_ids.add(rid)
    
    if len(run_ids) > 1 and not allow_mixed_run_ids:
        logger.error(
            f"STRICT MERGE FAILURE: Found {len(run_ids)} different run_ids: {run_ids}\n"
            f"  This means results were produced from different experiment runs.\n"
            f"  Use --allow_mixed_run_ids to override (NOT recommended for paper results)."
        )
        return False
    elif len(run_ids) > 1:
        logger.warning(f"Mixed run_ids detected (allowed via flag): {run_ids}")
    
    # Check model_id / model_name consistency
    models = set()
    for r in results:
        m = r.get("model_name", "")
        if m:
            models.add(m)
    
    if len(models) > 1 and not allow_mixed_models:
        logger.error(
            f"STRICT MERGE FAILURE: Found {len(models)} different model_names: {models}\n"
            f"  This means results were produced by different models.\n"
            f"  Use --allow_mixed_models to override (NOT recommended for paper results)."
        )
        return False
    elif len(models) > 1:
        logger.warning(f"Mixed model_names detected (allowed via flag): {models}")
    
    # Also check run_manifest.json files in shard dirs
    for shard_dir in shard_dirs:
        manifest = shard_dir / "run_manifest.json"
        if not manifest.exists():
            logger.warning(f"Missing run_manifest.json in {shard_dir}")
    
    return True


def main():
    parser = argparse.ArgumentParser(
        description="Merge ComponentBench shard results"
    )
    parser.add_argument(
        "--input_dir",
        type=str,
        required=True,
        help="Directory containing shard results (or parent of shard_* dirs)",
    )
    parser.add_argument(
        "--output_dir",
        type=str,
        default="",
        help="Output directory (default: input_dir/merged)",
    )
    parser.add_argument(
        "--allow_mixed_commits",
        action="store_true",
        help="Allow merging results from different git commits (NOT recommended)",
    )
    parser.add_argument(
        "--allow_mixed_run_ids",
        action="store_true",
        help="Allow merging results from different run_ids (NOT recommended)",
    )
    parser.add_argument(
        "--allow_mixed_models",
        action="store_true",
        help="Allow merging results from different models (NOT recommended)",
    )
    args = parser.parse_args()
    
    input_dir = Path(args.input_dir)
    if not input_dir.exists():
        logger.error(f"Input directory not found: {input_dir}")
        return 1
    
    # Find shard directories
    shard_dirs = find_shard_dirs(input_dir)
    if not shard_dirs:
        logger.error(f"No results found in {input_dir}")
        return 1
    
    # Determine output directory
    if args.output_dir:
        output_dir = Path(args.output_dir)
    else:
        output_dir = input_dir / "merged"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Merge results
    results = merge_results(shard_dirs)
    if not results:
        logger.error("No results to merge")
        return 1
    
    # v0.3 strict merge validation
    if not validate_merge_integrity(
        results, shard_dirs,
        allow_mixed_commits=args.allow_mixed_commits,
        allow_mixed_run_ids=args.allow_mixed_run_ids,
        allow_mixed_models=args.allow_mixed_models,
    ):
        logger.error("Merge aborted due to integrity check failure.")
        logger.error("Use --allow_mixed_commits and/or --allow_mixed_run_ids to override.")
        return 1
    
    # Save merged JSONL
    merged_jsonl = output_dir / "results_merged.jsonl"
    with open(merged_jsonl, "w", encoding="utf-8") as f:
        for result in results:
            f.write(json.dumps(result) + "\n")
    logger.info(f"Saved merged results to {merged_jsonl}")
    
    # Compute aggregates
    aggregates = compute_aggregates(results)
    
    # Save summary JSON
    summary = {
        "merge_timestamp": datetime.now().isoformat(),
        "num_shards_merged": len(shard_dirs),
        "shard_dirs": [str(d) for d in shard_dirs],
        "aggregates": aggregates,
    }
    summary_json = output_dir / "summary_merged.json"
    with open(summary_json, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)
    logger.info(f"Saved summary to {summary_json}")
    
    # Generate CSV files
    generate_csv(results, aggregates, output_dir)
    
    # Print summary
    print("\n" + "=" * 70)
    print("MERGED RESULTS SUMMARY")
    print("=" * 70)
    print(f"Shards merged: {len(shard_dirs)}")
    print(f"Total results: {aggregates['overall']['total']}")
    print(f"Passed: {aggregates['overall']['passed']} ({aggregates['overall']['pass_rate']*100:.1f}%)")
    print(f"Failed: {aggregates['overall']['failed']}")
    
    print("\nBy mode:")
    for mode, stats in sorted(aggregates.get("by_mode", {}).items()):
        print(f"  {mode}: {stats['passed']}/{stats['total']} ({stats['pass_rate']*100:.1f}%)")
    
    print("\nBy library:")
    for mode, libs in sorted(aggregates.get("by_library", {}).items()):
        for lib, stats in sorted(libs.items()):
            print(f"  {mode}/{lib}: {stats['passed']}/{stats['total']} ({stats['pass_rate']*100:.1f}%)")
    
    print("=" * 70)
    print(f"\nOutput saved to: {output_dir}")
    
    return 0


if __name__ == "__main__":
    sys.exit(main())
