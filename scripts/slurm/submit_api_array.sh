#!/bin/bash
# ==============================================================================
# ComponentBench: Array-job for API-based models (CPU only, 20 shards)
# ==============================================================================
# Same as submit_api.sh but runs 20 parallel shards via SLURM job arrays.
# Each shard builds its own isolated site copy to avoid corruption.
# Results go to shard_N subdirectories under the mode directory.
#
# Usage examples:
#
#   # GPT via OpenAI API (20 shards)
#   RUN_ID=gpt54_pixel_$(date +%Y%m%d) AGENT_CONFIG=gpt \
#       sbatch scripts/slurm/submit_api_array.sh
#
#   # Gemini via Google API
#   RUN_ID=gemini_pixel_$(date +%Y%m%d) AGENT_CONFIG=gemini \
#       MODEL_ID=gemini-3.1-flash-lite-preview \
#       sbatch scripts/slurm/submit_api_array.sh
#
#   # Claude via OpenRouter
#   RUN_ID=opus46_pixel_$(date +%Y%m%d) AGENT_CONFIG=openrouter \
#       MODEL_ID=anthropic/claude-opus-4.6 \
#       sbatch scripts/slurm/submit_api_array.sh
#
#   # Fewer shards
#   RUN_ID=gpt54_pixel_$(date +%Y%m%d) NUM_SHARDS=10 \
#       sbatch --array=0-9 scripts/slurm/submit_api_array.sh
#
#   # Smoke test (1 shard, 10 tasks)
#   RUN_ID=smoke_test MAX_TASKS=10 \
#       sbatch --array=0 scripts/slurm/submit_api_array.sh
#
# Environment:
#   RUN_ID              — Experiment identifier (REQUIRED)
#   AGENT_CONFIG        — Config name: gpt, gemini, openrouter, claude, etc.
#                         (default: gpt). Maps to config/agent/<name>.yaml
#   MODEL_ID            — Model name passed to the agent (default: from config)
#   BENCHMARK_MODE      — pixel, ax_tree, set_of_marks, browser_use (default: pixel)
#   BENCHMARK_VERSION   — v1 or v2 (default: v1)
#   MAX_STEPS           — Steps per task (default: 20)
#   MAX_TASK_WALLTIME   — Per-task timeout seconds (default: 600)
#   MAX_TASKS           — Smoke-test limit; 0 = all (default: 0)
#   NUM_SHARDS          — Override shard count (default: 20, must match --array)
#   SHARD_STRATEGY      — stride or block (default: stride)
# ==============================================================================

#SBATCH --job-name=cb_api_arr
#SBATCH --array=0-19
#SBATCH --nodes=1
#SBATCH --cpus-per-task=8
#SBATCH --mem=64G
#SBATCH --time=7-00:00:00
#SBATCH --output=/usr/project/xtmp/%u/slurm-cb-api-array-%A_%a.out
#SBATCH --error=/usr/project/xtmp/%u/slurm-cb-api-array-%A_%a.err

set -euo pipefail

# ==============================================================================
# Configuration
# ==============================================================================

PROJECT_DIR="${PROJECT_DIR:-/home/users/${USER}/projects/ComponentBench}"
PLAYWRIGHT_BROWSERS_DIR="/usr/project/xtmp/${USER}/playwright-browsers"

: "${RUN_ID:?ERROR: RUN_ID not set. Example: RUN_ID=gpt54_pixel_20260401 sbatch scripts/slurm/submit_api_array.sh}"
AGENT_CONFIG="${AGENT_CONFIG:-gpt}"
MODEL_ID="${MODEL_ID:-}"
BENCHMARK_MODE="${BENCHMARK_MODE:-pixel}"
BENCHMARK_VERSION="${BENCHMARK_VERSION:-v1}"
MAX_STEPS="${MAX_STEPS:-20}"
MAX_TASK_WALLTIME="${MAX_TASK_WALLTIME:-600}"
MAX_TASKS="${MAX_TASKS:-0}"
SHARD_STRATEGY="${SHARD_STRATEGY:-stride}"

SHARD_ID="${SLURM_ARRAY_TASK_ID:-0}"
NUM_SHARDS="${NUM_SHARDS:-20}"

RUN_ROOT="/usr/project/xtmp/${USER}/componentbench-runs/${RUN_ID}"
MODE_ROOT="${RUN_ROOT}/${BENCHMARK_MODE}"
RESULTS_DIR="${MODE_ROOT}/shard_${SHARD_ID}"
LOGS_DIR="${RUN_ROOT}/logs/${BENCHMARK_MODE}/shard_${SHARD_ID}"
SITE_BUILD_DIR="${RUN_ROOT}/site_build_${BENCHMARK_MODE}_${SLURM_JOB_ID:-$$}_shard_${SHARD_ID}"
SITE_DIR="${SITE_BUILD_DIR}/site"

NEXTJS_PORT=$(( 3100 + (${SLURM_JOB_ID:-$$} % 1000) ))

# ==============================================================================
# Cleanup
# ==============================================================================

NEXTJS_PID=""
cleanup() {
    echo ""
    echo "=== Shard ${SHARD_ID}: Cleaning up ==="
    if [ -n "$NEXTJS_PID" ]; then
        kill "$NEXTJS_PID" 2>/dev/null || true
        sleep 1
        kill -9 "$NEXTJS_PID" 2>/dev/null || true
    fi
    fuser -k "${NEXTJS_PORT}/tcp" 2>/dev/null || true
    [ -n "${SITE_BUILD_DIR}" ] && [ -d "${SITE_BUILD_DIR}" ] && rm -rf "${SITE_BUILD_DIR}"
    echo "Cleanup complete."
}
trap cleanup EXIT INT TERM

# ==============================================================================
# Main
# ==============================================================================

echo "=============================================="
echo "ComponentBench ${BENCHMARK_MODE} — API array (${AGENT_CONFIG})"
echo "=============================================="
echo "Job:       ${SLURM_ARRAY_JOB_ID:-?}_${SLURM_ARRAY_TASK_ID:-?} (subjob ${SLURM_JOB_ID:-local})"
echo "Node:      $(hostname)"
echo "Config:    ${AGENT_CONFIG}"
echo "Model:     ${MODEL_ID:-<from config>}"
echo "Mode:      ${BENCHMARK_MODE}"
echo "Version:   ${BENCHMARK_VERSION}"
echo "Shard:     ${SHARD_ID}/${NUM_SHARDS}"
echo "Run ID:    ${RUN_ID}"
echo "Results:   ${RESULTS_DIR}"
echo "Time:      $(date)"
echo ""

# --- Step 1: Credentials ---
echo "[1/5] Loading credentials..."
for secrets_file in \
    "${HOME}/.secrets/openai.env" \
    "${HOME}/.secrets/google.env" \
    "${HOME}/.secrets/openrouter.env" \
    "${HOME}/.secrets/anthropic.env"; do
    if [ -f "$secrets_file" ]; then
        set -a; source "$secrets_file"; set +a
        echo "  Loaded ${secrets_file}"
    fi
done

# Set VLLM_BASE_URL and VLLM_API_KEY based on agent config (if not already set)
if [ -z "${VLLM_BASE_URL:-}" ]; then
    case "${AGENT_CONFIG}" in
        gpt|openai|openai_direct)
            if [ -z "${OPENAI_API_KEY:-}" ]; then
                echo "ERROR: OPENAI_API_KEY not set. Create ~/.secrets/openai.env"; exit 1
            fi
            export VLLM_BASE_URL="https://api.openai.com/v1"
            export VLLM_API_KEY="${OPENAI_API_KEY}"
            ;;
        gemini|gemini_api)
            if [ -z "${GOOGLE_API_KEY:-}" ]; then
                echo "ERROR: GOOGLE_API_KEY not set. Create ~/.secrets/google.env"; exit 1
            fi
            export VLLM_BASE_URL="https://generativelanguage.googleapis.com/v1beta/openai/"
            export VLLM_API_KEY="${GOOGLE_API_KEY}"
            ;;
        openrouter|openrouter_generic|openrouter_gpt)
            if [ -z "${OPENROUTER_API_KEY:-}" ]; then
                echo "ERROR: OPENROUTER_API_KEY not set. Create ~/.secrets/openrouter.env"; exit 1
            fi
            export VLLM_BASE_URL="${OPENROUTER_BASE_URL:-https://openrouter.ai/api/v1}"
            export VLLM_API_KEY="${OPENROUTER_API_KEY}"
            ;;
        claude|anthropic)
            if [ -z "${ANTHROPIC_API_KEY:-}" ]; then
                echo "ERROR: ANTHROPIC_API_KEY not set. Create ~/.secrets/anthropic.env"; exit 1
            fi
            export VLLM_BASE_URL="https://api.anthropic.com/v1"
            export VLLM_API_KEY="${ANTHROPIC_API_KEY}"
            ;;
        *)
            echo "WARNING: Unknown agent config '${AGENT_CONFIG}'. Expecting VLLM_BASE_URL and VLLM_API_KEY to be set."
            if [ -z "${VLLM_API_KEY:-}" ]; then
                echo "ERROR: VLLM_API_KEY not set for custom agent config '${AGENT_CONFIG}'"; exit 1
            fi
            ;;
    esac
fi
echo "  VLLM_BASE_URL=${VLLM_BASE_URL}"
echo ""

# --- Step 2: Environment ---
echo "[2/5] Setting up environment..."
mkdir -p "${RESULTS_DIR}" "${LOGS_DIR}"

export PLAYWRIGHT_BROWSERS_PATH="${PLAYWRIGHT_BROWSERS_DIR}"
export TMPDIR="/usr/project/xtmp/${USER}/cb_api_${SLURM_JOB_ID:-$$}_${BENCHMARK_MODE}_shard_${SHARD_ID}"
mkdir -p "${TMPDIR}"
export npm_config_cache="${TMPDIR}/npm-cache"
export NPM_CONFIG_CACHE="${npm_config_cache}"
export XDG_CACHE_HOME="${TMPDIR}/xdg-cache"
mkdir -p "${npm_config_cache}" "${XDG_CACHE_HOME}"

VLLM_VENV_DIR="/usr/project/xtmp/${USER}/vllm_env"
if [ -f "${VLLM_VENV_DIR}/bin/activate" ]; then
    source "${VLLM_VENV_DIR}/bin/activate"
    echo "  Activated venv: ${VLLM_VENV_DIR}"
fi
cd "${PROJECT_DIR}"
echo "  Python: $(which python3)"
echo ""

# --- Step 3: Build site (per-shard isolated copy) ---
echo "[3/5] Building ComponentBench site (isolated per shard)..."
export NVM_DIR="${HOME}/.nvm"
[ -s "${NVM_DIR}/nvm.sh" ] && \. "${NVM_DIR}/nvm.sh"
nvm use 20 2>/dev/null || echo "  WARNING: nvm use 20 failed"
echo "  Node.js: $(node --version 2>/dev/null || echo 'not found')"

mkdir -p "$(dirname "${SITE_DIR}")"
rsync -a --exclude '.next' --exclude 'node_modules' \
    "${PROJECT_DIR}/site/" "${SITE_DIR}/"
ln -sf "${PROJECT_DIR}/data" "${SITE_BUILD_DIR}/data"

cd "${SITE_DIR}"
npm ci --prefer-offline 2>&1 | tail -3
export BENCHMARK_BUILD=1
npm run build 2>&1 | tail -5
if [ ! -f "${SITE_DIR}/.next/BUILD_ID" ]; then
    echo "ERROR: site build failed"; exit 1
fi
echo "  Build OK: $(cat "${SITE_DIR}/.next/BUILD_ID")"

./node_modules/.bin/next start -p "${NEXTJS_PORT}" > "${LOGS_DIR}/nextjs.log" 2>&1 &
NEXTJS_PID=$!
cd "${PROJECT_DIR}"
echo ""

# --- Step 4: Wait for site ---
echo "[4/5] Waiting for site on port ${NEXTJS_PORT}..."
WAITED=0
while ! nc -z localhost "${NEXTJS_PORT}" 2>/dev/null; do
    sleep 3; WAITED=$((WAITED + 3))
    if [ $WAITED -ge 120 ]; then
        echo "ERROR: Site failed to start after ${WAITED}s"
        tail -20 "${LOGS_DIR}/nextjs.log"
        exit 1
    fi
done
echo "  Site ready on port ${NEXTJS_PORT}"
echo ""

# --- Step 5: Run benchmark ---
echo "[5/5] Running ${BENCHMARK_MODE} benchmark (shard ${SHARD_ID}/${NUM_SHARDS})..."
echo "=============================================="

VERSION_FLAGS=""
if [ "${BENCHMARK_VERSION}" = "v2" ]; then
    VERSION_FLAGS="--data_dir data/componentbench_v2 --benchmark_version v2"
fi

TASK_FLAGS=""
if [ "${MAX_TASKS}" -gt 0 ] 2>/dev/null; then
    TASK_FLAGS="--max_tasks ${MAX_TASKS}"
fi

MODEL_FLAGS=""
if [ -n "${MODEL_ID}" ]; then
    MODEL_FLAGS="--model_id ${MODEL_ID}"
fi

python3 scripts/run_benchmark.py \
    --mode "${BENCHMARK_MODE}" \
    ${MODEL_FLAGS} \
    --agent_config "${AGENT_CONFIG}" \
    --base_url "http://127.0.0.1:${NEXTJS_PORT}" \
    --output_dir "${RESULTS_DIR}" \
    --shard_id "${SHARD_ID}" \
    --num_shards "${NUM_SHARDS}" \
    --shard_strategy "${SHARD_STRATEGY}" \
    --headless \
    --max_steps "${MAX_STEPS}" \
    --max_task_walltime_seconds "${MAX_TASK_WALLTIME}" \
    --resume \
    ${TASK_FLAGS} \
    ${VERSION_FLAGS} \
    2>&1 | tee "${LOGS_DIR}/benchmark.log"

BENCH_EXIT=$?

echo ""
echo "=============================================="
echo "Shard ${SHARD_ID} complete."
echo "  Exit:     ${BENCH_EXIT}"
echo "  Results:  ${RESULTS_DIR}"
echo "  Time:     $(date)"
echo "=============================================="

exit ${BENCH_EXIT}
