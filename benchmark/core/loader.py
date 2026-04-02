"""
Task loader for ComponentBench v0.2.

Handles YAML parsing, filtering, and deterministic sharding.
Includes ontology parsing for family-based organization.
"""
from __future__ import annotations

import logging
import re
from collections import defaultdict
from pathlib import Path
from typing import Optional, Callable

import yaml

from .types import ComponentBenchTask

logger = logging.getLogger(__name__)


# Module-level cache for ontology data
_ONTOLOGY_FAMILY_MAP: dict[str, str] | None = None
_ONTOLOGY_FAMILIES: dict[str, str] | None = None  # id -> display name


def load_ontology_family_map(ontology_path: Path | None = None) -> tuple[dict[str, str], dict[str, str]]:
    """Load canonical_type -> family_id mapping from ontology.ts.
    
    Parses the TypeScript ontology file to extract:
    1. Family definitions (id -> display name)
    2. Component type to family mappings
    
    The ontology file contains:
    - families array: { id: 'command_navigation', name: 'Command & Navigation', ... }
    - canonicalComponents array: { type: 'button', ..., familyId: 'command_navigation', ... }
    
    Args:
        ontology_path: Optional path to ontology.ts. If None, uses default location.
        
    Returns:
        (type_to_family, family_names) where:
        - type_to_family: {"button": "command_navigation", "slider": "data_entry", ...}
        - family_names: {"command_navigation": "Command & Navigation", ...}
    """
    global _ONTOLOGY_FAMILY_MAP, _ONTOLOGY_FAMILIES
    
    # Return cached values if available
    if _ONTOLOGY_FAMILY_MAP is not None and _ONTOLOGY_FAMILIES is not None:
        return _ONTOLOGY_FAMILY_MAP, _ONTOLOGY_FAMILIES
    
    # Determine ontology path
    if ontology_path is None:
        # Default: site/src/ontology/ontology.ts relative to repo root
        ontology_path = Path(__file__).parent.parent.parent / "site/src/ontology/ontology.ts"
    
    if not ontology_path.exists():
        logger.warning(f"Ontology file not found: {ontology_path}")
        _ONTOLOGY_FAMILY_MAP = {}
        _ONTOLOGY_FAMILIES = {}
        return _ONTOLOGY_FAMILY_MAP, _ONTOLOGY_FAMILIES
    
    content = ontology_path.read_text(encoding="utf-8")
    
    # Parse families: { id: 'command_navigation', name: 'Command & Navigation', order: 1 }
    # More flexible pattern to handle variations in whitespace and property order
    family_pattern = r"\{\s*id:\s*['\"]([^'\"]+)['\"][^}]*name:\s*['\"]([^'\"]+)['\"]"
    _ONTOLOGY_FAMILIES = {}
    for m in re.finditer(family_pattern, content, re.DOTALL):
        _ONTOLOGY_FAMILIES[m.group(1)] = m.group(2)
    
    logger.debug(f"Parsed {len(_ONTOLOGY_FAMILIES)} families from ontology")
    
    # Parse components: { type: 'button', ..., familyId: 'command_navigation', ... }
    # Handle multiline entries with flexible matching
    component_pattern = r"\{\s*type:\s*['\"]([^'\"]+)['\"][^}]*familyId:\s*['\"]([^'\"]+)['\"]"
    _ONTOLOGY_FAMILY_MAP = {}
    for m in re.finditer(component_pattern, content, re.DOTALL):
        _ONTOLOGY_FAMILY_MAP[m.group(1)] = m.group(2)
    
    logger.debug(f"Parsed {len(_ONTOLOGY_FAMILY_MAP)} component->family mappings from ontology")
    
    return _ONTOLOGY_FAMILY_MAP, _ONTOLOGY_FAMILIES


def get_family_id(canonical_type: str) -> str | None:
    """Get the family ID for a canonical type.
    
    Args:
        canonical_type: The canonical component type (e.g., "button")
        
    Returns:
        Family ID (e.g., "command_navigation") or None if not found
    """
    type_to_family, _ = load_ontology_family_map()
    return type_to_family.get(canonical_type)


def list_families() -> dict[str, str]:
    """List all available families.
    
    Returns:
        Dictionary of family_id -> display_name
    """
    _, family_names = load_ontology_family_map()
    return family_names


# Fields that may have values containing colons (require preprocessing)
FIELDS_WITH_COLONS = {
    "expected_interaction_path",
    "notes",
    "justification",
    "setup_description",
    "browsergym_goal",
    "ui_copy",
}


def preprocess_yaml_content(content: str) -> str:
    """Preprocess YAML content to handle unquoted values with colons.
    
    The YAML files in data/tasks_v1/ have some fields with values
    containing colons that aren't properly quoted. This matches the
    preprocessing done in the Next.js API route.
    
    Args:
        content: Raw YAML content
        
    Returns:
        Preprocessed YAML content with problematic values quoted
    """
    lines = content.split('\n')
    processed_lines = []
    i = 0
    
    # Pattern to match field lines that might need quoting
    field_pattern = re.compile(
        r'^(  )(expected_interaction_path|notes|justification|setup_description|browsergym_goal|ui_copy):\s+(.*)$'
    )
    
    while i < len(lines):
        line = lines[i]
        
        match = field_pattern.match(line)
        if match:
            indent, key, value = match.groups()
            
            # Check if value is already properly quoted or uses block scalar
            if value.startswith("'") or value.startswith('"') or value.startswith('|') or value.startswith('>'):
                processed_lines.append(line)
                i += 1
                continue
            
            # Collect continuation lines
            full_value = value
            while i + 1 < len(lines):
                next_line = lines[i + 1]
                # Continuation line: starts with 4+ spaces, doesn't look like a key
                if re.match(r'^    +[^-\s]', next_line) and not re.match(r'^    +[\w_-]+:\s', next_line):
                    full_value += ' ' + next_line.strip()
                    i += 1
                else:
                    break
            
            # Quote the full value if it contains special characters
            if ':' in full_value or '#' in full_value or "'" in full_value:
                escaped_value = full_value.replace('"', '\\"')
                processed_lines.append(f'{indent}{key}: "{escaped_value}"')
            else:
                processed_lines.append(f'{indent}{key}: {full_value}')
        else:
            processed_lines.append(line)
        i += 1
    
    return '\n'.join(processed_lines)


def load_yaml_file(yaml_path: Path) -> list[ComponentBenchTask]:
    """Load tasks from a single YAML file.
    
    Args:
        yaml_path: Path to YAML file (e.g., data/tasks_v1/button.yaml)
        
    Returns:
        List of ComponentBenchTask objects
    """
    with open(yaml_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Preprocess to handle values with colons
    content = preprocess_yaml_content(content)
    
    data = yaml.safe_load(content)
    
    if not isinstance(data, list):
        logger.warning(f"Expected list in {yaml_path}, got {type(data)}")
        return []
    
    tasks = []
    for item in data:
        try:
            task = ComponentBenchTask.from_yaml_dict(item)
            if task.task_id and task.browsergym_goal:
                tasks.append(task)
            else:
                logger.warning(f"Skipping task with missing id or goal in {yaml_path}")
        except Exception as e:
            logger.warning(f"Failed to parse task in {yaml_path}: {e}")
    
    return tasks


def load_all_tasks(data_dir: str | Path, populate_family: bool = True) -> list[ComponentBenchTask]:
    """Load all tasks from YAML files in the data directory.
    
    Args:
        data_dir: Path to data directory (e.g., data/tasks_v1)
        populate_family: If True, populate family_id from ontology
        
    Returns:
        List of all ComponentBenchTask objects, sorted deterministically
    """
    data_path = Path(data_dir)
    if not data_path.exists():
        raise FileNotFoundError(f"Data directory not found: {data_path}")
    
    all_tasks = []
    yaml_files = sorted(data_path.glob("*.yaml"))
    
    logger.info(f"Loading tasks from {len(yaml_files)} YAML files in {data_path}")
    
    for yaml_file in yaml_files:
        tasks = load_yaml_file(yaml_file)
        all_tasks.extend(tasks)
        logger.debug(f"  {yaml_file.name}: {len(tasks)} tasks")
    
    # v0.3: Normalize difficulty labels (mid -> medium)
    DIFFICULTY_REMAP = {"mid": "medium"}
    VALID_BUCKETS = {"easy", "medium", "hard"}
    remap_count = 0
    for task in all_tasks:
        if task.difficulty_level in DIFFICULTY_REMAP:
            task.difficulty_level = DIFFICULTY_REMAP[task.difficulty_level]
            remap_count += 1
    if remap_count > 0:
        logger.warning(f"Normalized {remap_count} difficulty labels (mid -> medium)")
    # Validate after normalization
    invalid_buckets = set(t.difficulty_level for t in all_tasks) - VALID_BUCKETS
    if invalid_buckets:
        logger.warning(f"Unexpected difficulty buckets after normalization: {invalid_buckets}")
    
    # Populate family_id from ontology
    if populate_family:
        type_to_family, _ = load_ontology_family_map()
        for task in all_tasks:
            task.family_id = type_to_family.get(task.canonical_type)
        
        # Log family coverage
        with_family = sum(1 for t in all_tasks if t.family_id)
        logger.info(f"Family ID populated for {with_family}/{len(all_tasks)} tasks")
    
    # Sort deterministically by (canonical_type, implementation_source, id)
    all_tasks.sort(key=lambda t: (t.canonical_type, t.implementation_source, t.task_id))
    
    logger.info(f"Loaded {len(all_tasks)} total tasks")
    return all_tasks


def filter_tasks(
    tasks: list[ComponentBenchTask],
    canonical_types: Optional[list[str]] = None,
    libraries: Optional[list[str]] = None,
    difficulty_tiers: Optional[list[str]] = None,
    difficulty_buckets: Optional[list[str]] = None,
    task_ids: Optional[list[str]] = None,
    families: Optional[list[str]] = None,
    max_tasks: Optional[int] = None,
) -> list[ComponentBenchTask]:
    """Filter tasks by various criteria.
    
    Args:
        tasks: List of tasks to filter
        canonical_types: Filter by canonical type (e.g., ["button", "checkbox"])
        libraries: Filter by library (e.g., ["antd", "mui"])
        difficulty_tiers: Filter by tier (e.g., ["L0", "L1"])
        difficulty_buckets: Filter by bucket (e.g., ["easy", "mid"])
        task_ids: Filter by specific task IDs
        families: Filter by family ID (e.g., ["command_navigation", "data_entry"])
        max_tasks: Maximum number of tasks to return
        
    Returns:
        Filtered list of tasks
        
    Raises:
        ValueError: If invalid family IDs are provided
    """
    filtered = tasks
    
    if canonical_types:
        canonical_types_set = set(canonical_types)
        filtered = [t for t in filtered if t.canonical_type in canonical_types_set]
        logger.info(f"After canonical_types filter: {len(filtered)} tasks")
    
    if libraries:
        libraries_set = set(libraries)
        filtered = [t for t in filtered if t.implementation_source in libraries_set]
        logger.info(f"After libraries filter: {len(filtered)} tasks")
    
    if difficulty_tiers:
        tiers_set = set(difficulty_tiers)
        filtered = [t for t in filtered if t.difficulty_tier in tiers_set]
        logger.info(f"After difficulty_tiers filter: {len(filtered)} tasks")
    
    if difficulty_buckets:
        buckets_set = set(difficulty_buckets)
        filtered = [t for t in filtered if t.difficulty_level in buckets_set]
        logger.info(f"After difficulty_buckets filter: {len(filtered)} tasks")
    
    if task_ids:
        task_ids_set = set(task_ids)
        filtered = [t for t in filtered if t.task_id in task_ids_set]
        logger.info(f"After task_ids filter: {len(filtered)} tasks")
    
    if families:
        # Validate family IDs
        _, valid_families = load_ontology_family_map()
        invalid = set(families) - set(valid_families.keys())
        if invalid:
            raise ValueError(
                f"Invalid family IDs: {sorted(invalid)}. "
                f"Valid families: {sorted(valid_families.keys())}"
            )
        
        families_set = set(families)
        filtered = [t for t in filtered if t.family_id in families_set]
        logger.info(f"After families filter: {len(filtered)} tasks")
    
    if max_tasks is not None and max_tasks > 0:
        filtered = filtered[:max_tasks]
        logger.info(f"After max_tasks limit: {len(filtered)} tasks")
    
    return filtered


def shard_tasks(
    tasks: list[ComponentBenchTask],
    shard_id: int,
    num_shards: int,
    strategy: str = "stride",
) -> tuple[list[ComponentBenchTask], dict]:
    """Shard tasks with different strategies.
    
    Strategies:
    - stride: tasks[shard_id::num_shards] (current behavior, round-robin)
    - canonical_type: group by canonical_type, assign groups to shards
    - family: group by family_id, assign groups to shards
    
    For group-based strategies (canonical_type, family), uses balanced greedy
    bin packing: sorts groups by size descending, assigns each to the shard
    with the smallest current count.
    
    Args:
        tasks: List of tasks (should be pre-sorted)
        shard_id: Current shard ID (0-indexed)
        num_shards: Total number of shards
        strategy: Sharding strategy ("stride", "canonical_type", or "family")
        
    Returns:
        (sharded_tasks, shard_plan) where shard_plan contains metadata about
        the sharding decision
        
    Raises:
        ValueError: If invalid shard_id or strategy
    """
    if num_shards <= 1:
        return tasks, {
            "strategy": strategy,
            "num_shards": 1,
            "shard_id": 0,
            "total_tasks": len(tasks),
        }
    
    if shard_id < 0 or shard_id >= num_shards:
        raise ValueError(f"Invalid shard_id {shard_id} for num_shards {num_shards}")
    
    if strategy == "stride":
        return _shard_stride(tasks, shard_id, num_shards)
    elif strategy == "canonical_type":
        return _shard_by_group(tasks, shard_id, num_shards, 
                               key=lambda t: t.canonical_type,
                               group_name="canonical_type")
    elif strategy == "family":
        return _shard_by_group(tasks, shard_id, num_shards,
                               key=lambda t: t.family_id or "unknown",
                               group_name="family")
    else:
        raise ValueError(f"Invalid strategy: {strategy}. Use stride, canonical_type, or family.")


def _shard_stride(
    tasks: list[ComponentBenchTask],
    shard_id: int,
    num_shards: int,
) -> tuple[list[ComponentBenchTask], dict]:
    """Stride-based sharding: tasks[shard_id::num_shards]."""
    sharded = tasks[shard_id::num_shards]
    
    shard_plan = {
        "strategy": "stride",
        "num_shards": num_shards,
        "shard_id": shard_id,
        "total_tasks": len(tasks),
        "shard_tasks": len(sharded),
        "counts": {i: len(tasks[i::num_shards]) for i in range(num_shards)},
    }
    
    logger.info(f"Shard {shard_id}/{num_shards} (stride): {len(sharded)} tasks (from {len(tasks)} total)")
    return sharded, shard_plan


def _shard_by_group(
    tasks: list[ComponentBenchTask],
    shard_id: int,
    num_shards: int,
    key: Callable[[ComponentBenchTask], str],
    group_name: str,
) -> tuple[list[ComponentBenchTask], dict]:
    """Balanced sharding by grouping tasks.
    
    Groups tasks by the key function, then uses greedy bin packing to
    distribute groups evenly across shards.
    """
    # Group tasks
    groups: dict[str, list[ComponentBenchTask]] = defaultdict(list)
    for task in tasks:
        groups[key(task)].append(task)
    
    # Sort groups by (-count, group_id) for determinism
    sorted_groups = sorted(groups.items(), key=lambda x: (-len(x[1]), x[0]))
    
    # Greedy bin packing: assign each group to shard with smallest count
    shard_counts = [0] * num_shards
    shard_assignments: dict[int, list[str]] = defaultdict(list)  # shard_id -> [group_ids]
    
    for group_id, group_tasks in sorted_groups:
        # Find shard with smallest count (tie-break by lowest shard_id)
        target_shard = min(range(num_shards), key=lambda s: (shard_counts[s], s))
        shard_assignments[target_shard].append(group_id)
        shard_counts[target_shard] += len(group_tasks)
    
    # Collect tasks for this shard
    sharded = []
    for group_id in shard_assignments[shard_id]:
        sharded.extend(groups[group_id])
    
    # Sort for determinism
    sharded.sort(key=lambda t: (t.canonical_type, t.implementation_source, t.task_id))
    
    shard_plan = {
        "strategy": group_name,
        "num_shards": num_shards,
        "shard_id": shard_id,
        "total_tasks": len(tasks),
        "shard_tasks": len(sharded),
        "assignments": {k: sorted(v) for k, v in shard_assignments.items()},
        "counts": {i: shard_counts[i] for i in range(num_shards)},
        "groups_per_shard": {i: len(shard_assignments[i]) for i in range(num_shards)},
    }
    
    assigned_groups = shard_assignments[shard_id]
    logger.info(
        f"Shard {shard_id}/{num_shards} ({group_name}): {len(sharded)} tasks "
        f"from {len(assigned_groups)} groups: {assigned_groups[:5]}{'...' if len(assigned_groups) > 5 else ''}"
    )
    
    return sharded, shard_plan


def get_task_statistics(tasks: list[ComponentBenchTask]) -> dict:
    """Get statistics about a list of tasks.
    
    Args:
        tasks: List of tasks
        
    Returns:
        Dictionary with task statistics
    """
    stats = {
        "total": len(tasks),
        "by_canonical_type": {},
        "by_library": {},
        "by_difficulty_level": {},
        "by_difficulty_tier": {},
        "by_family": {},
    }
    
    for task in tasks:
        # Count by canonical_type
        ct = task.canonical_type
        stats["by_canonical_type"][ct] = stats["by_canonical_type"].get(ct, 0) + 1
        
        # Count by library
        lib = task.implementation_source
        stats["by_library"][lib] = stats["by_library"].get(lib, 0) + 1
        
        # Count by difficulty_level
        bucket = task.difficulty_level
        stats["by_difficulty_level"][bucket] = stats["by_difficulty_level"].get(bucket, 0) + 1
        
        # Count by difficulty_tier
        tier = task.difficulty_tier
        stats["by_difficulty_tier"][tier] = stats["by_difficulty_tier"].get(tier, 0) + 1
        
        # Count by family
        family = task.family_id or "unknown"
        stats["by_family"][family] = stats["by_family"].get(family, 0) + 1
    
    # Sort by count descending
    stats["by_canonical_type"] = dict(
        sorted(stats["by_canonical_type"].items(), key=lambda x: -x[1])
    )
    stats["by_family"] = dict(
        sorted(stats["by_family"].items(), key=lambda x: -x[1])
    )
    
    return stats


def print_task_statistics(tasks: list[ComponentBenchTask], title: str = "Task Statistics"):
    """Print task statistics to logger.
    
    Args:
        tasks: List of tasks
        title: Title for the statistics block
    """
    stats = get_task_statistics(tasks)
    
    print(f"\n{'=' * 60}")
    print(f"{title}")
    print(f"{'=' * 60}")
    print(f"Total tasks: {stats['total']}")
    
    print(f"\nBy library:")
    for lib, count in sorted(stats["by_library"].items()):
        print(f"  {lib}: {count}")
    
    print(f"\nBy difficulty level:")
    for bucket, count in sorted(stats["by_difficulty_level"].items()):
        print(f"  {bucket}: {count}")
    
    print(f"\nBy difficulty tier:")
    for tier, count in sorted(stats["by_difficulty_tier"].items()):
        print(f"  {tier}: {count}")
    
    print(f"\nBy family ({len(stats['by_family'])} families):")
    for family, count in list(stats["by_family"].items()):
        print(f"  {family}: {count}")
    
    print(f"\nBy canonical type ({len(stats['by_canonical_type'])} types):")
    for ct, count in list(stats["by_canonical_type"].items())[:10]:
        print(f"  {ct}: {count}")
    if len(stats["by_canonical_type"]) > 10:
        print(f"  ... and {len(stats['by_canonical_type']) - 10} more types")
    
    print(f"{'=' * 60}\n")
