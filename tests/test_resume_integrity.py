#!/usr/bin/env python3
"""
Test: Resume integrity for ComponentBench v0.3.1

Verifies that:
1. results.jsonl is never overwritten on resume
2. summary is computed from ALL rows (pre-resume + new)
3. append_result_jsonl only appends
4. load_results_jsonl handles malformed lines gracefully
"""
from __future__ import annotations

import json
import os
import sys
import tempfile
from datetime import datetime
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

os.chdir(Path(__file__).parent.parent)


def make_fake_result(task_id: str, mode: str = "ax_tree", success: bool = True) -> dict:
    """Create a minimal fake TaskResult dict."""
    return {
        "task_id": task_id,
        "canonical_type": "button",
        "library": "antd",
        "mode": mode,
        "success": success,
        "reward": 1.0 if success else 0.0,
        "steps": 3,
        "termination_reason": "success" if success else "max_steps",
        "start_ts": datetime.now().isoformat(),
        "end_ts": datetime.now().isoformat(),
        "duration_seconds": 10.0,
        "hostname": "test",
        "slurm_job_id": None,
        "shard_id": 0,
        "num_shards": 1,
        "model_name": "test-model",
        "git_commit": "abc123",
        "run_id": "test_run_001",
        "pipeline_version": "v0.3.1",
        "error_message": None,
        "exp_dir": None,
        "difficulty_bucket": "medium",
        "difficulty_tier": "L1",
        "task_name": "Test task",
        "family_id": "command_navigation",
    }


def test_append_only():
    """Test that append_result_jsonl only appends, never overwrites."""
    from benchmarks.componentbench.runner import append_result_jsonl, TaskResult
    from benchmarks.componentbench.types import TaskResult as TR

    with tempfile.TemporaryDirectory() as tmpdir:
        output_dir = Path(tmpdir)
        jsonl_path = output_dir / "results.jsonl"

        # Write 2 initial lines
        with open(jsonl_path, "w") as f:
            f.write(json.dumps(make_fake_result("task-A")) + "\n")
            f.write(json.dumps(make_fake_result("task-B", success=False)) + "\n")

        assert _count_lines(jsonl_path) == 2, "Expected 2 lines initially"

        # Append 1 more via append_result_jsonl
        r = TR(
            task_id="task-C", canonical_type="checkbox", library="mui",
            mode="ax_tree", success=True, reward=1.0, steps=2,
            termination_reason="success", start_ts=datetime.now().isoformat(),
            end_ts=datetime.now().isoformat(), duration_seconds=5.0,
            hostname="test", run_id="test_run_001", pipeline_version="v0.3.1",
        )
        append_result_jsonl(r, output_dir)

        count = _count_lines(jsonl_path)
        assert count == 3, f"Expected 3 lines after append, got {count}"
        print("  [PASS] append_result_jsonl only appends")


def test_summary_from_disk():
    """Test that summary is computed from ALL rows on disk."""
    from benchmarks.componentbench.runner import write_summary_from_disk

    with tempfile.TemporaryDirectory() as tmpdir:
        output_dir = Path(tmpdir)
        jsonl_path = output_dir / "results.jsonl"

        # Write 3 rows (simulating pre-resume + new)
        with open(jsonl_path, "w") as f:
            f.write(json.dumps(make_fake_result("task-A", success=True)) + "\n")
            f.write(json.dumps(make_fake_result("task-B", success=False)) + "\n")
            f.write(json.dumps(make_fake_result("task-C", success=True)) + "\n")

        summary = write_summary_from_disk(
            output_dir, "test_run", "test-model", 0, 1
        )

        assert summary is not None, "Summary should not be None"
        assert summary.total_tasks == 3, f"Expected 3 total, got {summary.total_tasks}"
        assert summary.total_passed == 2, f"Expected 2 passed, got {summary.total_passed}"
        print("  [PASS] summary computed from all 3 rows on disk")


def test_malformed_line_resilience():
    """Test that load_results_jsonl skips malformed lines."""
    from benchmarks.componentbench.runner import load_results_jsonl

    with tempfile.TemporaryDirectory() as tmpdir:
        output_dir = Path(tmpdir)
        jsonl_path = output_dir / "results.jsonl"

        with open(jsonl_path, "w") as f:
            f.write(json.dumps(make_fake_result("task-A")) + "\n")
            f.write("THIS IS NOT VALID JSON\n")  # malformed line
            f.write(json.dumps(make_fake_result("task-B")) + "\n")
            f.write('{"task_id": "partial"\n')  # incomplete JSON

        results = load_results_jsonl(output_dir)
        assert len(results) == 2, f"Expected 2 valid results, got {len(results)}"
        print("  [PASS] malformed lines skipped gracefully")


def test_no_overwrite_on_save():
    """Test that save_results (now write_summary_from_disk) does NOT overwrite results.jsonl."""
    from benchmarks.componentbench.runner import write_summary_from_disk

    with tempfile.TemporaryDirectory() as tmpdir:
        output_dir = Path(tmpdir)
        jsonl_path = output_dir / "results.jsonl"

        # Write initial data
        initial_data = [
            make_fake_result("task-A"),
            make_fake_result("task-B"),
        ]
        with open(jsonl_path, "w") as f:
            for d in initial_data:
                f.write(json.dumps(d) + "\n")

        initial_count = _count_lines(jsonl_path)

        # Call write_summary_from_disk (should NOT touch results.jsonl)
        write_summary_from_disk(output_dir, "run_id", "model", 0, 1)

        final_count = _count_lines(jsonl_path)
        assert initial_count == final_count, \
            f"results.jsonl was modified! Before: {initial_count}, After: {final_count}"

        # Verify summary.json was created
        assert (output_dir / "summary.json").exists(), "summary.json not created"
        with open(output_dir / "summary.json") as f:
            summary_data = json.load(f)
        assert summary_data["total_tasks"] == 2, "Summary should show 2 tasks"
        print("  [PASS] results.jsonl NOT overwritten by summary generation")


def _count_lines(path: Path) -> int:
    """Count non-empty lines in a file."""
    with open(path) as f:
        return sum(1 for line in f if line.strip())


def main():
    print("=" * 60)
    print("ComponentBench v0.3.1 Resume Integrity Tests")
    print("=" * 60)

    tests = [
        ("Append-only results.jsonl", test_append_only),
        ("Summary from all disk rows", test_summary_from_disk),
        ("Malformed line resilience", test_malformed_line_resilience),
        ("No overwrite on save", test_no_overwrite_on_save),
    ]

    failures = 0
    for name, test_fn in tests:
        print(f"\nTest: {name}")
        try:
            test_fn()
        except AssertionError as e:
            print(f"  [FAIL] {e}")
            failures += 1
        except Exception as e:
            print(f"  [ERROR] {e}")
            failures += 1

    print("\n" + "=" * 60)
    if failures == 0:
        print(f"ALL {len(tests)} TESTS PASSED")
        return 0
    else:
        print(f"{failures}/{len(tests)} TESTS FAILED")
        return 1


if __name__ == "__main__":
    sys.exit(main())
