#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import shutil
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Flatten a sharded BrowserGym raw run into pack_run.py layout."
    )
    parser.add_argument(
        "--extracted-root",
        required=True,
        help="Directory containing merged_results.jsonl and shard_* subdirs",
    )
    parser.add_argument(
        "--output-root",
        required=True,
        help="Destination raw run root; mode dir will be created inside it",
    )
    parser.add_argument(
        "--mode",
        required=True,
        help="Mode name to create under output-root, e.g. pixel or som",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    extracted_root = Path(args.extracted_root).resolve()
    output_root = Path(args.output_root).resolve()
    mode_dir = output_root / args.mode

    merged_results = extracted_root / "merged_results.jsonl"
    if not extracted_root.is_dir():
        raise SystemExit(f"Extracted root not found: {extracted_root}")
    if not merged_results.is_file():
        raise SystemExit(f"Missing merged_results.jsonl: {merged_results}")

    if output_root.exists():
        shutil.rmtree(output_root)
    mode_dir.mkdir(parents=True, exist_ok=True)

    seen_rows: dict[str, str] = {}
    with merged_results.open() as f:
        for line in f:
            if not line.strip():
                continue
            row = json.loads(line)
            task_id = row["task_id"]
            if task_id not in seen_rows:
                seen_rows[task_id] = json.dumps(row, separators=(",", ":"))

    with (mode_dir / "results.jsonl").open("w") as f:
        for line in seen_rows.values():
            f.write(line + "\n")

    linked = 0
    skipped = 0
    for shard_dir in sorted(extracted_root.glob("shard_*")):
        if not shard_dir.is_dir():
            continue
        for child in sorted(shard_dir.iterdir()):
            if not child.is_dir():
                continue
            if not child.name.startswith("20"):
                continue
            target = mode_dir / child.name
            if target.exists():
                if os.path.samefile(child, target):
                    skipped += 1
                    continue
                raise SystemExit(f"Duplicate trace dir name with different target: {child.name}")
            os.symlink(child, target, target_is_directory=True)
            linked += 1

    print(f"mode_dir={mode_dir}")
    print(f"results_rows={len(seen_rows)}")
    print(f"linked_trace_dirs={linked}")
    print(f"skipped_existing={skipped}")


if __name__ == "__main__":
    main()
