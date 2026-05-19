# Data Format

This file documents the on-disk shape of a release under `data/releases/<version>/`. The authoritative JSON Schemas live in `schema/`.

## Directory layout

```
data/releases/<version>/
├── tasks_v1/                # 97 YAMLs (Full benchmark, 2,910 tasks)
│   ├── accordion.yaml
│   ├── button.yaml
│   ├── ...
├── tasks_v2/                # 19 YAMLs (Core benchmark, 912 tasks)
│   ├── 01_activate.yaml
│   ├── 02_select_value.yaml
│   ├── ...
├── human_traces/            # cleaned reference trajectories
│   ├── v1_reference.jsonl
│   ├── v2_reference.jsonl
│   ├── v1/                  # per-task JSONL recordings
│   └── v2/
└── metadata/
    ├── canonical_components.csv
    ├── difficulty_axes.csv
    └── task_templates.csv
```

## tasks_v{1,2}/

One YAML file per canonical type (v1) or task template (v2). Each file is a YAML list of task records. Schema: `schema/task.schema.json`.

Sample (abbreviated):

```yaml
- id: button-antd-T01
  name: Generate report (primary button click)
  canonical_type: button
  implementation_source: antd
  implementation_component: 'AntD: Button'
  task_template: activate
  browsergym_goal: Click the "Generate report" button in the Report card. ...
  scene_context:
    theme: light
    spacing: comfortable
    layout: isolated_card
    placement: center
    scale: default
    instances: 1
    guidance: text
    clutter: none
  difficulty:
    difficulty_bucket: easy
    tier: L0
    axes_ratings: { precision_requirement: 1, target_acquisition: 1, ... }
  success_trigger:
    human_readable: [...]
    canonical_predicate:
      predicate_type: equals
      target_state: { event: button_clicked }
```

### Task ID convention

`<canonical_type>-<library>-T<NN>`, e.g. `accordion-antd-T01`, `data_grid_editable-mui-T07`. IDs are **stable across releases** — a task does not change identity if its scene_context changes.

### Public vs full spec

The TaskSpec contains answer-key fields (`success_trigger.canonical_predicate.target_state`, `negative_cases`, etc.) that the agent must not see. The benchmark site's `/api/tasks/[canonicalType]` route returns a **sanitized PublicTaskSpec** that strips these. The YAML on disk is the full spec — keep it server-side.

## human_traces/

`v1_reference.jsonl` and `v2_reference.jsonl` provide one JSON object per task with summary statistics for the cleaned best trace:

```json
{
  "task_id": "button-antd-T01",
  "normalized_steps": 1,
  "raw_steps": 1,
  "duration_ms": 1842,
  "viewport": { "width": 1280, "height": 768 }
}
```

The per-step recordings are under `v1/` and `v2/` subdirectories as JSONL (one task per file), schema: `schema/trace.schema.json`.

**Typing normalization** is critical: human recorders type one character at a time, agents typically paste in one step. Without normalization, step counts are not comparable.

## metadata/

CSV reference tables.

- `canonical_components.csv` — 97 component types × family + role + library availability.
- `difficulty_axes.csv` — definitions of the 7 difficulty axes.
- `task_templates.csv` — 24 task templates and what each generates.

These are human-curated and stable; refer to them when interpreting task properties.

## Versioning

Releases are pinned: `data/releases/0.5.0/` is immutable once tagged. New benchmark versions or fix-ups land under `data/releases/<next-version>/`. Always include the release version in published result filenames.

## Validation

```bash
python scripts/validate-release.py --version 0.5.0
```

This script verifies:
1. All YAMLs parse and conform to `schema/task.schema.json`.
2. Task IDs are unique within a version.
3. `human_traces/v{1,2}_reference.jsonl` covers all task IDs.
4. No private fields (`debug`, `internal_notes`, `tasklab_*`) appear in YAMLs.
