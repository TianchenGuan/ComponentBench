# ComponentBench Overview

ComponentBench is a diagnostic benchmark for computer-use agents that operates at the **component level** of modern web UIs — the layer between atomic GUI-grounding tests (e.g. ScreenSpot) and long-horizon workflow benchmarks (e.g. WebArena, OSWorld).

A "component" task is a single, well-scoped interaction with one UI component — toggling a button group, selecting a date range, dragging an item between lists, editing a row in a data grid. Each task is short enough to be diagnostic and rich enough to reflect the burdens of real interfaces.

## Why this layer

| Benchmark layer | Examples | What it measures |
|---|---|---|
| Atomic GUI grounding | ScreenSpot, OS-Atlas | Can the agent click the right pixel? |
| **Component interactions** | **ComponentBench** | Can the agent operate a real UI control end-to-end? |
| Long-horizon workflows | WebArena, OSWorld, Mind2Web | Can the agent chain many decisions across a multi-page task? |

Long-horizon benchmarks blame "task failure" without pinpointing where the agent broke down. Atomic grounding misses the dynamics of real components (overlays, focus management, virtualized lists, drag-and-drop, modal flows). ComponentBench fills the gap.

## Scope

- **97 canonical component types** organized into **14 interaction families** (see `data/releases/<version>/metadata/canonical_components.csv`).
- **3 React component libraries** instantiate each type: Ant Design, MUI, Mantine.
- **24 task templates** combine canonical types with controlled scene-context factors.
- **2,910 tasks** in the Full benchmark (v1); **912 tasks** in the harder Core benchmark (v2).
- **Human reference trajectories** for every task, cleaned to make step counts directly comparable with agents that paste text in one step.

## What's in a task

Each YAML in `data/releases/<version>/tasks_v{1,2}/` defines:

- The canonical component type and the underlying library implementation.
- A natural-language goal (`browsergym_goal`) shown to the agent.
- Scene context: theme, density, layout, placement, scale, instances, guidance, clutter.
- Difficulty: tier (L0–L3), bucket (easy/mid/hard), and 7 axis ratings.
- Success trigger: a programmatic predicate plus human-readable description.
- Negative cases and notes.

See `schema/task.schema.json` and `docs/data-format.md` for the full structure.

## Observation modes

The benchmark is mode-agnostic — the same tasks are evaluated under different observation and action spaces:

- `ax_tree` — screenshot + accessibility tree; element-id actions.
- `som` — screenshot with set-of-mark overlay; element-id actions.
- `pixel` — screenshot only; coordinate actions.
- `pixel_grid` — screenshot with grid overlay; coordinate actions.
- `browser_use` — agent controls a live browser session via the browser-use tool.
- `ui_tars_native` — native UI-TARS pixel+coordinate format.

Switching modes can move task success by **30+ percentage points** within a single model.

## Programmatic verification

Each task page contains a hidden `#cb-success-banner` element that appears only when the component reaches its target state. The harness checks for the banner after every action. **No vision-based or LLM-based grading.**

## How to use the benchmark

```bash
# Install
git clone https://github.com/TianchenGuan/ComponentBench
cd ComponentBench
pip install -e .
playwright install chromium

# Run a quick smoke test
python scripts/run_benchmark.py --mode pixel --canonical_types button --libraries antd --max_tasks 2

# Full pixel-mode run with your model
python scripts/run_benchmark.py --mode pixel --agent_config gpt --model_id gpt-5.4
```

See `examples/minimal-runner/` for a hand-rolled runner that doesn't depend on the bundled harness.

## Where the website lives

The interactive benchmark site at https://www.interfacegym.com (which also serves componentbench.com) is **not** in this repository — it lives in the private InterfaceGym monorepo. This repository contains the static benchmark artifact: task specs, schemas, runner code, and published results.
