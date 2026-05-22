#!/usr/bin/env bash
# quickstart.sh — one-shot end-to-end smoke test for ComponentBench.
#
# What it does:
#   1. Ensures Python deps + Chromium are installed
#   2. Starts `next dev` on port 3002 (if it's not already up)
#   3. Pre-warms the chosen task page so Next has it compiled
#   4. Runs the agent on one task
#   5. Tells you the URL to open in your browser
#
# Pre-req: OPENAI_API_KEY is set in your shell.
#
# Override the task or model with env vars or args:
#   TASK_ID=button-mui-T03 MODEL=gpt-4o quickstart.sh
#   quickstart.sh --task-id table_sortable-antd-T07 --model gpt-4o-mini
#
# This script is intentionally a single readable file so you (or your coding
# agent) can adapt it without touching the rest of the repo.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")"/../.. && pwd)"
PORT="${PORT:-3002}"
TASK_ID="${TASK_ID:-alert_dialog_confirm-antd-T01}"
MODEL="${MODEL:-gpt-4o-mini}"
MAX_STEPS="${MAX_STEPS:-8}"

# Allow command-line overrides without rewriting env vars
while [[ $# -gt 0 ]]; do
  case "$1" in
    --task-id) TASK_ID="$2"; shift 2 ;;
    --model)   MODEL="$2"; shift 2 ;;
    --port)    PORT="$2"; shift 2 ;;
    --max-steps) MAX_STEPS="$2"; shift 2 ;;
    -h|--help)
      sed -n '2,18p' "${BASH_SOURCE[0]}"
      exit 0
      ;;
    *) echo "unknown arg: $1" >&2; exit 2 ;;
  esac
done

if [[ -z "${OPENAI_API_KEY:-}" ]]; then
  echo "ERROR: OPENAI_API_KEY is not set. export it before running." >&2
  exit 2
fi

echo "[quickstart] repo:    $REPO_ROOT"
echo "[quickstart] task:    $TASK_ID"
echo "[quickstart] model:   $MODEL"
echo "[quickstart] port:    $PORT"

# --- 1. Python deps -----------------------------------------------------------
PYBIN="${PYBIN:-python3}"
if ! "$PYBIN" -c "import playwright, openai, yaml" 2>/dev/null; then
  echo "[quickstart] installing python deps (openai, playwright, pyyaml)"
  "$PYBIN" -m pip install --quiet openai playwright pyyaml
  "$PYBIN" -m playwright install --with-deps chromium >/dev/null
fi

# --- 2. Start dev server if needed -------------------------------------------
DEV_STARTED_HERE=0
if curl -sSf "http://localhost:${PORT}/api/logs/runs" >/dev/null 2>&1; then
  echo "[quickstart] dev server already up on :$PORT"
else
  echo "[quickstart] starting dev server on :$PORT (npm run dev) ..."
  cd "$REPO_ROOT/site"
  [ -d node_modules ] || npm install
  npm run dev -- -p "$PORT" >/tmp/cb_quickstart_dev.log 2>&1 &
  DEV_PID=$!
  DEV_STARTED_HERE=1
  trap "kill $DEV_PID 2>/dev/null || true" EXIT

  for i in {1..120}; do
    if grep -q "Ready in" /tmp/cb_quickstart_dev.log 2>/dev/null; then
      echo "[quickstart] dev server ready after ${i}s"
      break
    fi
    sleep 2
  done
fi

# --- 3. Pre-warm the task page (Next dev compiles ~28k modules on first hit) -
CANONICAL="${TASK_ID%%-*}"
echo "[quickstart] pre-warming task page (~110s first time, instant after)"
curl -sS -o /dev/null -m 240 "http://localhost:${PORT}/task/${TASK_ID}?mode=benchmark" || true
curl -sS -o /dev/null -m 180 "http://localhost:${PORT}/api/tasks/${CANONICAL}" || true

# --- 4. Run the agent ---------------------------------------------------------
echo "[quickstart] running agent"
"$PYBIN" "$REPO_ROOT/examples/agent-runner/run.py" \
  --task-id "$TASK_ID" \
  --model "$MODEL" \
  --site-url "http://localhost:${PORT}" \
  --max-steps "$MAX_STEPS"
RC=$?

# --- 5. Tell user where to look ----------------------------------------------
echo ""
echo "[quickstart] done (exit=$RC)"
echo "Open http://localhost:${PORT}/ — the home page auto-redirects to the log"
echo "view when ./runs/ has runs. Your new run is at the top."
if [[ $DEV_STARTED_HERE -eq 1 ]]; then
  echo ""
  echo "Dev server is still running as PID $DEV_PID (started by this script)."
  echo "Stop it with: kill $DEV_PID"
fi
exit $RC
