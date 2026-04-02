# Benchmark Versioning

ComponentBench supports multiple benchmark versions (v1, v2, ...) with clean separation between task definitions, UI rendering, log storage, and data upload.

## How Version Switching Works

### URL Query Param

The active benchmark version is controlled by the `bench` query parameter:

```
https://componentbench.example.com/?bench=v1      # default
https://componentbench.example.com/?bench=v2      # v2 tasks
https://componentbench.example.com/?mode=log&bench=v2  # v2 logs
```

The selected version is also persisted in `localStorage` under the key `componentbench_version`, so revisiting the site remembers the last-selected version.

### UI Toggle

The header includes a **V1 / V2** toggle. Clicking it updates both the URL and localStorage, then reloads the page content.

### What Changes Per Version

| Area | v1 | v2 |
|------|----|----|
| YAML source | `data/tasks_v1/` | `data/tasks_v2/` |
| Task index | `task-index-v1.json` | `task-index-v2.json` |
| API routes | `?bench=v1` (default) | `?bench=v2` |
| Supabase | `benchmark_version IS NULL OR = 'v1'` | `benchmark_version = 'v2'` |
| Blob namespace | `componentbench/runs/...` | `componentbench-v2/runs/...` |
| Log viewer | Filters runs by version | Filters runs by version |

## YAML Directory Layout

### v1 (existing)

```
data/tasks_v1/
  accordion.yaml        # one file per canonical type
  button.yaml
  ...
  (97 files, 30 tasks each = 2910 total)
```

Each file is a YAML array of task objects. The `canonical_type` is inferred from the filename.

### v2

```
data/tasks_v2/
  01_markdown_code_json_editors.yaml    # named by generation unit
  02_rich_text_editor_v2_tasks.yaml
  ...
```

Each file is a YAML array of task objects. The `canonical_type` is explicit in each task record (not inferred from filename), since one file may contain tasks for multiple canonical types.

v2 tasks may also include:
- `implementation_source: external` (not just antd/mui/mantine)
- `component_context` section (overlay_model, internal_scroll_region, etc.)
- `design_intent` section (active_factors, factor_rationale)

## How to Add a New v2 Unit

1. **Create the YAML**: Place a `.yaml` file in `data/tasks_v2/`. Name it by unit (e.g., `06_single_select_family_v2.yaml`).

2. **Ensure each task has `canonical_type`**: Unlike v1, the filename doesn't determine the canonical type. Each task must have an explicit `canonical_type` field.

3. **Regenerate the index**:
   ```bash
   cd site
   node scripts/generate-task-index.mjs
   ```

4. **Validate the YAML**:
   ```bash
   python3 scripts/validate_v2_yamls.py
   ```

5. **Build and test**:
   ```bash
   cd site
   npm run build
   npm run dev
   # Visit http://localhost:3002/?bench=v2
   ```

## Upload / Indexing Namespaces

### Blob Storage

v2 uploads use a separate namespace prefix:

```bash
# v1 (existing, unchanged)
python3 scripts/logpack/upload_run.py --packed-dir /path/to/packed --namespace componentbench

# v2
python3 scripts/logpack/upload_run.py --packed-dir /path/to/packed --benchmark-version v2
# This auto-sets namespace to 'componentbench-v2'
```

Blob key layout:
- v1: `componentbench/runs/{run_id}/{mode}/{task_id}/episode.json`
- v2: `componentbench-v2/runs/{run_id}/{mode}/{task_id}/episode.json`

### Supabase

The `runs` table has a `benchmark_version` column (added in migration `0002_benchmark_version.sql`):

- Existing v1 rows: `benchmark_version IS NULL` (treated as v1)
- New v1 uploads: `benchmark_version = 'v1'`
- v2 uploads: `benchmark_version = 'v2'`

The unique constraint includes `benchmark_version`, so v1 and v2 runs with the same run_id can coexist.

To apply the migration:
```sql
-- Run this against your Supabase instance
ALTER TABLE runs ADD COLUMN IF NOT EXISTS benchmark_version text;
CREATE INDEX IF NOT EXISTS runs_benchmark_version_idx ON runs (benchmark_version);
DROP INDEX IF EXISTS runs_identity_idx;
CREATE UNIQUE INDEX runs_identity_idx
  ON runs (benchmark, run_id_text, mode, model_name, agent_name, COALESCE(benchmark_version, 'v1'));
```

## API Reference

All API routes accept an optional `bench` query parameter:

| Endpoint | Description |
|----------|-------------|
| `GET /api/tasks/index?bench=v2` | Task ID list for version |
| `GET /api/tasks/{canonicalType}?bench=v2` | Tasks for a canonical type in version |
| `GET /api/logs/runs?bench=v2` | List runs filtered by version |
| `GET /api/logs/runs/{runId}?mode=...&bench=v2` | Run + episodes |

## v2 YAML Validation

Run the validator to check v2 YAMLs for metadata issues:

```bash
python3 scripts/validate_v2_yamls.py
python3 scripts/validate_v2_yamls.py --json  # machine-readable output
```

The validator checks:
- `design_intent.active_factors` only contains valid factors (not difficulty axes)
- `difficulty.difficulty_bucket` is `hard`
- `difficulty.tier` is `L2` or `L3`
- Required fields are present (`id`, `name`, `canonical_type`, `browsergym_goal`)
- `scene_context` keys are present
