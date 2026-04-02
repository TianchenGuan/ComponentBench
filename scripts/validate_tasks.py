#!/usr/bin/env python3
"""
validate_v2_yamls.py — Validate v2 YAML metadata for ComponentBench v2.

Checks:
  1. active_factors must only contain valid factor names (not difficulty axes)
  2. difficulty_bucket must be 'hard'
  3. tier must be L2 or L3
  4. scene_context factors are present
  5. Reports any issues found

Usage:
  python3 scripts/validate_v2_yamls.py [--yaml-dir data/componentbench_v2]
"""

import argparse
import json
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    print("ERROR: pyyaml required. Install with: pip install pyyaml")
    sys.exit(1)

VALID_ACTIVE_FACTORS = {
    "theme",
    "spacing",
    "layout",
    "placement",
    "scale",
    "instances",
    "guidance",
    "clutter",
    "overlay_model",
    "internal_scroll_region",
    "confirmation_model",
    "precision_surface",
    "secondary_supporting_primitive",
}

DIFFICULTY_AXES_NOT_FACTORS = {
    "precision_requirement",
    "target_acquisition",
    "density_choice_interference",
    "depth_layering",
    "feedback_dynamics",
    "semantic_observability",
    "disambiguation_load",
}

VALID_DIFFICULTY_BUCKETS = {"hard"}
VALID_TIERS = {"L2", "L3"}

SCENE_CONTEXT_KEYS = {"theme", "spacing", "layout", "placement", "scale", "instances", "guidance", "clutter"}


def validate_task(task: dict, filename: str) -> list[dict]:
    issues = []
    tid = task.get("id", "unknown")

    # Check active_factors
    design_intent = task.get("design_intent", {})
    active_factors = design_intent.get("active_factors", [])
    if active_factors:
        for af in active_factors:
            if af in DIFFICULTY_AXES_NOT_FACTORS:
                issues.append({
                    "task_id": tid,
                    "file": filename,
                    "severity": "error",
                    "field": "design_intent.active_factors",
                    "message": f"'{af}' is a difficulty axis, not a valid factor. "
                               f"Valid factors: {', '.join(sorted(VALID_ACTIVE_FACTORS))}",
                })
            elif af not in VALID_ACTIVE_FACTORS:
                issues.append({
                    "task_id": tid,
                    "file": filename,
                    "severity": "warning",
                    "field": "design_intent.active_factors",
                    "message": f"'{af}' is not in the known factor list. "
                               f"Known: {', '.join(sorted(VALID_ACTIVE_FACTORS))}",
                })

    # Check difficulty_bucket
    difficulty = task.get("difficulty", {})
    bucket = difficulty.get("difficulty_bucket", "")
    if bucket and bucket not in VALID_DIFFICULTY_BUCKETS:
        issues.append({
            "task_id": tid,
            "file": filename,
            "severity": "warning",
            "field": "difficulty.difficulty_bucket",
            "message": f"Expected 'hard', got '{bucket}'",
        })

    # Check tier
    tier = difficulty.get("tier", "")
    if tier and tier not in VALID_TIERS:
        issues.append({
            "task_id": tid,
            "file": filename,
            "severity": "warning",
            "field": "difficulty.tier",
            "message": f"Expected L2 or L3, got '{tier}'",
        })

    # Check scene_context
    sc = task.get("scene_context", {})
    for key in SCENE_CONTEXT_KEYS:
        if key not in sc:
            issues.append({
                "task_id": tid,
                "file": filename,
                "severity": "info",
                "field": f"scene_context.{key}",
                "message": f"Missing scene_context.{key}",
            })

    # Check required fields
    for field in ["id", "name", "canonical_type", "browsergym_goal"]:
        if not task.get(field):
            issues.append({
                "task_id": tid,
                "file": filename,
                "severity": "error",
                "field": field,
                "message": f"Required field '{field}' is missing or empty",
            })

    return issues


def main():
    parser = argparse.ArgumentParser(description="Validate v2 YAML metadata")
    parser.add_argument("--yaml-dir", default="data/componentbench_v2",
                        help="Directory containing v2 YAML files")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    args = parser.parse_args()

    yaml_dir = Path(args.yaml_dir)
    if not yaml_dir.exists():
        print(f"ERROR: Directory {yaml_dir} does not exist")
        sys.exit(1)

    files = sorted(yaml_dir.glob("*.yaml"))
    if not files:
        print(f"No YAML files found in {yaml_dir}")
        sys.exit(0)

    all_issues: list[dict] = []
    total_tasks = 0
    tasks_with_issues = 0

    for fpath in files:
        try:
            content = fpath.read_text()
            parsed = yaml.safe_load(content)
            tasks = parsed if isinstance(parsed, list) else parsed.get("tasks", [])

            if not isinstance(tasks, list):
                all_issues.append({
                    "task_id": "N/A",
                    "file": fpath.name,
                    "severity": "error",
                    "field": "root",
                    "message": "File does not contain a list of tasks",
                })
                continue

            for task in tasks:
                total_tasks += 1
                issues = validate_task(task, fpath.name)
                if issues:
                    tasks_with_issues += 1
                all_issues.extend(issues)

        except Exception as e:
            all_issues.append({
                "task_id": "N/A",
                "file": fpath.name,
                "severity": "error",
                "field": "parse",
                "message": f"Failed to parse: {e}",
            })

    # Report
    errors = [i for i in all_issues if i["severity"] == "error"]
    warnings = [i for i in all_issues if i["severity"] == "warning"]
    infos = [i for i in all_issues if i["severity"] == "info"]

    if args.json:
        report = {
            "total_files": len(files),
            "total_tasks": total_tasks,
            "tasks_with_issues": tasks_with_issues,
            "errors": len(errors),
            "warnings": len(warnings),
            "info": len(infos),
            "issues": all_issues,
        }
        print(json.dumps(report, indent=2))
    else:
        print(f"=== v2 YAML Validation Report ===")
        print(f"Files scanned:       {len(files)}")
        print(f"Total tasks:         {total_tasks}")
        print(f"Tasks with issues:   {tasks_with_issues}")
        print(f"Errors:              {len(errors)}")
        print(f"Warnings:            {len(warnings)}")
        print(f"Info:                {len(infos)}")

        if errors:
            print(f"\n--- ERRORS ({len(errors)}) ---")
            for i in errors:
                print(f"  [{i['task_id']}] {i['file']}: {i['field']} — {i['message']}")

        if warnings:
            print(f"\n--- WARNINGS ({len(warnings)}) ---")
            for i in warnings:
                print(f"  [{i['task_id']}] {i['file']}: {i['field']} — {i['message']}")

        if infos:
            print(f"\n--- INFO ({len(infos)}) ---")
            for i in infos[:20]:
                print(f"  [{i['task_id']}] {i['file']}: {i['field']} — {i['message']}")
            if len(infos) > 20:
                print(f"  ... and {len(infos) - 20} more")

        if not all_issues:
            print("\nAll tasks passed validation.")

    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
