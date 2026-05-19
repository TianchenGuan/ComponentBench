#!/usr/bin/env python3
"""Validate a ComponentBench release directory against the JSON schemas.

Usage:
    python scripts/validate-release.py --version 0.5.0
    python scripts/validate-release.py --release-dir data/releases/0.5.0

Checks:
  1. All task YAMLs under tasks_v1/ and tasks_v2/ parse.
  2. Each task object conforms to schema/task.schema.json (best-effort —
     full JSON Schema validation requires the optional `jsonschema` package).
  3. Task IDs are unique within a version.
  4. human_traces/v1_reference.jsonl and v2_reference.jsonl cover all task IDs.
  5. No private fields (`debug`, `internal_notes`, `tasklab_*`) leak in YAMLs.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Iterator

try:
    import yaml  # type: ignore
except ImportError:
    print("ERROR: PyYAML required. Install with: pip install pyyaml", file=sys.stderr)
    sys.exit(1)

try:
    import jsonschema  # type: ignore
    HAVE_JSONSCHEMA = True
except ImportError:
    HAVE_JSONSCHEMA = False


REPO_ROOT = Path(__file__).resolve().parent.parent
SCHEMA_DIR = REPO_ROOT / "schema"

PRIVATE_FIELD_PREFIXES = ("internal_", "tasklab_", "debug_", "_draft_")
PRIVATE_FIELD_NAMES = {"debug", "internal_notes", "moderation_notes"}


def iter_tasks_in_file(path: Path) -> Iterator[dict[str, Any]]:
    with path.open() as f:
        data = yaml.safe_load(f)
    if not isinstance(data, list):
        raise ValueError(f"{path}: expected a YAML list of tasks")
    for entry in data:
        if not isinstance(entry, dict):
            raise ValueError(f"{path}: non-dict entry: {entry!r}")
        yield entry


def check_private_fields(task: dict[str, Any], where: str) -> list[str]:
    errs = []
    for key in task.keys():
        if key in PRIVATE_FIELD_NAMES or any(key.startswith(p) for p in PRIVATE_FIELD_PREFIXES):
            errs.append(f"{where}: task {task.get('id','?')} has private field `{key}`")
    return errs


def validate_release(release_dir: Path) -> int:
    errors: list[str] = []
    warnings: list[str] = []

    if not release_dir.is_dir():
        print(f"ERROR: not a directory: {release_dir}", file=sys.stderr)
        return 2

    # Load task schema (optional jsonschema validation)
    task_schema = None
    if HAVE_JSONSCHEMA:
        schema_file = SCHEMA_DIR / "task.schema.json"
        if schema_file.exists():
            with schema_file.open() as f:
                task_schema = json.load(f)
        else:
            warnings.append(f"schema not found at {schema_file}; skipping schema validation")
    else:
        warnings.append("jsonschema package not installed; running structural checks only")

    for version in ("v1", "v2"):
        yaml_dir = release_dir / f"tasks_{version}"
        if not yaml_dir.is_dir():
            errors.append(f"missing tasks directory: {yaml_dir}")
            continue

        all_ids: set[str] = set()
        n_tasks = 0
        for yaml_path in sorted(yaml_dir.glob("*.yaml")):
            try:
                tasks = list(iter_tasks_in_file(yaml_path))
            except Exception as e:
                errors.append(f"{yaml_path}: parse error: {e}")
                continue

            for task in tasks:
                n_tasks += 1
                tid = task.get("id")
                if not tid:
                    errors.append(f"{yaml_path}: task missing id")
                    continue
                if tid in all_ids:
                    errors.append(f"{yaml_path}: duplicate task id `{tid}`")
                all_ids.add(tid)

                errors.extend(check_private_fields(task, str(yaml_path)))

                if task_schema is not None:
                    try:
                        jsonschema.validate(task, task_schema)  # type: ignore
                    except jsonschema.ValidationError as e:  # type: ignore
                        errors.append(f"{yaml_path}: task {tid}: schema violation: {e.message}")

        # Check human traces cover all task ids
        traces_file = release_dir / "human_traces" / f"{version}_reference.jsonl"
        if traces_file.exists():
            covered: set[str] = set()
            with traces_file.open() as f:
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        rec = json.loads(line)
                    except json.JSONDecodeError as e:
                        errors.append(f"{traces_file}: invalid JSON line: {e}")
                        continue
                    if "task_id" in rec:
                        covered.add(rec["task_id"])
            missing = all_ids - covered
            extra = covered - all_ids
            if missing:
                warnings.append(f"{traces_file}: missing trace for {len(missing)} tasks (first 5: {sorted(missing)[:5]})")
            if extra:
                warnings.append(f"{traces_file}: traces for {len(extra)} tasks not in YAMLs")
        else:
            warnings.append(f"missing reference file: {traces_file}")

        print(f"  {version}: {n_tasks} tasks across {len(all_ids)} unique IDs in {yaml_dir}")

    # Metadata sanity
    for f in ("canonical_components.csv", "difficulty_axes.csv", "task_templates.csv"):
        p = release_dir / "metadata" / f
        if not p.exists():
            warnings.append(f"missing metadata file: {p}")

    print()
    if warnings:
        print(f"WARNINGS ({len(warnings)}):")
        for w in warnings:
            print(f"  - {w}")
        print()

    if errors:
        print(f"ERRORS ({len(errors)}):")
        for e in errors[:50]:
            print(f"  - {e}")
        if len(errors) > 50:
            print(f"  ... and {len(errors) - 50} more")
        return 1

    print("OK: release directory passes validation.")
    return 0


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    g = p.add_mutually_exclusive_group(required=True)
    g.add_argument("--version", help="Version tag, e.g. 0.5.0 (resolves to data/releases/<version>/)")
    g.add_argument("--release-dir", help="Explicit path to a release directory")
    args = p.parse_args()

    if args.release_dir:
        release_dir = Path(args.release_dir).resolve()
    else:
        release_dir = REPO_ROOT / "data" / "releases" / args.version

    return validate_release(release_dir)


if __name__ == "__main__":
    sys.exit(main())
