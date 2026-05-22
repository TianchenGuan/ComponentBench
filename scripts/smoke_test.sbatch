#!/bin/bash
#SBATCH --job-name=cb_smoke
#SBATCH --partition=compsci
#SBATCH --time=01:30:00
#SBATCH --mem=32G
#SBATCH --cpus-per-task=8
#SBATCH --output=%x-%j.out
#SBATCH --error=%x-%j.err

set -euo pipefail

REPO=$HOME/projects/ComponentBench
SITE=$REPO/site
VENV=$REPO/.venv
PORT=3007
TASK_ID=${TASK_ID:-alert_dialog_confirm-antd-T01}
MODEL=${MODEL:-gpt-5.4-mini}

echo "[smoke] node=$(hostname) port=$PORT task=$TASK_ID model=$MODEL"

# Source OpenAI key from chmod-600 file (not committed)
if [ -f "$HOME/.config/openai.env" ]; then
  set -a; . "$HOME/.config/openai.env"; set +a
else
  echo "ERROR: $HOME/.config/openai.env not found" >&2
  exit 2
fi
[ -n "${OPENAI_API_KEY:-}" ] || { echo "OPENAI_API_KEY not set" >&2; exit 2; }

# Ensure Node from nvm is on PATH
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 22 2>/dev/null || true
echo "[smoke] node=$(node -v) npm=$(npm -v)"

# Per-user npm cache to avoid NFS EEXIST/ENOENT races
NPM_CACHE=/tmp/npm-cache-$USER
mkdir -p "$NPM_CACHE"
export npm_config_cache="$NPM_CACHE"

cd "$SITE"
# Use an isolated dist dir on local /tmp so we don't clash with any other dev
# server already holding .next on NFS.
export NEXT_DIST_DIR="/tmp/cb-smoke-next-${SLURM_JOB_ID:-$$}"
mkdir -p "$NEXT_DIST_DIR"
echo "[smoke] NEXT_DIST_DIR=$NEXT_DIST_DIR"

NEXT_LOG="/tmp/cb_smoke_next_${SLURM_JOB_ID:-$$}.log"
echo "[smoke] starting Next dev server on :$PORT (log: $NEXT_LOG)"
WATCHPACK_POLLING=true npm run dev -- -p $PORT > "$NEXT_LOG" 2>&1 &
DEV_PID=$!
echo "[smoke] dev server PID=$DEV_PID"
trap "kill $DEV_PID 2>/dev/null || true" EXIT

echo "[smoke] waiting for 'Ready in' line in dev server log..."
READY=0
for i in $(seq 1 120); do
  if grep -q "Ready in" "$NEXT_LOG" 2>/dev/null; then
    READY=1
    echo "[smoke] dev server reported ready after ${i}s"
    break
  fi
  sleep 2
done

if [ "$READY" != "1" ]; then
  echo "[smoke] FAILED: dev server did not report 'Ready in' within 240s"
  tail -80 "$NEXT_LOG" || true
  exit 3
fi

echo "[smoke] /api/logs/runs response (verbose):"
curl -sS -i -m 30 "http://localhost:$PORT/api/logs/runs" | head -20 || true
echo
echo "[smoke] /api/logs/runs body only:"
curl -sS -m 30 "http://localhost:$PORT/api/logs/runs" || true
echo

CANONICAL=${TASK_ID%%-*}
echo "[smoke] pre-warming routes Next dev will need (cold compile ~110s task page + ~60s tasks API)"
curl -sS -o /dev/null -m 240 -w "  /task/[taskId] page status=%{http_code} %{time_total}s\n" \
  "http://localhost:$PORT/task/${TASK_ID}?mode=benchmark" || true
curl -sS -o /dev/null -m 180 -w "  /api/tasks/${CANONICAL} status=%{http_code} %{time_total}s\n" \
  "http://localhost:$PORT/api/tasks/${CANONICAL}" || true

echo "[smoke] --- dev server log tail after warmup ---"
tail -60 "$NEXT_LOG" || true
echo "[smoke] --- end ---"

echo "[smoke] running agent: $TASK_ID against $MODEL"
"$VENV/bin/python" "$REPO/examples/agent-runner/run.py" \
  --task-id "$TASK_ID" \
  --model "$MODEL" \
  --site-url "http://localhost:$PORT" \
  --max-steps 8 \
  --mode-name pixel \
  || AGENT_RC=$?
AGENT_RC=${AGENT_RC:-0}
echo "[smoke] agent exit=$AGENT_RC"

echo "[smoke] /api/logs/runs after run:"
curl -s "http://localhost:$PORT/api/logs/runs" | head -200
echo

echo "[smoke] runs/ tree:"
ls -la "$REPO/runs/" 2>/dev/null || echo "  (no runs/ dir)"

echo "[smoke] cleaning up isolated dist dir $NEXT_DIST_DIR"
rm -rf "$NEXT_DIST_DIR" || true

echo "[smoke] done (agent_rc=$AGENT_RC)"
exit $AGENT_RC
