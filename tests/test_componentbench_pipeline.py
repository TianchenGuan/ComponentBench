#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
import tempfile
import unittest
from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd

REPO_ROOT = Path(__file__).resolve().parents[1]
SCRIPT_DIR = str(Path(__file__).resolve().parent)
if SCRIPT_DIR in sys.path:
    sys.path.remove(SCRIPT_DIR)
sys.path.insert(0, str(REPO_ROOT))
sys.path.insert(0, str(REPO_ROOT / "DataAnalysis"))

import componentbench_pipeline as cbp


class TestNormalizeMode(unittest.TestCase):
    def test_path_mode_overrides_raw_pixel(self):
        mode, raw = cbp.normalize_mode("pixel", Path("/tmp/results/gemini/v1_browser_use"))
        self.assertEqual(mode, "browser_use")
        self.assertEqual(raw, "pixel")

    def test_webarena_maps_from_path(self):
        mode, raw = cbp.normalize_mode("webarena", Path("/tmp/results/Qwen3-VL-235B/v1_ax_tree"))
        self.assertEqual(mode, "ax_tree")
        self.assertEqual(raw, "webarena")

    def test_raw_mode_used_when_path_is_ambiguous(self):
        mode, raw = cbp.normalize_mode("som", Path("/tmp/results/custom/run_001"))
        self.assertEqual(mode, "som")
        self.assertEqual(raw, "som")


class TestRealizedFiltering(unittest.TestCase):
    def test_mismatched_v2_realized_rows_are_excluded(self):
        metadata = pd.DataFrame(
            [
                {"task_id": "accordion-antd-T01", "benchmark_version_meta": "v1"},
                {"task_id": "core-task-001", "benchmark_version_meta": "v2"},
            ]
        )
        axes = pd.DataFrame(
            [
                {"task_id": "accordion-antd-T01", "realized_source_version": "v1", "realized_bucket": "easy"},
                {"task_id": "accordion-antd-T01", "realized_source_version": "v2", "realized_bucket": "hard"},
            ]
        )
        features = pd.DataFrame(
            [
                {"task_id": "accordion-antd-T01", "realized_source_version": "v1", "realized_feature__drag_count": 0},
                {"task_id": "accordion-antd-T01", "realized_source_version": "v2", "realized_feature__drag_count": 1},
            ]
        )
        realized, issues = cbp.filter_realized_to_metadata(metadata, axes, features)
        self.assertEqual(set(realized["task_id"]), {"accordion-antd-T01"})
        self.assertIn("realized_*_v2 artifacts were found locally", issues[0])

    def test_matching_v2_realized_rows_are_kept(self):
        metadata = pd.DataFrame([{"task_id": "core-task-001", "benchmark_version_meta": "v2"}])
        axes = pd.DataFrame([{"task_id": "core-task-001", "realized_source_version": "v2", "realized_bucket": "medium"}])
        features = pd.DataFrame([{"task_id": "core-task-001", "realized_source_version": "v2", "realized_feature__drag_count": 2}])
        realized, issues = cbp.filter_realized_to_metadata(metadata, axes, features)
        self.assertEqual(set(realized["task_id"]), {"core-task-001"})
        self.assertEqual(issues, [])


class TestHumanLoading(unittest.TestCase):
    def test_human_trace_invariants_and_columns(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            root = Path(tmpdir)
            human_root = root / "human0_20260312_clean"
            episodes = human_root / "episodes"
            episodes.mkdir(parents=True)
            (human_root / "clean_summary.json").write_text(json.dumps({"tasks_total": 2, "tasks_with_trace": 1, "hover_only_tasks": 1}))

            traced = episodes / "task-a"
            traced.mkdir()
            (traced / "meta.json").write_text(
                json.dumps(
                    {
                        "task_id": "task-a",
                        "normalized_steps": 2,
                        "raw_steps": 3,
                        "duration_ms": 2500,
                        "hover_only": False,
                    }
                )
            )
            (traced / "trace.jsonl").write_text('{"type":"click"}\n{"type":"type"}\n')

            hover = episodes / "task-b"
            hover.mkdir()
            (hover / "meta.json").write_text(
                json.dumps(
                    {
                        "task_id": "task-b",
                        "normalized_steps": 0,
                        "raw_steps": 0,
                        "duration_ms": 0,
                        "hover_only": True,
                    }
                )
            )

            human_df, summary, issues = cbp.load_human(root)
            self.assertEqual(summary["tasks_total"], 2)
            self.assertEqual(len(human_df), 2)
            self.assertEqual(issues, [])
            traced_row = human_df[human_df["task_id"] == "task-a"].iloc[0]
            self.assertEqual(traced_row["human_steps"], 2)
            self.assertEqual(traced_row["human_trace_event_count"], 2)
            self.assertEqual(traced_row["human_step_unit"], "normalized_clean_trace_events")
            self.assertIn("normalized_steps from clean meta.json", traced_row["human_step_definition"])

    def test_human_trace_mismatch_is_reported(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            root = Path(tmpdir)
            traced = root / "human0_20260312_clean" / "episodes" / "task-a"
            traced.mkdir(parents=True)
            (root / "human0_20260312_clean" / "clean_summary.json").write_text(json.dumps({}))
            (traced / "meta.json").write_text(json.dumps({"task_id": "task-a", "normalized_steps": 3, "duration_ms": 1000}))
            (traced / "trace.jsonl").write_text('{"type":"click"}\n{"type":"type"}\n')
            _, _, issues = cbp.load_human(root)
            self.assertEqual(len(issues), 1)
            self.assertIn("Trace length mismatch", issues[0])


class TestOutputHelpers(unittest.TestCase):
    def test_save_csv_and_plot_write_expected_files(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            root = Path(tmpdir)
            csv_path = root / "tables" / "sample.csv"
            cbp.save_csv(pd.DataFrame([{"a": 1}]), csv_path)
            self.assertTrue(csv_path.exists())

            fig, ax = plt.subplots()
            ax.plot([0, 1], [0, 1])
            stem = root / "plots" / "sample_plot"
            cbp.save_plot(fig, stem)
            self.assertTrue(stem.with_suffix(".png").exists())
            self.assertTrue(stem.with_suffix(".svg").exists())
            self.assertTrue(stem.with_suffix(".pdf").exists())


if __name__ == "__main__":
    unittest.main(verbosity=2)
