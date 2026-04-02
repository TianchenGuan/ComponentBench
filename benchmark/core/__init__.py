"""
ComponentBench v0.3 benchmark module.

Provides BrowserGym integration for running agents against the
ComponentBench Next.js site with 97 canonical component types.

v0.3: manifests, strict merges, resume safety, action contract fixes.
"""

from .types import ComponentBenchTask, TaskResult, BenchmarkSummary, ModeSummary
from .loader import (
    load_all_tasks,
    load_yaml_file,
    filter_tasks,
    shard_tasks,
    get_task_statistics,
    print_task_statistics,
    load_ontology_family_map,
    get_family_id,
    list_families,
)
from .task import (
    ComponentBenchBrowserTask,
    OBS_MODES,
    build_goal_string,
    get_action_instructions,
    normalize_mode,
    mode_display_name,
    MODE_ALIASES,
    MODE_DISPLAY_NAMES,
    VALID_MODES,
)
from .runner import (
    run_single_task,
    register_componentbench_task,
    save_results,
    append_result_jsonl,
    load_results_jsonl,
    write_summary_from_disk,
    compute_mode_summary,
    print_summary,
    load_completed_task_ids,
    get_git_commit,
    write_run_manifest,
    finalize_run_manifest,
    write_resume_manifest,
    PIPELINE_VERSION,
)

__all__ = [
    # Types
    "ComponentBenchTask",
    "TaskResult",
    "BenchmarkSummary",
    "ModeSummary",
    # Loader
    "load_all_tasks",
    "load_yaml_file",
    "filter_tasks",
    "shard_tasks",
    "get_task_statistics",
    "print_task_statistics",
    "load_ontology_family_map",
    "get_family_id",
    "list_families",
    # Task
    "ComponentBenchBrowserTask",
    "OBS_MODES",
    "build_goal_string",
    "get_action_instructions",
    "normalize_mode",
    "mode_display_name",
    "MODE_ALIASES",
    "MODE_DISPLAY_NAMES",
    "VALID_MODES",
    # Runner
    "run_single_task",
    "register_componentbench_task",
    "save_results",
    "compute_mode_summary",
    "print_summary",
    "load_completed_task_ids",
    "get_git_commit",
    "append_result_jsonl",
    "load_results_jsonl",
    "write_summary_from_disk",
    "write_run_manifest",
    "finalize_run_manifest",
    "write_resume_manifest",
    "PIPELINE_VERSION",
]
