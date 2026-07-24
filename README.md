# ComponentBench

**Diagnosing Component-Level Failures in Computer-Use Agents** — COLM 2026.

<!-- arXiv badge: add once the arXiv ID is live, e.g.
[![arXiv](https://img.shields.io/badge/arXiv-XXXX.XXXXX-b31b1b.svg)](https://arxiv.org/abs/XXXX.XXXXX) -->
[![COLM 2026](https://img.shields.io/badge/COLM-2026-blue.svg)](https://colmweb.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Dataset](https://img.shields.io/badge/%F0%9F%A4%97%20Dataset-ComponentBench-yellow.svg)](https://huggingface.co/datasets/TianchenGuan/ComponentBench)

ComponentBench is a diagnostic benchmark for computer-use agents at the layer between atomic GUI grounding and long-horizon workflows. It evaluates agents on isolated interactions with real React UI components — toggling button groups, setting sliders, using date pickers, editing data grids — that are short enough to pinpoint failures and rich enough to reflect modern web interfaces.

- **Website:** https://interfacegym.com (also serves componentbench.com)
- **Paper:** *ComponentBench: Diagnosing Component-Level Failures in Computer-Use Agents* (COLM 2026)
- **Dataset (tasks + all raw agent/human runs):** https://huggingface.co/datasets/TianchenGuan/ComponentBench

## What is ComponentBench

- **ComponentBench-Full (v1):** 2,910 tasks over **97 canonical component types** in **14 interaction families**, instantiated via **24 task templates** in three React libraries (Ant Design, MUI, Mantine), plus 30 external markdown-editor tasks.
- **ComponentBench-Core (v2):** 912 newly generated hard-only tasks across 19 generation units and 45 canonical components, for tracking frontier progress.
- Every task is **programmatically verified** (a DOM success banner, no LLM judging) and paired with a **cleaned human reference trajectory** for step-efficiency comparisons.

Clone this repository and you can:

1. **Serve the benchmark site locally** — a minimal Next.js app that renders every task page on `http://localhost:3002`.
2. **Run the Python harness** against the local site (or the public hosted site) in four observation/action spaces.
3. **Inspect the data** — every task YAML, human reference traces, the ontology, and the JSON schemas they conform to.
4. **Record human traces** — collect human reference trajectories for the 278-task subset locally on Windows or Mac. See [site/README.md](site/README.md#record-human-traces) (`cd site && npm install && npm run record`).

This is the light, installable benchmark repo. The full platform (Task Lab task generation, log viewer backend, Supabase) deploys interfacegym.com and is not included here.

## Results

### Full (2,910 tasks), task success rate (%)

| Model | Browser-Use | AX-tree | SoM | Pixel |
|---|---:|---:|---:|---:|
| Gemini 3 Flash | 95.2 | 89.6 | 87.1 | 85.4 |
| GPT-5.4 | 90.4 | 81.5 | 77.0 | 83.8 |
| Gemini 3.1 Flash-Lite | 87.4 | 77.7 | 73.5 | 63.3 |
| GPT-5 mini | 87.0 | 83.1 | 78.5 | 48.9 |
| GPT-5.4 mini | 85.8 | 79.1 | 74.7 | 77.1 |
| Qwen3-VL-235B | 78.8 | 77.0 | 54.4 | 50.5 |
| UI-TARS-1.5-7B (native harness) | — | — | — | 12.6 |

### Core (912 tasks), task success rate (%)

| Model | Browser-Use | Pixel |
|---|---:|---:|
| Gemini 3 Flash | 84.5 | 60.9 |
| Opus 4.6 | — | 65.4 |
| GPT-5.4 mini | 57.8 | 37.7 |

**Headline finding:** the observation/action space matters as much as the model. Within the shared harness, GPT-5 mini moves from **83.1%** (AX-tree) to **48.9%** (Pixel) on the same tasks — and its full range including Browser-Use is 87.0%→48.9%. Human references average **2.7** normalized steps on Full and **5.2** on Core; even the fastest agent configuration is **3.7×** slower than the human references.

The mechanistic failure analysis behind these numbers — a 9-category trace-grounded failure taxonomy and **all 20 adversarially verified case studies with trace pointers** — is released in [`docs/failure_case_studies.md`](docs/failure_case_studies.md), together with the verification workflow script [`docs/case_study_workflow.js`](docs/case_study_workflow.js).

## Quickstart

### 1. Clone and install

Requires Python 3.11–3.13 and Node.js 20+.

```bash
git clone https://github.com/TianchenGuan/ComponentBench
cd ComponentBench

# Python harness
pip install -e .
playwright install chromium

# Next.js site
cd site && npm install && cd ..
```

### 2. Serve the benchmark site locally

```bash
cd site
npm run dev          # http://localhost:3002
```

Browse the task list at `http://localhost:3002`; individual tasks live at `http://localhost:3002/task/<taskId>?mode=benchmark`.

### 3. Run an agent

The fastest end-to-end path is the **agent-runner example** — one script that drives a task with an OpenAI-compatible vision model and writes results in the schema the in-site log viewer reads:

```bash
export OPENAI_API_KEY=sk-...
./examples/agent-runner/quickstart.sh \
  --task-id alert_dialog_confirm-antd-T01 \
  --model gpt-4o-mini
```

Then open `http://localhost:3002/` — when `./runs/` is non-empty the home page redirects to the log viewer, where you can step through the agent's actions, thinking, and screenshots. See [examples/agent-runner/README.md](examples/agent-runner/README.md) for other providers and troubleshooting, and [examples/minimal-runner/](examples/minimal-runner/) for a dependency-free skeleton.

For real evaluations, use the bundled harness (BrowserGym-based; modes `ax_tree`, `som`, `pixel`, `pixel_grid`, `ui_tars_native`):

```bash
# Smoke test: 2 pixel-mode tasks
python scripts/run_benchmark.py \
  --mode pixel \
  --canonical_types button \
  --libraries antd \
  --max_tasks 2

# Full v1 run
python scripts/run_benchmark.py --mode pixel --agent_config gpt --model_id gpt-5.4

# Core (v2)
python scripts/run_benchmark.py --benchmark_version v2 --mode pixel --agent_config gpt --model_id gpt-5.4
```

Results land in `results/`. The `scripts/eval_{pixel,som,axtree}.sh` wrappers set provider credentials for you (`./scripts/eval_pixel.sh gpt-5.4-mini openai --max_tasks 5`). The Browser-Use mode is a separate pipeline built on the [browser-use](https://github.com/browser-use/browser-use) library (`pip install -e ".[browser-use]"`); see `scripts/eval_browser_use.sh` and `docs/observation_modes.md`.

You can also skip the local site and target the hosted one:

```bash
python scripts/run_benchmark.py \
  --mode pixel \
  --base_url https://interfacegym.com \
  --canonical_types button --libraries antd --max_tasks 2
```

## Benchmark structure

```
ComponentBench/
├── site/                   # Next.js app — serves task pages on port 3002
├── data/
│   ├── tasks_v1/           # 97 YAMLs — Full benchmark, 2,910 tasks
│   ├── tasks_v2/           # 19 YAMLs — Core benchmark, 912 tasks
│   ├── human_traces/       # cleaned reference trajectories (v1/v2)
│   └── metadata/           # ontology, difficulty axes, templates (CSV)
├── benchmark/              # Python harness (agents/, core/, utils/)
├── configs/                # agent + benchmark + observation configs (YAML)
├── scripts/
│   ├── run_benchmark.py    # main runner
│   ├── eval_*.sh           # per-mode wrappers
│   └── validate-release.py # schema/structure checker
├── examples/               # minimal-runner/ and agent-runner/
├── schema/                 # task / result / trace JSON Schemas
└── docs/                   # methodology, protocol, data format, case studies
```

Each task YAML records the canonical component type, library implementation, natural-language goal, controlled scene context (theme, spacing, layout, placement, scale, instances, guidance, clutter), a difficulty tier/bucket with 7 axis ratings, and a **programmatic success trigger**. Success is a hidden `#cb-success-banner` element that appears only when the component reaches its target state — the harness never trusts the agent's own "done" signal.

Details: [`docs/overview.md`](docs/overview.md), [`docs/methodology.md`](docs/methodology.md), [`docs/data-format.md`](docs/data-format.md), [`docs/evaluation-protocol.md`](docs/evaluation-protocol.md), [`docs/observation_modes.md`](docs/observation_modes.md), [`docs/benchmark_versioning.md`](docs/benchmark_versioning.md).

Validate a data checkout with:

```bash
python scripts/validate-release.py --release-dir data
```

## Human reference traces & recorder

`data/human_traces/v{1,2}_reference.jsonl` hold one record per task with the cleaned best human trace (normalized steps, duration, step types). Typing is normalized — adjacent character keystrokes merge into one `type` action — so human step counts are comparable with agents that paste text in one step.

The recorder used to collect these traces ships in the site: `cd site && npm run record`, then open `http://localhost:3002/record`. See [site/README.md](site/README.md#record-human-traces).

## Results data (raw runs)

All raw per-task episodes behind the paper's tables are archived on the [Hugging Face dataset](https://huggingface.co/datasets/TianchenGuan/ComponentBench):

- **`runs/<model>/<mode>.tar`** — full episode packs: per-task `episode.json`/step logs, plus screenshots for the BrowserGym modes (AX-tree / SoM / Pixel). Covers all seven Full-suite models (e.g. `runs/gpt-5.4/pixel.tar`, `runs/Qwen3-VL-235B/v1_browser_use.tar`) and the human reference run (`runs/human0_20260312_clean/episodes.tar`).
- **`runs_lite/<model>/<mode>.tar`** — the same episodes without images/videos (JSON + text only), for cheap programmatic analysis.
- **`runs/CoreBenchmark/*.tar`** — Core (v2) runs, including `gemini3flash_browser_use_v2.tar` (the 84.5% Browser-Use run), `opus46_pixel_v2.tar`, and `gpt-5.4-mini-v2.tar`.

The 20 failure case studies in [`docs/failure_case_studies.md`](docs/failure_case_studies.md) point into these tars.

## Contributing

Issues and PRs welcome:

- Bugs in tasks, missing edge cases, schema fixes → here.
- New tasks / new templates / site features → upstream platform (file at interfacegym.com).

## Citation

```bibtex
@inproceedings{guan2026componentbench,
  title     = {ComponentBench: Diagnosing Component-Level Failures in Computer-Use Agents},
  author    = {Guan, Tianchen and Lin, Xinlei and Cheng-Yue, Royce and Wang, Xiangjun and Zhou, Shuyan},
  booktitle = {Conference on Language Modeling (COLM)},
  year      = {2026}
}
```

## License

MIT. See [`LICENSE`](LICENSE).
