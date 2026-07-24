# ComponentBench site

The Next.js app that serves every ComponentBench task page locally on port 3002. Agents (and humans) interact with real Ant Design / MUI / Mantine components; task success is signaled programmatically in the DOM.

## Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Open http://localhost:3002
```

## Record human traces

Help collect human reference trajectories for the **278-task benchmark subset**. This runs entirely on your own laptop (Windows or Mac) — no cloud account, no Python, nothing to configure.

**Prerequisite:** [Node.js](https://nodejs.org) version 20 or newer. That's it.

1. Install dependencies (first time only):
   ```bash
   npm install
   ```
2. Start the recorder:
   ```bash
   npm run record
   ```
3. Open **http://localhost:3002/record** in your browser.
4. Enter a Run ID (e.g. `human_yourname`) and click **Start / Resume Run**. Leave the task field empty to record the full 278-task subset.
5. For each task: read the instruction at the top of the page and complete it. Every task is recorded twice — first a **cold** attempt (no prior knowledge), then a **warm** attempt — and the flow advances automatically. Click **Pause** to stop anytime; resume later by entering the same Run ID.

**Where your traces are saved:** `site/human-traces/<your-run-id>/`. When you finish, zip that folder and send it back:
- **macOS:** right-click the `human-traces` folder → **Compress**.
- **Windows:** right-click the `human-traces` folder → **Send to → Compressed (zipped) folder**.

**Notes**
- Always use `npm run record` (not `npm run build` / `npm start`) — recording is intentionally disabled in production builds, so the other commands will show "recording disabled".
- The same command works identically on Windows and Mac.
- If port 3002 is already in use, edit the `record` script in `site/package.json` and change `-p 3002` to another port (the page works on any port).

## Overview

The site renders all **97 canonical component types** across **14 interaction families**, each implemented in up to three UI libraries (Ant Design, Material UI, Mantine). Task specs live in the repo's `data/tasks_v1/` (Full, 2,910 tasks) and `data/tasks_v2/` (Core, 912 tasks); the site indexes them at build time via `scripts/generate-task-index.mjs` (run automatically by `predev`/`prebuild`).

The full ontology (families, types, per-library implementations) is in [`src/ontology/ontology.ts`](src/ontology/ontology.ts) and mirrored in `../data/metadata/canonical_components.csv`.

## Factor System

Tasks vary along 8 scene-context factors:

| Factor | Values |
|--------|--------|
| E1: Theme | light, dark, high_contrast |
| E2: Spacing | comfortable, compact |
| E3: Layout | isolated_card, form_section, settings_panel, dashboard, table_cell, modal_flow, drawer_flow, … |
| E4: Placement | center, top_left, top_right, bottom_left, bottom_right, off_center |
| E5: Scale | default, small, large |
| E6: Instances | 1, 2, 3, 4+ |
| E7: Guidance | text, visual, mixed |
| E8: Clutter | none, low, medium, high |

## Benchmark versions

The `bench` query parameter selects the benchmark version (`?bench=v1` default, `?bench=v2` for Core); the header includes a V1/V2 toggle. See [`../docs/benchmark_versioning.md`](../docs/benchmark_versioning.md).

## View Modes

- **Presentation mode** (default): full UI with navigation header, goal display, and expandable task details. For demos and manual browsing.
- **Benchmark mode** (`?mode=benchmark`): clean UI with only the component rendered. Use this for agent evaluation — e.g. `http://localhost:3002/task/button-antd-T01?mode=benchmark`.

## Running Benchmarks

```bash
# Terminal 1: Start the site in production mode
export BENCHMARK_BUILD=1
npm run build
PORT=3002 npm run start

# Terminal 2: Run a smoke test (2 tasks) from the repo root
cd ..
python scripts/run_benchmark.py \
  --mode pixel \
  --canonical_types button \
  --libraries antd \
  --max_tasks 2 \
  --base_url http://127.0.0.1:3002
```

`npm run dev` also works for evaluation, but the first request to each task page pays a dev-mode compile cost (~1–2 min); production mode avoids that.

## Success Signaling

When a task is completed, the system signals success via:

1. `document.documentElement.dataset.taskDone = "true"`
2. `window.__COMPONENT_BENCH_TASK_DONE__ = true`
3. CustomEvent `componentbench:task-success` with `{ detail: { taskId } }`
4. Visual success banner with `id="cb-success-banner"` (detectable via `document.querySelector('#cb-success-banner')`)

The harness treats the DOM banner as the only ground truth (never the agent's self-report).

## Benchmark Integrity

ComponentBench implements measures to prevent DOM-based agent cheating:

### API Sanitization

The `/api/tasks/[canonicalType]` endpoint returns sanitized task specs by default:
- Stripped fields: `success_trigger`, `negative_cases`, `expected_interaction_path`, `notes`
- These fields contain answer-key information that agents should not access

For local debugging, set the environment variable to get full specs:
```bash
COMPONENTBENCH_FULL_SPECS=1 npm run dev
```

### Data Attribute Stripping

Production builds automatically strip semantic `data-*` attributes:
- `data-testid`
- `data-task-id`
- `data-canonical-type`
- `data-library`
- `data-view-mode`
- `data-reference-id`

Preserved attributes: `id`, `data-cb`, all `aria-*` attributes.

## Performance

Task runners are loaded dynamically using `next/dynamic` with code-splitting by canonical type, so only the runner needed for the current task is loaded. The `RunnerMap` in `app/task/[taskId]/page.tsx` maps canonical types to dynamically imported runner components with `{ ssr: false }`.

## Project Structure

```
site/
├── app/
│   ├── api/tasks/[canonicalType]/route.ts  # Sanitized task API
│   ├── api/logs/                           # Local log-viewer API
│   ├── api/record/                         # Human-trace recorder API
│   ├── record/                             # Recorder UI
│   ├── task/[taskId]/page.tsx              # Task execution page
│   └── page.tsx                            # Dashboard / task list
├── scripts/generate-task-index.mjs         # Build-time task index
└── src/
    ├── ontology/ontology.ts                # 14 families, 97 components
    ├── registry/                           # Task loading/filtering
    ├── runners/                            # Per-component task runners
    └── utils/finishTask.ts                 # Success signaling
```

## License

MIT
