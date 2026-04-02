"""
Type definitions for ComponentBench benchmark.

Dataclasses for tasks, results, and summaries.
"""
from __future__ import annotations

from dataclasses import dataclass, field, asdict
from typing import Optional, Any
import json


@dataclass
class ComponentBenchTask:
    """A single ComponentBench task loaded from YAML."""
    
    task_id: str                     # e.g., "button-antd-T01"
    name: str                       # Human-readable name
    canonical_type: str             # e.g., "button", "checkbox"
    implementation_source: str      # antd/mui/mantine
    browsergym_goal: str            # Goal text for the agent
    
    # Optional fields
    implementation_variant: Optional[str] = None
    implementation_component: Optional[str] = None
    task_template: Optional[str] = None
    secondary_template: Optional[str] = None
    ui_copy: Optional[str] = None
    setup_description: Optional[str] = None
    
    # Scene context
    scene_context: dict = field(default_factory=dict)
    
    # Difficulty
    difficulty_level: str = "medium"  # easy/medium/hard
    difficulty_tier: str = "L1"     # L0/L1/L2/L3
    axes_ratings: dict = field(default_factory=dict)
    difficulty_justification: Optional[str] = None
    
    # Success trigger (for reference, not used in validation)
    success_trigger: dict = field(default_factory=dict)
    
    # Family ID from ontology (populated by loader, not from YAML)
    family_id: Optional[str] = None  # e.g., "command_navigation", "data_entry"
    
    # Benchmark version (v1 or v2, set by the runner, not from YAML)
    benchmark_version: str = "v1"
    
    def to_dict(self) -> dict:
        """Convert to dictionary."""
        return asdict(self)
    
    @classmethod
    def from_yaml_dict(cls, data: dict) -> "ComponentBenchTask":
        """Create from a YAML task dictionary."""
        difficulty = data.get("difficulty", {})
        
        return cls(
            task_id=data.get("id", ""),
            name=data.get("name", ""),
            canonical_type=data.get("canonical_type", ""),
            implementation_source=data.get("implementation_source", ""),
            browsergym_goal=data.get("browsergym_goal", ""),
            implementation_variant=data.get("implementation_variant"),
            implementation_component=data.get("implementation_component"),
            task_template=data.get("task_template"),
            secondary_template=data.get("secondary_template"),
            ui_copy=data.get("ui_copy"),
            setup_description=data.get("setup_description"),
            scene_context=data.get("scene_context", {}),
            difficulty_level=difficulty.get("difficulty_bucket", "medium"),
            difficulty_tier=difficulty.get("tier", "L1"),
            axes_ratings=difficulty.get("axes_ratings", {}),
            difficulty_justification=difficulty.get("justification"),
            success_trigger=data.get("success_trigger", {}),
        )


@dataclass
class TaskResult:
    """Result of running a single task."""
    
    # Task identification
    task_id: str
    canonical_type: str
    implementation_source: str  # antd/mui/mantine
    mode: str     # ax_tree/som/pixel_grid/pixel (legacy: "webarena" -> "ax_tree")
    
    # Outcome
    success: bool
    reward: float
    steps: int
    termination_reason: str  # "success" | "max_steps" | "error"
    
    # Timing
    start_ts: str
    end_ts: str
    duration_seconds: float
    
    # Environment metadata
    hostname: str
    slurm_job_id: Optional[str] = None
    shard_id: int = 0
    num_shards: int = 1
    
    # Model metadata
    model_name: str = ""
    git_commit: str = ""
    
    # Run metadata (v0.3)
    run_id: str = ""
    pipeline_version: str = ""
    
    # Debug info
    error_message: Optional[str] = None
    exp_dir: Optional[str] = None
    
    # Additional task info
    difficulty_level: str = ""
    difficulty_tier: str = ""
    task_name: str = ""
    family_id: str = ""  # From ontology
    
    def to_dict(self) -> dict:
        """Convert to dictionary for JSON serialization."""
        return asdict(self)
    
    def to_jsonl(self) -> str:
        """Convert to JSONL line."""
        return json.dumps(self.to_dict(), default=str)
    
    @classmethod
    def from_dict(cls, data: dict) -> "TaskResult":
        """Create from dictionary."""
        return cls(**data)


@dataclass
class ModeSummary:
    """Summary statistics for a single mode."""
    
    mode: str
    total_tasks: int
    passed: int
    failed: int
    pass_rate: float
    avg_steps: float
    avg_duration_seconds: float
    
    # Breakdowns
    by_canonical_type: dict = field(default_factory=dict)
    by_library: dict = field(default_factory=dict)
    by_difficulty_level: dict = field(default_factory=dict)
    by_difficulty_tier: dict = field(default_factory=dict)
    by_family: dict = field(default_factory=dict)  # Added for family-based analysis


@dataclass
class BenchmarkSummary:
    """Overall benchmark summary."""
    
    # Run metadata
    run_id: str
    start_time: str
    end_time: str
    model_name: str
    git_commit: str
    
    # Sharding info
    shard_id: int
    num_shards: int
    
    # Overall stats
    total_tasks: int
    total_passed: int
    total_failed: int
    overall_pass_rate: float
    
    # Per-mode summaries
    mode_summaries: dict = field(default_factory=dict)  # mode -> ModeSummary
    
    def to_dict(self) -> dict:
        """Convert to dictionary for JSON serialization."""
        d = asdict(self)
        # Convert ModeSummary objects to dicts
        if self.mode_summaries:
            d["mode_summaries"] = {
                k: asdict(v) if isinstance(v, ModeSummary) else v
                for k, v in self.mode_summaries.items()
            }
        return d
