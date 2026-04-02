# ComponentBench v0.2 Experiment Plan

This document outlines the recommended experiment matrix and scheduling policy for running ComponentBench benchmarks on the Duke CS cluster.

## Benchmark Overview

- **Total Tasks**: 2,910 tasks across 97 canonical component types
- **Libraries**: Ant Design, Material UI, Mantine
- **Observation Modes**: 4 modes (ax_tree, som, pixel_grid, pixel)
- **Total Runs**: 11,640 task-mode combinations per model

## Cluster Resource Policy

**IMPORTANT**: Follow the polite cluster usage policy:

1. **Maximum 2 nodes**: Never request more than 2 fitz GPU nodes simultaneously
2. **Wait if busy**: If no nodes are idle, wait rather than queue many jobs
3. **Use the submit helper**: Always use `scripts/submit_componentbench.sh` which enforces these rules

### Why This Policy?

- fitz45-49 are shared resources with limited availability (5 nodes total)
- Each full benchmark run takes several hours per mode
- Queuing many jobs blocks other users and doesn't speed up our runs

---

## Experiment Matrix

### A) Smoke Validation (Required First)

**Purpose**: Validate infrastructure and catch systematic failures before full runs.

**Configuration**:
```bash
# Run 50 tasks across all modes (about 200 total runs)
BENCHMARK_MAX_TASKS=50 bash scripts/submit_componentbench.sh
```

**Expected Duration**: ~30 minutes per mode (2 hours total for all 4 modes)

**Success Criteria**:
- No systematic errors (crashes, timeouts, missing dependencies)
- Results directory created with valid JSONL output
- Merge script works correctly on partial results

**Alternative**: Run 2 tasks per canonical type:
```bash
# This runs first 2 tasks from each of 97 types = 194 tasks
python scripts/run_benchmark.py \
  --mode all \
  --max_tasks 194 \
  --output_dir /tmp/cb_smoke \
  --dry_run  # Remove to actually run
```

---

### B) Full Baseline Runs

**Purpose**: Generate complete benchmark results for a single model.

**Recommended Approach**: Run one mode at a time to enable incremental analysis.

#### Mode 1: AX-tree (Accessibility Tree + Screenshot)
```bash
BENCHMARK_MODE=ax_tree bash scripts/submit_componentbench.sh
# Wait for completion, merge results
python scripts/merge_shards.py \
  --input_dir /usr/project/xtmp/$USER/componentbench-results/componentbench/<run_id>/
```

#### Mode 2: SoM (Set-of-Mark + Screenshot)
```bash
BENCHMARK_MODE=som bash scripts/submit_componentbench.sh
# Wait for completion, merge results
```

#### Mode 3: Pixel Grid (Screenshot + Grid)
```bash
BENCHMARK_MODE=pixel_grid bash scripts/submit_componentbench.sh
# Wait for completion, merge results
```

#### Mode 4: Pixel (Screenshot Only)
```bash
BENCHMARK_MODE=pixel bash scripts/submit_componentbench.sh
# Wait for completion, merge results
```

**Expected Duration per Mode**:
- With 2 shards: ~6-8 hours
- With 1 shard: ~12-16 hours

**Total for All Modes**: 24-48 hours depending on cluster availability

---

### C) Paper-Ready Aggregates

After completing all modes, generate analysis-ready outputs:

```bash
# Merge all results
python scripts/merge_shards.py \
  --input_dir /usr/project/xtmp/$USER/componentbench-results/componentbench/<run_id>/

# Output files:
# - merged/results_merged.jsonl     # All task results
# - merged/summary_merged.json      # Summary statistics
# - merged/results_all.csv          # Full results CSV
# - merged/aggregates_by_mode.csv   # Pass rates by mode
# - merged/aggregates_by_canonical_type.csv
# - merged/aggregates_by_library.csv
# - merged/aggregates_by_difficulty_tier.csv
```

**Key Metrics to Report**:

| Metric | Description |
|--------|-------------|
| Overall pass rate | Percentage of tasks completed successfully |
| Avg steps to completion | Mean steps for successful tasks |
| Mode comparison | Pass rate difference between modes |
| Library comparison | antd vs mui vs mantine performance |
| Difficulty analysis | L0-L3 tier pass rates |
| Component family breakdown | Pass rate by component category |

---

### D) Optional Analyses

#### Hard Subset Analysis
Identify the most challenging component types:

```python
import pandas as pd

df = pd.read_csv('merged/aggregates_by_canonical_type.csv')
# Group by canonical_type, average pass_rate across modes
hard_types = df.groupby('canonical_type')['pass_rate'].mean().nsmallest(10)
print("Bottom 10 hardest canonical types:")
print(hard_types)
```

#### Precision Proxy Analysis
Compare components requiring continuous control vs discrete actions:

```python
# Continuous: slider_single, slider_range, color_picker_2d, etc.
# Discrete: button, checkbox, radio_group, etc.

continuous_types = [
    'slider_single', 'slider_range', 'color_picker_2d',
    'alpha_slider', 'number_input_spinbutton'
]

df['control_type'] = df['canonical_type'].apply(
    lambda x: 'continuous' if x in continuous_types else 'discrete'
)
print(df.groupby('control_type')['pass_rate'].mean())
```

#### Guidance Mode Analysis
If scene_context.guidance is available in results:

```python
# Compare text vs visual vs mixed guidance
df.groupby('guidance')['pass_rate'].mean()
```

---

## Scheduling Guidelines

### Before Starting

1. **Check node availability**:
   ```bash
   sinfo -p compsci-gpu -n compsci-cluster-fitz-[45-49] -N -o "%N %T %G"
   ```

2. **Check your queue**:
   ```bash
   squeue -u $USER
   ```

3. **Verify storage space**:
   ```bash
   du -sh /usr/project/xtmp/$USER/
   # Estimate: ~1GB per 1000 tasks with screenshots
   # Full run: ~12GB per mode, ~50GB total
   ```

### During Runs

1. **Monitor progress**:
   ```bash
   # Check job status
   squeue -u $USER
   
   # Check latest output
   tail -f /usr/project/xtmp/$USER/componentbench-results/componentbench/<run_id>/shard_*/results.jsonl
   ```

2. **Handle failures**:
   - Jobs that fail can be resumed with `--resume` flag
   - Partial results are preserved in JSONL format

### After Completion

1. **Merge shards**:
   ```bash
   python scripts/merge_shards.py \
     --input_dir /usr/project/xtmp/$USER/componentbench-results/componentbench/<run_id>/
   ```

2. **Verify completeness**:
   ```bash
   wc -l merged/results_merged.jsonl
   # Expected: 2910 per mode, 11640 total for all 4 modes
   ```

3. **Clean up (after copying results)**:
   ```bash
   # Keep merged results, remove shard directories
   # CAUTION: Only after verifying merge is complete
   ```

---

## xtmp Storage Notes

The `/usr/project/xtmp/$USER/` directory is temporary storage:

- **Files not accessed for 180 days may be deleted**
- **Not backed up**

Recommended workflow:
1. Run experiments to xtmp
2. Merge and analyze results
3. Copy final merged results to permanent storage
4. Clean up intermediate files

---

## Example Full Workflow

```bash
# 1. Smoke test
BENCHMARK_MAX_TASKS=50 bash scripts/submit_componentbench.sh
# Wait for completion...

# 2. Run ax_tree mode
BENCHMARK_MODE=ax_tree bash scripts/submit_componentbench.sh
# Wait for completion...

# 3. Run som mode
BENCHMARK_MODE=som bash scripts/submit_componentbench.sh
# Wait for completion...

# 4. Run pixel_grid mode
BENCHMARK_MODE=pixel_grid bash scripts/submit_componentbench.sh
# Wait for completion...

# 5. Run pixel mode
BENCHMARK_MODE=pixel bash scripts/submit_componentbench.sh
# Wait for completion...

# 6. Merge all results
python scripts/merge_shards.py \
  --input_dir /usr/project/xtmp/$USER/componentbench-results/componentbench/<run_id>/

# 7. Generate report
# (Custom analysis script)

# 8. Copy results to permanent storage
cp -r /usr/project/xtmp/$USER/componentbench-results/componentbench/<run_id>/merged/ \
  ~/permanent_results/componentbench_<run_id>/
```
