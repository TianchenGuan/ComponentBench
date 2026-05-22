# agent-runner — drive ComponentBench tasks with a vision LLM

A minimal Python script that:

1. Boots Playwright Chromium against the running ComponentBench site
2. Asks an OpenAI vision model (default `gpt-4o-mini`, override with `--model`) for a click/type/scroll action on each screenshot
3. Saves screenshots + reasoning + the success/fail verdict to `./runs/<run-id>/` in
   the same on-disk schema the site's log viewer reads (so the run shows up
   automatically at `http://localhost:3002/?mode=log&bench=v1`)

You can adapt this script to any agent stack — it's just one file, deliberately
short, with no harness or framework around it.

## Quickstart

```bash
# 1. From the repo root, install Python deps once
python -m venv .venv && . .venv/bin/activate
pip install openai playwright pyyaml huggingface_hub
playwright install chromium

# 2. In one shell, start the site
cd site
npm install
npm run dev                          # serves on http://localhost:3002

# 3. In another shell, set your key and run the agent
export OPENAI_API_KEY=sk-...
python examples/agent-runner/run.py \
  --task-id alert_dialog_confirm-antd-T01 \
  --model gpt-4o-mini

# 4. Open http://localhost:3002 — runs are auto-discovered and shown by the
#    log viewer. The home page redirects to the logs view when ./runs/ is
#    non-empty.
```

## What the script writes

```
runs/<run-id>/
├── manifest.json                              # run-level summary
└── runs/<run-id>/<mode>/<task-id>/
    ├── episode.json                           # step list, success, model, etc.
    ├── step_000.png                           # screenshot before each action
    ├── step_001.png
    └── ...
```

Schema details live in [`site/src/lib/logLocalBackend.ts`](../../site/src/lib/logLocalBackend.ts).

## Using a different model or provider

`run.py` uses the OpenAI chat-completions API with vision (`image_url` content
blocks). To use Anthropic / Google / a local model:

- For Anthropic/Vertex/Bedrock: the response shape is the same; swap the SDK
  call in `call_model()` and decode image content the right way for that SDK.
- For local models served over an OpenAI-compatible endpoint (vLLM, LM Studio,
  Ollama with the OpenAI adapter): set `OPENAI_BASE_URL=http://localhost:8000/v1`
  and keep using `run.py` unchanged.

## What success means

Each task YAML has a `success_trigger.canonical_predicate.target_state`. The
runner polls `window.__cbDialogState` (and similar instrumentation hooks; see
the task spec) after each action; when every key in `target_state` matches, the
episode terminates with `success=True, termination_reason=predicate_matched`.

If you hit `max_steps` without matching the predicate, the episode terminates
with `success=False, termination_reason=max_steps`.

## Common gotchas

- **First request to a task page is slow** in Next dev mode (the React component
  tree for the runner has ~28k modules; first compile ~110s). The script waits
  up to 120s for the page to leave the "Loading task..." state, but if your dev
  server has never served that task before, the first run may time out.
  Warm it up: `curl http://localhost:3002/task/<task-id>?mode=benchmark`.
- **`OPENAI_API_KEY` not set**: the script exits with code 2.
- **No `runs/` showing in the viewer**: confirm `runs/<run-id>/manifest.json`
  exists and that `BENCHMARK_BUILD` is not set in the dev server's env (it's
  the only flag that disables `/api/logs/*`).
