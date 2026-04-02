# ComponentBench v0.3 Experiment Runbook

## Overview

This runbook documents how to run, reproduce, and verify ComponentBench v0.3 experiments on the Duke CS cluster.

**Pipeline version**: v0.3  
**Tasks**: 97 canonical types, 2910 tasks  
**Modes**: ax_tree, som, pixel_grid, pixel  
**Max cluster usage**: 2 fitz GPU nodes simultaneously  

## Prerequisites

- Duke CS cluster access with `compsci-gpu` partition
- vLLM environment at `/usr/project/xtmp/$USER/vllm_env`
- Node.js 20+ via nvm
- Playwright browsers installed

## Quick Start

### 1-shard run (single node)

```bash
# Submit a full run on 1 node
BENCHMARK_MODE=ax_tree bash scripts/submit_componentbench.sh

# Or directly via sbatch
sbatch scripts/run_componentbench_slurm.sh
```

### 2-shard run (two nodes)

```bash
# The submit helper automatically detects idle nodes
bash scripts/submit_componentbench.sh
# If 2 fitz nodes idle: submits 2-shard array job
# If 1 fitz node idle: submits 1-shard job
# If 0 idle: waits (polls every 5 min)
```

### Smoke test

```bash
BENCHMARK_MAX_TASKS=50 bash scripts/submit_componentbench.sh
```

### Specific mode only

```bash
BENCHMARK_MODE=pixel_grid bash scripts/submit_componentbench.sh
```

## Setting Time Limits

The Slurm script uses `#SBATCH --time=14-00:00:00` (14 days) by default. Override via:

```bash
# Custom time limit (e.g., 7 days)
sbatch --time=7-00:00:00 scripts/run_componentbench_slurm.sh
```

A job-level watchdog (`timeout`) runs slightly below the SBATCH limit to ensure clean shutdown.

## Per-Task Timeout

Each task has a hard walltime limit (default 600 seconds = 10 minutes):

```bash
BENCHMARK_MAX_TASK_WALLTIME=900 sbatch scripts/run_componentbench_slurm.sh
```

This prevents Playwright hangs from wasting multi-day runs. Tasks exceeding the limit get `termination_reason=task_timeout`.

## Resuming a Run

If a run is interrupted, resume it by pointing to the same output directory:

```bash
export BENCHMARK_RESUME=1
export BENCHMARK_OUTPUT_DIR=/usr/project/xtmp/$USER/componentbench-results/componentbench/<run_id>/shard_0
sbatch scripts/run_componentbench_slurm.sh
```

Resume:
- Reads existing `results.jsonl` to skip completed tasks
- Reuses the original `run_id` from `run_manifest.json`
- Writes `resume_manifest.json` (never overwrites original manifest)

## Merging Shards

After a 2-shard run completes:

```bash
python scripts/merge_shards.py \
    --input_dir /usr/project/xtmp/$USER/componentbench-results/componentbench/<run_id>/
```

### Strict merge (default)

The merge script **fails by default** if shards have different `git_commit` or `run_id` values. This prevents silently merging results from different code versions or experiments.

To override (NOT recommended for paper results):

```bash
python scripts/merge_shards.py \
    --input_dir <path> \
    --allow_mixed_commits \
    --allow_mixed_run_ids
```

## Preflight Health Check

Before long runs, the pipeline automatically checks that tasks load correctly:

```bash
# Runs by default in Slurm (PRECHECK=1)
# To disable (not recommended):
PRECHECK=0 sbatch scripts/run_componentbench_slurm.sh

# Run manually:
python scripts/preflight_componentbench_health.py --base_url http://localhost:3002
python scripts/preflight_componentbench_health.py --base_url http://localhost:3002 --full
```

## DOM Leak Scan

Before publishing results, verify no test-only attributes leak in benchmark mode:

```bash
python scripts/scan_benchmark_dom_leaks.py --base_url http://localhost:3002 --ci
```

In v0.3, a MutationObserver automatically strips `data-testid`, `data-test*`, `data-cy`, `data-qa` attributes in benchmark mode.

## Build Isolation

**DO NOT build the Next.js site in a shared directory across nodes.** Each Slurm job copies the site to a per-job `xtmp` directory and builds there independently. This is handled automatically by `run_componentbench_slurm.sh`.

## Output Locations

All run artifacts go to xtmp (temporary, 180-day retention):

```
/usr/project/xtmp/$USER/componentbench-results/componentbench/<run_id>/
├── shard_0/
│   ├── run_manifest.json      # Reproducibility metadata
│   ├── results.jsonl           # Per-task results
│   ├── summary.json            # Aggregate stats
│   ├── run_config.json         # CLI args snapshot
│   └── <trace_dirs>/           # Per-task experiment traces
└── shard_1/
    └── ...
```

## Run Manifest

Every run produces `run_manifest.json` with:

| Field | Description |
|-------|-------------|
| run_id | Stable ID for the run |
| pipeline_version | "v0.3" |
| git_commit | Repo commit at run time |
| hostname | Compute node |
| slurm_job_id | Slurm job ID |
| shard_id / num_shards | Sharding info |
| model_id | Model name |
| timestamp_start / end | Wall clock |

## Guardrails Summary

| Guardrail | Default | Override |
|-----------|---------|----------|
| Preflight health check | ON | PRECHECK=0 |
| Strict merge (git_commit) | ON | --allow_mixed_commits |
| Strict merge (run_id) | ON | --allow_mixed_run_ids |
| Per-task timeout | 600s | --max_task_walltime_seconds |
| Job watchdog | 13d23h | JOB_WATCHDOG_TIMEOUT |
| SBATCH time limit | 14 days | --time= override |
| Build isolation | Always | N/A |
| DOM attribute stripping | In benchmark mode | N/A |
| Strict merge (model_id) | ON | --allow_mixed_models |

---

## OpenRouter Multi-Model Runs

### Setup

1. **Create API key file** (one-time, user-private):

```bash
mkdir -p ~/.secrets && chmod 700 ~/.secrets
echo 'OPENROUTER_API_KEY=sk-or-v1-YOUR_KEY_HERE' > ~/.secrets/openrouter.env
chmod 600 ~/.secrets/openrouter.env
```

The key is sourced by Slurm jobs at runtime. It never appears in the repo or job logs.

2. **Optional rate-limit tuning**:

Add to `~/.secrets/openrouter.env`:
```
OPENROUTER_MIN_REQUEST_INTERVAL=0.5
```
This sets a minimum gap (seconds) between API requests to reduce 429s.

### Shard Mapping

OpenRouter runs use a 56-shard array: **4 modes x 14 families**.

```
array_id = mode_idx * 14 + family_idx

Modes:    [0] ax_tree  [1] som  [2] pixel_grid  [3] pixel
Families: [0] advanced_editors  [1] combobox_autocomplete  ...  [13] text_entry
```

Each shard runs one mode for one family (~50-300 tasks per shard). Shards use CPU-only nodes (no GPU needed) since inference is via the OpenRouter API.

### Submit a Full Run

```bash
# Full 56-shard run for Kimi K2.5 (max 8 concurrent)
bash scripts/submit_componentbench_openrouter_array.sh \
    --model_id moonshotai/kimi-k2.5 \
    --run_id kimi_k25_v1

# Dry run (show shard mapping, don't submit)
bash scripts/submit_componentbench_openrouter_array.sh \
    --model_id moonshotai/kimi-k2.5 --dry_run
```

### Run a Single Family (Smoke Test)

```bash
# Just array_id=2 = ax_tree / command_navigation
bash scripts/submit_componentbench_openrouter_array.sh \
    --model_id moonshotai/kimi-k2.5 \
    --array 2-2 \
    --run_id kimi_smoke
```

### Run One Mode Only

```bash
# ax_tree mode = array IDs 0-13
bash scripts/submit_componentbench_openrouter_array.sh \
    --model_id moonshotai/kimi-k2.5 \
    --array 0-13 \
    --run_id kimi_ax_tree_only
```

### Adjust Concurrency

```bash
# Max 4 concurrent shards (gentler on API rate limits)
bash scripts/submit_componentbench_openrouter_array.sh \
    --model_id moonshotai/kimi-k2.5 \
    --max_concurrent 4
```

### Monitor

```bash
squeue -u $USER -n cb_openrouter
```

### Merge Results

After all 56 shards complete:

```bash
python scripts/merge_shards.py \
    --input_dir /usr/project/xtmp/$USER/componentbench-runs/componentbench_openrouter/<run_id>
```

The merge script validates that all shards use the same `model_name`, `git_commit`, and `run_id`. To override (not recommended):

```bash
python scripts/merge_shards.py \
    --input_dir <path> \
    --allow_mixed_models \
    --allow_mixed_commits
```

### Resume Failed Shards

Each shard automatically resumes if `results.jsonl` exists in its output directory. To resubmit a specific failed shard:

```bash
# Resubmit just shard 7 (som / files_clipboard)
bash scripts/submit_componentbench_openrouter_array.sh \
    --model_id moonshotai/kimi-k2.5 \
    --run_id <same_run_id> \
    --array 7-7
```

### Cost and Rate Limits

- Token usage is logged per API call (prompt/completion/total tokens).
- The agent includes exponential backoff on 429 (rate limit) and 5xx (server error).
- Adjust `OPENROUTER_MIN_REQUEST_INTERVAL` in your secrets file to throttle.
- Monitor OpenRouter dashboard for spend tracking.
- **Estimate**: ~2910 tasks × 20 steps × ~4K tokens/step ≈ ~230M tokens per mode. Plan accordingly.

### Output Structure

```
/usr/project/xtmp/$USER/componentbench-runs/componentbench_openrouter/<run_id>/
├── <job_id>_0/        # array_id=0: ax_tree / advanced_editors
│   ├── results/
│   │   ├── results.jsonl
│   │   ├── summary.json
│   │   └── run_manifest.json
│   └── logs/
│       ├── benchmark.log
│       └── nextjs.log
├── <job_id>_1/        # array_id=1: ax_tree / combobox_autocomplete
│   └── ...
└── ...                # 56 shard directories total
```
