# ComponentBench

**Diagnosing Component-Level Failures in Computer-Use Agents.**

ComponentBench is a diagnostic benchmark for computer-use agents at the layer between atomic GUI grounding and long-horizon workflows. It evaluates agents on isolated interactions with real React UI components — toggling button groups, setting sliders, using date pickers, editing data grids — that are short enough to pinpoint failures and rich enough to reflect modern web interfaces.

- **Website:** https://www.interfacegym.com — interactive benchmark, log viewer, task browser.
- **Paper:** *ComponentBench: Diagnosing Component-Level Failures in Computer-Use Agents* (COLM 2026 under review).
- **Dataset on HuggingFace:** https://huggingface.co/datasets/TianchenGuan/ComponentBench

## What this repository is

This is the **public benchmark artifact repository** — it contains released benchmark data, schemas, documentation, runner code, and public results.

The interactive site that runs benchmark tasks in a browser is **not** in this repository. It lives in the private InterfaceGym monorepo and is deployed at `componentbench.com`. See [`docs/release-boundary.md`](docs/release-boundary.md) for what stays here vs. upstream.

## Headline numbers

| Metric | Value |
|---|---:|
| Canonical UI component types | **97** |
| Interaction families | 14 |
| Tasks (Full / Core) | **2,910 / 912** |
| UI libraries | Ant Design, MUI, Mantine |
| Observation modes evaluated | AX-tree, SoM, Pixel, Browser-Use |
| Task templates | 24 |
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
├── docs/
│   ├── overview.md
│   ├── methodology.md
│   ├── evaluation-protocol.md
│   ├── data-format.md
│   ├── release-boundary.md
│   └── ... (existing runbooks)
├── schema/
│   ├── task.schema.json
│   ├── result.schema.json
│   └── trace.schema.json
├── data/
│   └── releases/
│       └── 0.5.0/
│           ├── tasks_v1/    # 97 YAMLs (Full benchmark)
│           ├── tasks_v2/    # 19 YAMLs (Core benchmark)
│           ├── human_traces/
│           └── metadata/
├── benchmark/              # Python harness (agents/, core/, utils/)
├── configs/                # Agent + benchmark configs (YAML)
├── scripts/
│   ├── run_benchmark.py    # main runner
│   ├── validate-release.py # schema/structure checker
│   ├── eval_*.sh           # per-mode wrappers
│   ├── slurm/              # cluster scripts
│   ├── browser_use/        # browser-use baseline
│   └── logpack/            # log archival
├── examples/
│   └── minimal-runner/     # no-dependency example
├── results/public/         # published model results
├── tests/
└── archive/                # internal-only material moved here during repo reconstruction; do not depend on it
```

## Quick start

```bash
git clone https://github.com/TianchenGuan/ComponentBench
cd ComponentBench
pip install -e .
playwright install chromium

# Smoke test (requires running benchmark site at http://localhost:3002 — see Website setup below)
python scripts/run_benchmark.py \
  --mode pixel \
  --canonical_types button \
  --libraries antd \
  --max_tasks 2

# Full v1 run with your model
python scripts/run_benchmark.py --mode pixel --agent_config gpt --model_id gpt-5.4

# v2 (Core)
python scripts/run_benchmark.py --benchmark_version v2 --mode pixel ...
```

Results go to `results/`; structure them as `results/public/<model>-<mode>-<version>.json` (conforming to `schema/result.schema.json`) when you're ready to publish.

## Website setup

The benchmark site is not in this repository. To self-host the site for local evaluation:

- **Easiest:** point at the public site, `https://www.interfacegym.com`. Task URLs follow `https://www.interfacegym.com/task/<taskId>?mode=benchmark`. Be polite about request rates.
- **Self-hosted:** clone the private InterfaceGym repo and run `apps/componentbench-web` on port 3002. Or build a stripped public bundle from that source with the `BENCHMARK_BUILD=1` env var, which disables the log viewer.

We are working on shipping a self-contained public site bundle from a future release. Until then, use the public hosted site or run the private InterfaceGym fork.

## Schemas

See `schema/task.schema.json`, `schema/result.schema.json`, `schema/trace.schema.json`. Validate a release with:

```bash
python scripts/validate-release.py --version 0.5.0
```

## Documentation

| Doc | Purpose |
|---|---|
| [`docs/overview.md`](docs/overview.md) | What the benchmark is and why this layer matters |
| [`docs/methodology.md`](docs/methodology.md) | How tasks, difficulty axes, and human traces were built |
| [`docs/evaluation-protocol.md`](docs/evaluation-protocol.md) | How to run and what to report |
| [`docs/data-format.md`](docs/data-format.md) | On-disk shape of a release |
| [`docs/release-boundary.md`](docs/release-boundary.md) | Public ↔ private repo boundary |

## Contributing

Issues and PRs welcome. See [`docs/release-boundary.md`](docs/release-boundary.md) for what's appropriate here vs. upstream:

- Bugs in tasks, missing edge cases, schema fixes → here.
- Site bugs, Task Lab issues, log viewer fixes → upstream (file at the interfacegym.com contact).
- New tasks / new templates → upstream (they're authored in the Task Lab).

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

See `CITATION.cff` for the machine-readable form.
