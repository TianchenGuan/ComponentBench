# Evaluation Protocol

How to run an agent against ComponentBench in a way that yields directly comparable numbers.

## Choose a benchmark version

- **v1 / Full** (2,910 tasks): broad coverage across 97 canonical types × 3 libraries. Use for full leaderboards.
- **v2 / Core** (912 tasks): harder, generation-unit-based subset with richer designed factors. Use for tracking frontier progress.

v1 is the default unless `--benchmark_version v2` is passed to `scripts/run_benchmark.py` (the Browser-Use runner uses `--benchmark-version v2`).

## Choose an observation mode

| Mode | Inputs | Action space |
|---|---|---|
| `ax_tree` | Screenshot + serialized accessibility tree | element-id actions (`bid`) |
| `som` | Screenshot with set-of-mark overlay | element-id actions (`bid`) |
| `pixel` | Screenshot only | coordinate actions |
| `pixel_grid` | Screenshot with overlaid coordinate grid | coordinate actions |
| `browser_use` | The agent controls a live browser via the `browser-use` tool | tool actions |
| `ui_tars_native` | Native UI-TARS pixel+coordinate format | UI-TARS action format |

Report all four (or as many as you support). Switching modes can move scores by 30+ percentage points.

## Hyperparameters to fix

- **max_steps:** 20 per task (we use this for all reported results).
- **Per-step timeout:** 300s (`step_timeout` in `configs/environment/default.yaml`).
- **Per-task wall-clock cap:** 600s (`--max_task_walltime_seconds`).
- **Site URL:** the local self-hosted site (see `docs/data-format.md`) on port 3002 by default.
- **Browser:** Chromium via Playwright; headless for cluster runs (default).
- **Viewport:** 1280×720 (the harness default in `benchmark/core/task.py`).
- **Random seed:** 42 (`task_seed`); tasks are otherwise deterministic.

## What counts as success

A task passes iff `#cb-success-banner` appears in the DOM at any point before the step cap. **Do not** use the agent's own "I'm done" signal as ground truth.

### browser-use caveat

The `browser-use` agent has a built-in `done(success=True)` action. **Ignore self-reported success.** Only trust the DOM banner. The provided runner already does this; if you write your own, replicate the check.

## What to report

Per (model, mode, version):

- **Task success rate** = passed / total.
- **Mean normalized steps** on passed tasks (compare to human reference).
- **Mean wall-clock seconds** on passed tasks.
- **Per-family breakdown** — see `data/metadata/canonical_components.csv` for the family mapping.
- **Per-mode breakdown** if multiple modes were run.

Optionally include per-axis-rating breakdown (precision_requirement, target_acquisition, etc.) for diagnostic comparisons.

## How to submit results

Drop a JSON file under `results/public/<model>-<mode>-<version>.json` conforming to `schema/result.schema.json` (one object per task, JSON-Lines is also fine), open a PR. Include a short methods note (model identifier, system prompt, decoding settings, max_steps).

## Common pitfalls

1. **Forgetting `mode=benchmark` in the URL.** The site's task pages have a "presentation" mode for human browsing and a "benchmark" mode for agent evaluation. Always pass `?mode=benchmark`.
2. **Re-running the same task across modes without resetting state.** Each trial is independent; recreate the browser context.
3. **Counting raw typing keystrokes as steps.** Normalize before reporting (merge adjacent character-by-character typing into one `type` action).
4. **Trusting agent self-assessment.** See the browser-use caveat above.

## Reference numbers (task success %)

### Full / v1 (2,910 tasks)

| Model | Browser-Use | AX-tree | SoM | Pixel |
|---|---:|---:|---:|---:|
| Gemini 3 Flash | 95.2 | 89.6 | 87.1 | 85.4 |
| GPT-5.4 | 90.4 | 81.5 | 77.0 | 83.8 |
| Gemini 3.1 Flash-Lite | 87.4 | 77.7 | 73.5 | 63.3 |
| GPT-5 mini | 87.0 | 83.1 | 78.5 | 48.9 |
| GPT-5.4 mini | 85.8 | 79.1 | 74.7 | 77.1 |
| Qwen3-VL-235B | 78.8 | 77.0 | 54.4 | 50.5 |
| UI-TARS-1.5-7B (native harness) | — | — | — | 12.6 |

### Core / v2 (912 tasks)

| Model | Browser-Use | Pixel |
|---|---:|---:|
| Gemini 3 Flash | 84.5 | 60.9 |
| Opus 4.6 | — | 65.4 |
| GPT-5.4 mini | 57.8 | 37.7 |

Human reference (same tasks, after typing normalization): ~2.7 steps avg on v1, ~5.2 steps avg on v2.
