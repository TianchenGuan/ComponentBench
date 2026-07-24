# Benchmark Versioning

ComponentBench ships two benchmark versions with clean separation between task definitions, UI rendering, and results:

- **v1 / Full** — 2,910 tasks, broad coverage (97 canonical types × 3 libraries, + 30 external markdown-editor tasks).
- **v2 / Core** — 912 newly generated hard-only tasks (19 generation units, 45 canonical components).

## How Version Switching Works

### URL Query Param

The active benchmark version on the site is controlled by the `bench` query parameter:

```
http://localhost:3002/?bench=v1      # default
http://localhost:3002/?bench=v2      # v2 tasks
```

The selected version is also persisted in `localStorage` under the key `componentbench_version`, so revisiting the site remembers the last-selected version. The header includes a **V1 / V2** toggle.

Task pages take the same parameter, e.g. `http://localhost:3002/task/<taskId>?mode=benchmark&bench=v2` — the harness appends it automatically when `--benchmark_version v2` is passed.

### What Changes Per Version

| Area | v1 | v2 |
|------|----|----|
| YAML source | `data/tasks_v1/` | `data/tasks_v2/` |
| Task index | `task-index-v1.json` | `task-index-v2.json` |
| API routes | `?bench=v1` (default) | `?bench=v2` |
| Harness flag | (default) | `--benchmark_version v2` |
| Human traces | `data/human_traces/v1_reference.jsonl` | `data/human_traces/v2_reference.jsonl` |

## YAML Directory Layout

### v1

```
data/tasks_v1/
  accordion.yaml        # one file per canonical type
  button.yaml
  ...
  (97 files, 30 tasks each = 2,910 total)
```

Each file is a YAML array of task objects. The `canonical_type` is inferred from the filename.

### v2

```
data/tasks_v2/
  01_markdown_code_json_editors_v2.yaml    # named by generation unit
  02_rich_text_editor_v2.yaml
  ...
  (19 files, 912 tasks total)
```

Each file is a YAML array of task objects. The `canonical_type` is explicit in each task record (not inferred from filename), since one file may contain tasks for multiple canonical types.

v2 tasks may also include:
- `implementation_source: external` (not just antd/mui/mantine)
- `component_context` section (overlay_model, internal_scroll_region, etc.)
- `design_intent` section (active_factors, factor_rationale)

All v2 tasks are hard-bucket (`difficulty_bucket: hard`, tier L2/L3) by construction.

## Running against a version

```bash
# v1 (default)
python scripts/run_benchmark.py --mode pixel --agent_config gpt --model_id gpt-5.4

# v2 / Core (auto-sets data_dir to data/tasks_v2 and adds &bench=v2 to task URLs)
python scripts/run_benchmark.py --benchmark_version v2 --mode pixel --agent_config gpt --model_id gpt-5.4
```

## Regenerating the site's task index

After editing any task YAML:

```bash
cd site
node scripts/generate-task-index.mjs
```

(`npm run dev` / `npm run build` do this automatically via the `predev` / `prebuild` hooks.)

## Validation

```bash
python scripts/validate-release.py --release-dir data
```

Checks both versions: YAML parse + schema conformance, unique task IDs, human-trace coverage, and no private fields.

## Site API Reference

All API routes accept an optional `bench` query parameter:

| Endpoint | Description |
|----------|-------------|
| `GET /api/tasks/index?bench=v2` | Task ID list for version |
| `GET /api/tasks/{canonicalType}?bench=v2` | Sanitized tasks for a canonical type in version |
| `GET /api/logs/runs?bench=v2` | List local runs filtered by version |
| `GET /api/logs/runs/{runId}?mode=...&bench=v2` | Run + episodes |
