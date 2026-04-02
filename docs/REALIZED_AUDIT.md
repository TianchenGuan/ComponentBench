# ComponentBench Realized Audit

Post-implementation structural audit for ComponentBench tasks.  
CPU-only, Playwright-based, no agent or LLM involved.

## What It Does

For every task page, the audit:

1. Loads the page in headless Chromium (`?mode=benchmark`)
2. Measures DOM/ARIA-level signals: interactive element count, role distribution, target sizes, label duplicates, scroll depth, obvious shortcuts
3. Optionally clicks one "reveal probe" to check hidden popups/menus
4. Compares measured signals against intended difficulty metadata from YAML
5. Flags tasks where intended and realized complexity disagree

The goal is to detect:
- Tasks intended to be hard but implemented trivially (large targets, single obvious control)
- Tasks intended to be easy but with unexpectedly complex rendered UIs
- Missing or broken page renders

## How to Run

### Local Smoke Test

```bash
# Start the site
cd site && npm run build && PORT=3002 npm run start &

# Run audit on 5 tasks
python scripts/run_componentbench_realized_audit.py \
    --max_tasks 5 \
    --base_url http://127.0.0.1:3002 \
    --output_dir /tmp/audit_smoke \
    --concurrency 2
```

### Dry Run (No Browser)

```bash
python scripts/run_componentbench_realized_audit.py --dry_run
python scripts/run_componentbench_realized_audit.py --dry_run --families command_navigation
```

### Interactive Compute Node (salloc)

```bash
salloc --partition=compsci --cpus-per-task=16 --mem=32G --time=02:00:00

# Inside the allocation, build site in xtmp and run
# (the Slurm script automates this, but for manual runs:)
export PLAYWRIGHT_BROWSERS_PATH=/usr/project/xtmp/$USER/playwright-browsers
python scripts/run_componentbench_realized_audit.py \
    --base_url http://127.0.0.1:3002 \
    --output_dir /usr/project/xtmp/$USER/componentbench-results/componentbench_realized_audit/manual_run \
    --concurrency 8 \
    --probe_mode generic
```

### Submit via Slurm (Automated)

```bash
# Single job (all 2910 tasks)
sbatch scripts/run_componentbench_realized_audit_slurm.sh

# 2-shard array job
sbatch --array=0-1 --export=ALL,NUM_SHARDS=2 scripts/run_componentbench_realized_audit_slurm.sh

# With custom settings
CONCURRENCY=12 PROBE_MODE=generic AUDIT_MAX_TASKS=100 \
    sbatch scripts/run_componentbench_realized_audit_slurm.sh

# Polite submitter (auto-detects node availability)
bash scripts/submit_componentbench_realized_audit.sh
bash scripts/submit_componentbench_realized_audit.sh --dry_run
```

### Merge Shards

```bash
python scripts/merge_componentbench_realized_audit_shards.py \
    --input_dir /usr/project/xtmp/$USER/componentbench-results/componentbench_realized_audit/<RUN_ID>/ \
    --output_dir /usr/project/xtmp/$USER/componentbench-results/componentbench_realized_audit/<RUN_ID>/merged
```

### Run Smoke Tests

```bash
# Offline (no browser needed, tests data flow)
python scripts/test_realized_audit_smoke.py --offline

# Full (needs site running on localhost:3002)
python scripts/test_realized_audit_smoke.py --base_url http://127.0.0.1:3002
```

## CLI Options

| Flag | Default | Description |
|------|---------|-------------|
| `--base_url` | `http://127.0.0.1:3002` | Site URL |
| `--data_dir` | `data/tasks_v1` | YAML task directory |
| `--canonical_types` | all | Comma-separated filter |
| `--libraries` | all | antd,mui,mantine |
| `--families` | all | Family ID filter |
| `--difficulty_tiers` | all | L0,L1,L2,L3 |
| `--difficulty_buckets` | all | easy,medium,hard |
| `--task_ids` | all | Specific task IDs |
| `--max_tasks` | unlimited | Cap task count |
| `--shard_id` | 0 | Shard index |
| `--num_shards` | 1 | Total shards |
| `--shard_strategy` | stride | stride/canonical_type/family |
| `--output_dir` | auto | Results directory |
| `--resume` | off | Skip already-audited tasks |
| `--dry_run` | off | Print counts and exit |
| `--concurrency` | auto | Worker process count |
| `--probe_mode` | off | off or generic |
| `--timeout_seconds` | 15 | Per-page timeout |
| `--save_flagged_artifacts` | on | Screenshots for flagged tasks |
| `--save_all_screenshots` | off | Screenshot every task |
| `--headless` | on | Headless browser |
| `--list_families` | off | Print families and exit |
| `--verbose` | off | Debug logging |

## Output Schema

### audit_rows.jsonl

Each line is a JSON object:

```json
{
  "task_id": "button-antd-T01",
  "canonical_type": "button",
  "implementation_source": "antd",
  "family_id": "command_navigation",
  "task_template": "activate",

  "intended": {
    "difficulty_bucket": "easy",
    "difficulty_tier": "L0",
    "axes_ratings": {
      "precision_requirement": 1,
      "target_acquisition": 1,
      "density_choice_interference": 1,
      "depth_layering": 1,
      "feedback_dynamics": 2,
      "semantic_observability": 1,
      "disambiguation_load": 1
    },
    "scene_context": {
      "theme": "light",
      "spacing": "comfortable",
      "layout": "isolated_card",
      "placement": "center",
      "scale": "default",
      "instances": 1,
      "guidance": "text",
      "clutter": "none"
    },
    "difficulty_justification": "Single large labeled button..."
  },

  "realized": {
    "page_loaded": true,
    "load_ms": 342,
    "js_error_count": 0,
    "dom_node_count": 47,
    "visible_interactive_count": 3,
    "role_counts": {"button": 2, "link": 1, ...},
    "visible_text_chars": 120,
    "icon_only_interactive_count": 0,
    "duplicate_accessible_label_count": 0,
    "document_height_px": 600,
    "viewport_height_px": 720,
    "scroll_required": false,
    "small_target_count_lt44": 0,
    "tiny_target_count_lt24": 0,
    "min_target_area_px2": 1200.0,
    "median_target_area_px2": 2400.0,
    "tight_neighbor_pairs_lt12px": 0,
    "obvious_shortcuts": {
      "search_input": false,
      "filter_input": false,
      "number_input": false,
      "direct_text_input": false
    },
    "goal_text_probe": {
      "quoted_phrases": ["Generate report"],
      "visible_match_count": 1,
      "unique_match": true
    },
    "probe": {
      "mode": "off",
      "attempted": false,
      "clicked": false,
      "reason": null,
      "post_probe_dialog_count": 0,
      "post_probe_option_count": 0,
      "post_probe_treeitem_count": 0,
      "post_probe_menuitem_count": 0
    }
  },

  "mismatch_flags": [],
  "artifact_paths": {"screenshot": null}
}
```

### Companion Files

| File | Description |
|------|-------------|
| `run_manifest.json` | Run metadata (pipeline, run_id, git commit, timestamps) |
| `audit_summary.json` | Aggregate counts by type/library/family/bucket + distributions |
| `mismatch_counts.json` | Flag name → count |
| `flagged_tasks.csv` | Flagged tasks with their flags |
| `errors.jsonl` | Per-task errors (browser failures, timeouts) |
| `screenshots/` | PNG screenshots for flagged/error tasks (if enabled) |

## Mismatch Flags

| Flag | When Fired | Threshold |
|------|-----------|-----------|
| `PAGE_RENDER_FAILURE` | Page didn't load | `page_loaded == false` |
| `JS_ERROR_ON_LOAD` | JavaScript errors detected | `js_error_count > 0` |
| `INTENDED_HIGH_PRECISION_BUT_LARGE_TARGETS_ONLY` | Axes says high precision needed, but all targets are large | `precision_requirement >= 3` and `min_target_area >= 2000px²` |
| `INTENDED_LOW_PRECISION_BUT_MANY_TINY_TARGETS` | Axes says low precision, but many tiny targets | `precision_requirement <= 1` and `tiny_count >= 3` |
| `INTENDED_HIGH_DISAMBIGUATION_BUT_UNIQUE_TARGET_MATCH` | Axes says high disambiguation, but goal text uniquely matches one element | `disambiguation_load >= 3` and `unique_match == true` |
| `INTENDED_TEXT_GUIDANCE_BUT_NO_TARGET_TEXT_MATCH` | Scene uses text guidance, but quoted goal phrases not found in page | `guidance == "text"` and `visible_match_count == 0` with phrases present |
| `INTENDED_LOW_CLUTTER_BUT_HIGH_INTERACTIVE_COUNT` | Scene says no clutter, but many interactives | `clutter == "none"` and `visible_interactive_count > 40` |
| `INTENDED_HIGH_DEPTH_BUT_NO_OVERLAY_SIGNAL` | Axes says deep layering, but no popup/overlay detected | `depth_layering >= 3` and no overlay signals |
| `INTENDED_LOW_DEPTH_BUT_PROBE_REVEALS_DIALOG_OR_POPUP` | Axes says shallow, but probe reveals dialog | `depth_layering <= 1` and `post_probe_dialog_count > 0` |
| `HARD_TASK_HAS_OBVIOUS_SHORTCUT` | Hard task has searchbox/filter/direct input | `difficulty_bucket == "hard"` and any shortcut true |
| `MULTI_INSTANCE_EXPECTATION_MISMATCH` | Scene expects multiple instances but few duplicates found | `instances > 1` and `duplicate_labels == 0` |

Flags are **conservative**: they fire only when the evidence is clear. Raw metrics are always preserved so thresholds can be adjusted post-hoc.

## Interpreting Results

### Intended vs Realized vs Empirical

| Layer | Source | What It Tells You |
|-------|--------|-------------------|
| **Intended** | YAML `difficulty.*`, `scene_context.*` | What the task designer thought the difficulty would be |
| **Realized** | This audit (DOM measurements) | What the rendered page actually looks like structurally |
| **Empirical** | Agent benchmark results (`results.jsonl`) | How well agents actually performed |

When all three align, the task is well-calibrated. Mismatches reveal:

- **Intended hard, realized easy, empirical easy** → Task may need redesign for harder scenarios
- **Intended easy, realized easy, empirical hard** → Agent has a blind spot (interesting for research)
- **Intended hard, realized hard, empirical easy** → Agent found a shortcut (check `obvious_shortcuts`)
- **Intended ≠ realized** (any bucket) → Task metadata may need updating

### Using the Audit to Prioritize Task Review

1. Sort `flagged_tasks.csv` by `flag_count` descending
2. Review tasks with `PAGE_RENDER_FAILURE` first (broken tasks)
3. Then review `HARD_TASK_HAS_OBVIOUS_SHORTCUT` (potentially trivializable tasks)
4. Cross-reference with agent pass rates from benchmark results
