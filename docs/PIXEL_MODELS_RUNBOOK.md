# Pixel-Only Models Runbook

This document covers how to run the three pixel-only model backends
(MAI-UI-8B, UI-TARS-1.5-7B, Holo2-30B-A3B) against ComponentBench.

## Overview

| Model | HuggingFace ID | GPU per shard | Coordinate Scale |
|---|---|---|---|
| MAI-UI-8B | Tongyi-MAI/MAI-UI-8B | 1x RTX Pro 6000 | 0-999 (mapped to 0-1000) |
| UI-TARS-1.5-7B | ByteDance-Seed/UI-TARS-1.5-7B | 1x RTX Pro 6000 | smart_resize space (mapped back) |
| Holo2-30B-A3B | Hcompany/Holo2-30B-A3B | 1x RTX Pro 6000 | 0-1000 (direct, via structured JSON) |

Each model runs in **pixel mode only** with **2 shards** (workers).
Total: **6 GPUs** for all three models running concurrently.

## 1. Prerequisites

Ensure the vLLM environment is set up:

```bash
# These should already exist from the Qwen3-VL baseline setup
ls /usr/project/xtmp/$USER/vllm_env/bin/python3
ls /usr/project/xtmp/$USER/playwright-browsers/
```

Download model weights (first time only -- happens automatically on first run,
but you can pre-download to avoid timeout):

```bash
source /usr/project/xtmp/$USER/vllm_env/bin/activate
huggingface-cli download Tongyi-MAI/MAI-UI-8B
huggingface-cli download ByteDance-Seed/UI-TARS-1.5-7B
huggingface-cli download Hcompany/Holo2-30B-A3B
```

## 2. Run Parser Tests (no GPU needed)

```bash
cd ~/projects/ComponentBench
/usr/project/xtmp/$USER/vllm_env/bin/python3 scripts/test_pixel_parsers.py
# Expected: 42 tests, all pass
```

## 3. Local Smoke Test (1 GPU, interactive)

### Step 1: Start vLLM for one model

```bash
# Request an interactive GPU session
salloc --partition=compsci-gpu --gres=gpu:1 --cpus-per-task=16 --mem=96G --time=2:00:00

# Activate vLLM env
source /usr/project/xtmp/$USER/vllm_env/bin/activate

# Start vLLM for MAI-UI-8B
python -m vllm.entrypoints.openai.api_server \
  --model Tongyi-MAI/MAI-UI-8B \
  --port 8000 \
  --tensor-parallel-size 1 \
  --max-model-len 8192 \
  --dtype bfloat16 \
  --served-model-name MAI-UI-8B \
  --trust-remote-code \
  --gpu-memory-utilization 0.90 &

# Wait for vLLM to be ready
while ! curl -sf http://localhost:8000/v1/models > /dev/null; do sleep 5; done
echo "vLLM ready"
```

### Step 2: Start ComponentBench site

```bash
cd ~/projects/ComponentBench/site
export BENCHMARK_BUILD=1
npm ci && npm run build
./node_modules/.bin/next start -p 3002 &
```

### Step 3: Run smoke test

```bash
cd ~/projects/ComponentBench
export VLLM_BASE_URL=http://localhost:8000/v1
python scripts/smoke_pixel_models.py \
  --model_backend mai_ui \
  --base_url http://localhost:3002 \
  --max_tasks 5
```

Repeat with `--model_backend ui_tars` or `--model_backend holo2`
(after restarting vLLM with the appropriate model).

## 4. Slurm: Run All 3 Models (6 GPUs)

### Submit all models concurrently

```bash
cd ~/projects/ComponentBench
./scripts/submit_componentbench_pixel_3models.sh \
  --run_id cb_pixel_$(date +%Y%m%d_%H%M%S)
```

This submits 6 Slurm jobs:
- `cb_pixel_mai_ui` array [0-1]: MAI-UI-8B, 2 shards
- `cb_pixel_ui_tars` array [0-1]: UI-TARS-1.5-7B, 2 shards
- `cb_pixel_holo2` array [0-1]: Holo2-30B-A3B, 2 shards

### Submit a single model

```bash
./scripts/submit_componentbench_pixel_3models.sh \
  --run_id test_mai_ui \
  --models mai_ui
# Submits only 2 jobs for MAI-UI
```

### Dry run (show commands without submitting)

```bash
./scripts/submit_componentbench_pixel_3models.sh \
  --run_id test --dry_run
```

### Monitor

```bash
squeue -u $USER -n "cb_pixel_*"
```

## 5. Where Artifacts Live

Results are stored under:
```
/usr/project/xtmp/$USER/componentbench-runs/pixel_models/<RUN_ID>/
  mai_ui/
    <job_id>_0/results/       # shard 0
    <job_id>_1/results/       # shard 1
  ui_tars/
    <job_id>_0/results/
    <job_id>_1/results/
  holo2/
    <job_id>_0/results/
    <job_id>_1/results/
```

Each results directory contains:
- `results.jsonl` -- per-task results (append-only)
- `summary.json` -- aggregate statistics
- `run_manifest.json` -- run parameters
- Task trace directories (BrowserGym experiment data)

## 6. Merge Shards

After both shards of a model complete:

```bash
cd ~/projects/ComponentBench
python scripts/merge_shards.py \
  --shard_dirs \
    /usr/project/xtmp/$USER/componentbench-runs/pixel_models/<RUN_ID>/mai_ui/<job>_0/results \
    /usr/project/xtmp/$USER/componentbench-runs/pixel_models/<RUN_ID>/mai_ui/<job>_1/results \
  --output_dir /usr/project/xtmp/$USER/componentbench-results/pixel_models/mai_ui_merged
```

## 7. Compare Results Across Models

After merging, compare pass rates:

```bash
for model in mai_ui ui_tars holo2; do
  echo "=== ${model} ==="
  python3 -c "
import json
with open('/usr/project/xtmp/$USER/componentbench-results/pixel_models/${model}_merged/summary.json') as f:
    s = json.load(f)
print(f'  Pass rate: {s[\"overall_pass_rate\"]*100:.1f}%')
print(f'  Total: {s[\"total_tasks\"]}, Passed: {s[\"total_passed\"]}')
"
done
```

## 8. Port Assignment Scheme

To avoid collisions when multiple jobs share a node:

| Model | model_idx | Shard 0 site:vllm | Shard 1 site:vllm |
|---|---|---|---|
| mai_ui | 0 | 3100:8100 | 3101:8101 |
| ui_tars | 1 | 3120:8120 | 3121:8121 |
| holo2 | 2 | 3140:8140 | 3141:8141 |

Formula: `site_port = 3100 + model_idx * 20 + shard_id`

## 9. Troubleshooting

### vLLM OOM on RTX Pro 6000 (96GB)
- Reduce `max_model_len` in the YAML config
- Reduce `gpu_memory_utilization` to 0.85
- Holo2-30B-A3B is the largest; try `max_model_len: 16384` if OOM

### Invalid action spam
- Check vLLM logs: `cat <RUN_ROOT>/logs/vllm.log | tail -50`
- Ensure the model is actually loaded (check `/v1/models` endpoint)
- Run parser tests to verify extraction logic

### Coordinate mapping issues
- MAI-UI: coordinates should be 0-999 from model, mapped to 0-1000
- UI-TARS: coordinates are in smart_resize space; verify resize dimensions in logs
- Holo2: coordinates should be 0-1000 directly via structured JSON

### Port collisions
- If jobs fail with "address already in use", check for stale processes:
  `ps aux | grep -E 'next|vllm' | grep $USER`
- Kill orphaned processes and resubmit

### Site build fails
- Check NFS inode quota: `quota -s`
- The worker script uses an isolated build directory under xtmp to avoid NFS issues
