# Scene-Factor (E1–E8) Statistical Analysis

## Purpose

Tests whether the eight designed scene factors (E1 Theme, E2 Spacing, E3 Layout,
E4 Placement, E5 Scale, E6 Instances, E7 Guidance, E8 Clutter) are macroscopically
associated with realized difficulty, human performance, and agent performance across
all 2910 ComponentBench tasks.

## Research Questions

- **Q1 (Manipulation check):** Do E1–E8 predict realized difficulty axes?
- **Q2 (Human difficulty):** Do E1–E8 predict human step count and duration?
- **Q3 (Agent performance):** Do E1–E8 predict agent success/steps/duration?
- **Q4 (Mode dependence):** Do effects differ by observation mode?

## Input Sources

| Source | Path |
|--------|------|
| Task index | `site/src/generated/task-index.json` |
| Ontology | `site/src/ontology/ontology.ts` |
| Realized axes | `data/realized_axes_v2.jsonl` |
| Realized features | `data/realized_features_v2.jsonl` |
| Human reference | Layer 1 bundles (`/usr/xtmp/tg295/.../layer1_v1/`) |
| Agent results | `results/*.jsonl`, `results/componentbench_v03_1/*.jsonl` |

## Model Formulas

### Model A (Manipulation check)
```
realized_axis ~ C(E1) + C(E2) + C(E3) + C(E4) + C(E5) + log1p(E6) + C(E7) + E8_ord
                + C(library) + C(canonical_type)
```
OLS with HC3 robust standard errors.

### Model B (Human difficulty)
```
human_macro_steps ~ [same predictors]   (Negative Binomial)
log1p(human_duration_ms) ~ [same]       (OLS with HC3)
```
Also: adjusted model adding realized axis scores.

### Model C (Agent performance)
```
success ~ [E-factors] + C(mode) + C(library) + C(canonical_type) + C(model_family)
```
Logistic regression with cluster-robust SE by task_id.

### Model D (Interactions)
```
success ~ [base model] + C(E_factor):C(mode)
```
One factor at a time. Likelihood-ratio test vs. base.

## FDR Correction

Benjamini–Hochberg within four families: A omnibus, B omnibus, C omnibus, D interactions.

## Factor Harmonization

- `difficulty_bucket`: "mid" → "medium"
- E6 Instances: continuous via `log1p(instances)`
- E8 Clutter: ordinal numeric (none=0, low=1, medium=2, high=3)
- All other E-factors: categorical with treatment coding

## How to Run

```bash
# On Slurm
sbatch scripts/statistics/slurm_analyze_scene_factors.sh

# Locally
python3 scripts/statistics/analyze_scene_factors.py \
    --output-dir outputs/scene_factor_analysis \
    --layer1-dir /usr/xtmp/tg295/componentbench-observation-packets/layer1_v1
```

## Output Structure

```
outputs/scene_factor_analysis/
├── data/
│   ├── task_level_table.parquet
│   ├── task_level_table.csv
│   ├── run_level_table.parquet
│   ├── run_level_table.csv
│   └── qa_report.json
├── models/
│   ├── model_A_omnibus.csv
│   ├── model_A_coefficients.csv
│   ├── model_B_omnibus.csv
│   ├── model_C_omnibus.csv
│   ├── model_C_coefficients.csv
│   ├── model_D_interactions.csv
│   ├── fdr_results.csv
│   ├── importance_ranking.csv
│   ├── robustness_checks.csv
│   └── model_summary.json
├── figures/
│   ├── factor_balance.png / .pdf
│   ├── factor_cooccurrence_heatmap.png / .pdf
│   ├── realized_by_factor.png / .pdf
│   ├── passrate_by_factor_mode.png / .pdf
│   ├── passrate_by_model_family.png / .pdf
│   ├── forest_plot_success.png / .pdf
│   ├── effect_heatmap.png / .pdf
│   └── interaction_plots.png / .pdf
└── report/
    ├── scene_factor_analysis.md
    ├── scene_factor_analysis.html
    └── executive_summary.md
```

## Caveats

- These are **associations**, not causal claims.
- Factor imbalance exists — some levels are rare.
- Realized difficulty is heuristic (automated replay audit).
- Not all model families tested on all modes.
