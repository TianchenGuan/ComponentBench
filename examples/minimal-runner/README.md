# Minimal Runner

A bare-bones example that walks one ComponentBench task end-to-end without any of the bundled benchmark harness. Useful for understanding the contract.

## What it does

1. Reads a task spec from `data/releases/<version>/tasks_v1/<canonical_type>.yaml`.
2. Loads a single task by `id`.
3. Opens a Playwright browser at `https://www.interfacegym.com/task/<task_id>?mode=benchmark`.
4. Asks your model (placeholder hook) to pick one click coordinate.
5. Clicks it, then polls for `#cb-success-banner` to determine pass/fail.
6. Writes a result row matching `schema/result.schema.json`.

## Run it

```bash
pip install playwright pyyaml
playwright install chromium

python run.py --task-id button-antd-T01 --version 0.5.0 --site-url https://www.interfacegym.com
```

The model hook in `run.py` returns a hardcoded coordinate by default; replace it with your model's response parser to see real evaluation.

## Files

- `run.py` — the runner.
- `README.md` — this file.

## Caveats

- The minimal runner is for clarity, not throughput. For real runs use `scripts/run_benchmark.py` in the repository root.
- It hits the public site by default. For local self-hosted runs, point `--site-url` at your own Next.js dev server on port 3002.
- The model hook is a placeholder; success will be coincidental until you wire in a real model.
