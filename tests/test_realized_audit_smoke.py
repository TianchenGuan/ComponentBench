#!/usr/bin/env python3
"""
Smoke test for the ComponentBench Realized Audit pipeline.

Tests: task loading, single-task audit, summary generation, resume.
Requires: Playwright installed, ComponentBench site running on localhost:3002
(or specify --base_url).

Usage:
    python scripts/test_realized_audit_smoke.py
    python scripts/test_realized_audit_smoke.py --base_url http://localhost:3002
    python scripts/test_realized_audit_smoke.py --offline  # no browser, test data flow only
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "src"))
os.chdir(Path(__file__).parent.parent)


def test_task_loading():
    """Test that tasks load, filter, and shard correctly."""
    from benchmarks.componentbench.loader import (
        load_all_tasks, filter_tasks, shard_tasks, load_ontology_family_map,
    )

    tasks = load_all_tasks("data/tasks_v1")
    assert len(tasks) > 2900, f"Expected >2900 tasks, got {len(tasks)}"
    print(f"  [PASS] Loaded {len(tasks)} tasks")

    filtered = filter_tasks(tasks, canonical_types=["button"], libraries=["antd"], max_tasks=5)
    assert 1 <= len(filtered) <= 5, f"Filter returned {len(filtered)}"
    print(f"  [PASS] Filtered to {len(filtered)} tasks")

    shard0, plan0 = shard_tasks(filtered, 0, 2, strategy="stride")
    shard1, plan1 = shard_tasks(filtered, 1, 2, strategy="stride")
    ids0 = {t.id for t in shard0}
    ids1 = {t.id for t in shard1}
    assert not ids0 & ids1, "Shard overlap detected"
    assert len(ids0) + len(ids1) == len(filtered), "Shard coverage mismatch"
    print(f"  [PASS] Sharding: {len(shard0)} + {len(shard1)} = {len(filtered)}")

    fam_map, fam_names = load_ontology_family_map()
    assert len(fam_map) > 50, f"Expected >50 family mappings, got {len(fam_map)}"
    print(f"  [PASS] Ontology: {len(fam_map)} mappings, {len(fam_names)} families")


def test_mismatch_flags():
    """Test mismatch flag computation with synthetic data."""
    from benchmarks.componentbench.realized_audit import compute_mismatch_flags

    intended = {
        "difficulty_bucket": "hard",
        "axes_ratings": {"precision_requirement": 4, "disambiguation_load": 4, "depth_layering": 4},
        "scene_context": {"guidance": "text", "clutter": "none", "instances": 1},
    }
    realized = {
        "page_loaded": True,
        "js_error_count": 0,
        "visible_interactive_count": 3,
        "min_target_area_px2": 5000,
        "tiny_target_count_lt24": 0,
        "goal_text_probe": {"quoted_phrases": ["Submit"], "visible_match_count": 1, "unique_match": True},
        "scroll_required": False,
        "obvious_shortcuts": {"search_input": True, "filter_input": False, "number_input": False, "direct_text_input": False},
        "probe": {"post_probe_dialog_count": 0, "post_probe_option_count": 0},
    }

    flags = compute_mismatch_flags(intended, realized)
    assert "INTENDED_HIGH_PRECISION_BUT_LARGE_TARGETS_ONLY" in flags
    assert "INTENDED_HIGH_DISAMBIGUATION_BUT_UNIQUE_TARGET_MATCH" in flags
    assert "HARD_TASK_HAS_OBVIOUS_SHORTCUT" in flags
    print(f"  [PASS] Mismatch flags: {flags}")

    # Test page failure
    flags2 = compute_mismatch_flags(intended, {"page_loaded": False})
    assert "PAGE_RENDER_FAILURE" in flags2
    print(f"  [PASS] PAGE_RENDER_FAILURE flag works")


def test_extract_quoted_phrases():
    from benchmarks.componentbench.realized_audit import extract_quoted_phrases
    phrases = extract_quoted_phrases('Click the "Generate report" button in the "Report" card.')
    assert "Generate report" in phrases
    assert "Report" in phrases
    print(f"  [PASS] Extracted phrases: {phrases}")


def test_audit_data_flow(base_url: str):
    """Test full audit with a real browser on 2 tasks."""
    from benchmarks.componentbench.loader import load_all_tasks, filter_tasks
    from benchmarks.componentbench.realized_audit import run_audit

    tasks = load_all_tasks("data/tasks_v1")
    sample = filter_tasks(tasks, canonical_types=["button"], libraries=["antd"], max_tasks=2)
    assert len(sample) > 0, "No tasks found"

    with tempfile.TemporaryDirectory() as tmpdir:
        output_dir = Path(tmpdir) / "audit_smoke"
        summary = run_audit(
            tasks=sample,
            base_url=base_url,
            output_dir=output_dir,
            run_id="smoke_test",
            concurrency=1,
            timeout_ms=15000,
            probe_mode="off",
            save_flagged_artifacts=False,
            save_all_screenshots=False,
            headless=True,
        )

        assert summary["total_tasks"] == len(sample), f"Expected {len(sample)}, got {summary['total_tasks']}"
        assert (output_dir / "audit_rows.jsonl").exists(), "audit_rows.jsonl missing"
        assert (output_dir / "audit_summary.json").exists(), "audit_summary.json missing"
        assert (output_dir / "flagged_tasks.csv").exists(), "flagged_tasks.csv missing"

        with open(output_dir / "audit_rows.jsonl") as f:
            rows = [json.loads(l) for l in f if l.strip()]

        assert len(rows) == len(sample)
        for row in rows:
            assert "task_id" in row
            assert "intended" in row
            assert "realized" in row
            assert "mismatch_flags" in row
            assert row["realized"]["page_loaded"] is True or row["realized"]["page_loaded"] is False

        print(f"  [PASS] Full audit: {len(rows)} rows, {summary['tasks_flagged']} flagged")

        # Test resume
        summary2 = run_audit(
            tasks=sample,
            base_url=base_url,
            output_dir=output_dir,
            run_id="smoke_test",
            concurrency=1,
            timeout_ms=15000,
            probe_mode="off",
            save_flagged_artifacts=False,
            headless=True,
            resume=True,
        )
        with open(output_dir / "audit_rows.jsonl") as f:
            rows2 = [json.loads(l) for l in f if l.strip()]
        assert len(rows2) == len(sample), f"Resume should not add rows: {len(rows2)} != {len(sample)}"
        print(f"  [PASS] Resume: no duplicate rows")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--base_url", default="http://127.0.0.1:3002")
    parser.add_argument("--offline", action="store_true",
                        help="Skip browser-based tests")
    args = parser.parse_args()

    print("=" * 60)
    print("ComponentBench Realized Audit – Smoke Tests")
    print("=" * 60)

    print("\n1. Task loading and filtering:")
    test_task_loading()

    print("\n2. Mismatch flag computation:")
    test_mismatch_flags()

    print("\n3. Quoted phrase extraction:")
    test_extract_quoted_phrases()

    if not args.offline:
        print(f"\n4. Full audit data flow (base_url={args.base_url}):")
        test_audit_data_flow(args.base_url)
    else:
        print("\n4. Full audit data flow: SKIPPED (--offline)")

    print("\n" + "=" * 60)
    print("All smoke tests PASSED!")
    print("=" * 60)
    return 0


if __name__ == "__main__":
    sys.exit(main())
