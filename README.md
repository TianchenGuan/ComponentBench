# ComponentBench

**Diagnosing Component-Level Failures in Computer-Use Agents**

## Overview

ComponentBench is a diagnostic benchmark for computer-use agents that targets the "missing middle layer" between atomic GUI-grounding tests (ScreenSpot) and long-horizon workflow benchmarks (WebArena, OSWorld). It evaluates agents on individual UI component interactions -- toggling button groups, setting sliders, using date pickers -- that are short enough to diagnose specific failures but complex enough to reflect real modern web interfaces.

The benchmark includes 97 canonical UI component types organized into 14 interaction families, with 2,910 programmatically verified tasks across three React libraries (Ant Design, MUI, Mantine). Each task has controlled scene-context factors, difficulty ratings, and human reference trajectories. A distilled hard subset, **ComponentBench-Core**, provides 912 tasks for tracking frontier model progress.

ComponentBench uses a live Next.js site that renders real React components, a hidden success banner for programmatic verification, and multiple observation modes (AX-tree, Set-of-Marks, pixel screenshots, browser-use) to isolate where agents break down.

## Key Numbers

| Metric | Value |
|--------|-------|
| Canonical component types | 97 |
| Interaction families | 14 |
| Tasks (Full / Core) | 2,910 / 912 |
| UI libraries | 3 (Ant Design, MUI, Mantine) |
| Observation modes | 4 (AX-tree, Set-of-Marks, Pixel, Browser-Use) |
| Task templates | 24 |
| Human reference traces | avg 2.7 steps, median 2 |

## Quick Start

```bash
# Clone
git clone https://github.com/TianchenGuan/ComponentBench.git
cd ComponentBench

# Python dependencies
pip install -e .
playwright install chromium

# Site
cd site && npm install && npm run prebuild && npm run build
npm run dev  # http://localhost:3002

# Smoke test (dry run)
cd ..
python scripts/run_benchmark.py --mode pixel --canonical_types button --libraries antd --max_tasks 2 --dry_run
```

## Running Evaluations

Run the full benchmark or target specific slices by observation mode and model.

```bash
# GPT-5.4 (pixel mode)
python scripts/run_benchmark.py --mode pixel --agent_config gpt --model_id gpt-5.4

# Gemini (ax_tree mode)
python scripts/run_benchmark.py --mode ax_tree --agent_config gemini

# Open-weight models via vLLM (UI-TARS)
python scripts/run_benchmark.py --mode ui_tars_native --agent_config ui_tars
```

Results are written to `results/` by default. Each run produces a JSON log with per-task pass/fail, step traces, and timing information.

## Benchmark Structure

**Task YAML format.** Each task is defined by a YAML file specifying the canonical component type, UI library, scene-context factors (e.g., theme, density, disabled states), the natural-language instruction, and the expected success condition. Tasks are grouped by interaction family and difficulty.

**Observation modes.** ComponentBench supports four observation modes that control what the agent sees at each step:
- **AX-tree** -- the browser accessibility tree, serialized as text.
- **Set-of-Marks (SoM)** -- a screenshot with numbered bounding-box overlays on interactive elements.
- **Pixel** -- a raw screenshot with no annotations.
- **Browser-Use** -- the agent controls a live browser session directly.

**Programmatic verification.** Each task page contains a hidden success banner that appears only when the component reaches its target state. The harness checks for this banner after every agent action to determine pass/fail, eliminating the need for vision-based or LLM-based grading.

## Human Traces

ComponentBench includes human reference trajectories collected through a built-in recording interface at `/record` on the benchmark site. Annotators complete each task while the interface captures mouse events, keystrokes, and DOM mutations. A trace-cleaning pipeline normalizes these recordings into the same action format used by agents, enabling direct comparison of step counts and action sequences.

## Results

Headline results on ComponentBench-Core (912 tasks), reported as task success rate (%):

| Model | Browser-Use | AX-tree | SoM | Pixel |
|-------|-------------|---------|-----|-------|
| Gemini 3 Flash | 95.2 | 89.6 | 87.1 | 85.4 |
| GPT-5.4 | 90.4 | 81.5 | 77.0 | 83.8 |
| GPT-5 mini | 87.0 | 83.1 | 78.5 | 49.0 |
| UI-TARS-1.5-7B | -- | -- | -- | 12.6 |

## Citation

```bibtex
@inproceedings{componentbench2026,
  title={ComponentBench: Diagnosing Component-Level Failures in Computer-Use Agents},
  author={Anonymous},
  booktitle={COLM},
  year={2026}
}
```

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
