# ComponentBench

**Diagnosing Component-Level Failures in Computer-Use Agents.**

ComponentBench is a diagnostic benchmark for computer-use agents at the layer between atomic GUI grounding and long-horizon workflows. It evaluates agents on isolated interactions with real React UI components — toggling button groups, setting sliders, using date pickers, editing data grids — that are short enough to pinpoint failures and rich enough to reflect modern web interfaces.

- **Hosted website (full version):** https://www.interfacegym.com / https://componentbench.com
- **Paper:** *ComponentBench: Diagnosing Component-Level Failures in Computer-Use Agents* (COLM 2026 under review)
- **Dataset on HuggingFace:** https://huggingface.co/datasets/TianchenGuan/ComponentBench

## What this repository is

A **public, reproducible benchmark repo**. Clone it and you have everything needed to:

1. **Serve the benchmark site locally** — a minimal Next.js app that renders every task page on `http://localhost:3002`.
2. **Run the Python benchmark harness** against the local site (or against the public hosted site).
3. **Inspect the data and schemas** — every task YAML, the human reference trajectories, the ontology, and the JSON schemas they conform to.

This is the *simple* public version. The full platform (with Task Lab task generation, log viewer, recording UI, Supabase backend) deploys componentbench.com and is **not** in this repo.

## Headline numbers

| Metric | Value |
|---|---:|
| Canonical UI component types | **97** |
| Interaction families | 14 |
| Tasks (Full / Core) | **2,910 / 912** |
| UI libraries | Ant Design, MUI, Mantine |
| Observation modes evaluated | AX-tree, SoM, Pixel, Browser-Use |
| Human reference traces | avg 2.7 steps on v1; 5.2 on v2 |

### Results on Core (912 tasks), task success rate (%)

| Model | Browser-Use | AX-tree | SoM | Pixel |
|---|---:|---:|---:|---:|
| Gemini 3 Flash | 95.2 | 89.6 | 87.1 | 85.4 |
| GPT-5.4 | 90.4 | 81.5 | 77.0 | 83.8 |
| GPT-5 mini | 87.0 | 83.1 | 78.5 | 49.0 |
| UI-TARS-1.5-7B | — | — | — | 12.6 |

Switching observation/action space can shift a single model's success rate by **30+ percentage points** — GPT-5 mini moves from 87.0% (Browser-Use) to 49.0% (pixel-only).

## Repository layout

```
ComponentBench/
├── README.md
├── LICENSE
├── CITATION.cff
├── pyproject.toml
├── site/                   # Next.js app — serves task pages on port 3002
│   ├── app/
│   ├── src/
│   ├── public/
│   ├── scripts/generate-task-index.mjs
│   └── package.json
├── data/
│   ├── tasks_v1/           # 97 YAMLs — Full benchmark, 2,910 tasks
│   ├── tasks_v2/           # 19 YAMLs — Core benchmark, 912 tasks
│   ├── human_traces/       # cleaned reference trajectories
│   └── metadata/           # ontology, axes, templates CSVs
├── benchmark/              # Python harness (agents/, core/, utils/)
├── configs/                # Agent + benchmark configs (YAML)
├── scripts/
│   ├── run_benchmark.py    # main runner
│   ├── validate-release.py # schema/structure checker
│   └── eval_*.sh           # per-mode wrappers
├── examples/minimal-runner/
├── schema/                 # task.schema.json, result.schema.json, trace.schema.json
├── docs/                   # overview, methodology, evaluation-protocol, data-format
└── tests/
```

## Quick start

### 1. Clone and install

```bash
git clone https://github.com/TianchenGuan/ComponentBench
cd ComponentBench

# Python harness
pip install -e .
playwright install chromium

# Next.js site
cd site
npm install
cd ..
```

### 2. Run the benchmark site locally

```bash
cd site
npm run dev          # serves on http://localhost:3002
```

Open `http://localhost:3002` to browse the task list. Individual tasks live at `http://localhost:3002/task/<taskId>?mode=benchmark`.

### 3. Run an agent against the local site

In a second terminal:

```bash
# Smoke test with browser-use mode
python scripts/run_benchmark.py \
  --mode browser_use \
  --canonical_types button \
  --libraries antd \
  --max_tasks 2

# Full v1 run
python scripts/run_benchmark.py --mode pixel --agent_config gpt --model_id gpt-5.4

# v2 (Core)
python scripts/run_benchmark.py --benchmark_version v2 --mode pixel ...
```

Results land in `results/`.

### 4. Or skip the local site and target the hosted one

```bash
python scripts/run_benchmark.py \
  --mode pixel \
  --base_url https://www.interfacegym.com \
  --canonical_types button --libraries antd --max_tasks 2
```

## Running on a Slurm cluster

The site and the runner are light enough for a single compute node:

```bash
salloc -p compsci --time=4:00:00 --mem=16G --cpus-per-task=4
# on the allocated node:
cd ~/projects/ComponentBench/site
npm install            # first time
npm run dev &          # serves on http://localhost:3002

# In the same shell (or another, after sourcing the venv):
cd ~/projects/ComponentBench
python scripts/run_benchmark.py --mode pixel --canonical_types button --max_tasks 2
```

To browse the local site from your laptop, SSH-forward port 3002:

```bash
# replace NODE with the hostname salloc gave you (e.g. compsci-cluster-fitz-42):
ssh -J tg295@login.cs.duke.edu -L 3002:NODE:3002 tg295@NODE
# then open http://localhost:3002 in your local browser
```

## Schemas + validation

```bash
python scripts/validate-release.py --release-dir data
```

The three JSON Schemas in `schema/` describe the structure of:

- `task.schema.json` — a single benchmark task
- `result.schema.json` — one row of agent results
- `trace.schema.json` — a human or agent trajectory

## Documentation

| Doc | Purpose |
|---|---|
| [`docs/overview.md`](docs/overview.md) | What the benchmark is and why this layer matters |
| [`docs/methodology.md`](docs/methodology.md) | How tasks, difficulty axes, and human traces were built |
| [`docs/evaluation-protocol.md`](docs/evaluation-protocol.md) | How to run and what to report |
| [`docs/data-format.md`](docs/data-format.md) | On-disk shape of `data/` |
| [`docs/observation_modes.md`](docs/observation_modes.md) | The four observation/action modes |
| [`docs/benchmark_versioning.md`](docs/benchmark_versioning.md) | v1 vs v2 split |

## Contributing

Issues and PRs welcome:

- Bugs in tasks, missing edge cases, schema fixes → here.
- New tasks / new templates / Task Lab / site features → upstream platform (file at `interfacegym.com`).

## License

MIT. See `LICENSE`.

## Citation

```bibtex
@inproceedings{componentbench2026,
  title={ComponentBench: Diagnosing Component-Level Failures in Computer-Use Agents},
  author={Anonymous},
  booktitle={COLM},
  year={2026}
}
```
