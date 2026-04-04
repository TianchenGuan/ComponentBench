#!/bin/bash
# ==============================================================================
# ComponentBench Cluster: Browser-Use mode (API models, CPU)
# ==============================================================================
# Uses the browser-use library pipeline (scripts/browser_use/run_and_pack.py)
# instead of the BrowserGym-based run_benchmark.py.
#
# Usage:
#   RUN_ID=gpt54_bu_$(date +%Y%m%d) MODEL=gpt-5.4-mini PROVIDER=openai \
#       sbatch scripts/slurm/browser_use.sh
#
#   RUN_ID=gemini_bu_$(date +%Y%m%d) MODEL=gemini-3-flash PROVIDER=google \
#       sbatch scripts/slurm/browser_use.sh
#
#   # With sharding (20 parallel jobs):
#   RUN_ID=gpt54_bu_$(date +%Y%m%d) MODEL=gpt-5.4-mini PROVIDER=openai SHARDS=20 \
#       sbatch --array=0-19 scripts/slurm/browser_use.sh
#
#   # Smoke test:
#   RUN_ID=smoke MODEL=gpt-5.4-mini PROVIDER=openai MAX_TASKS=5 \
#       sbatch scripts/slurm/browser_use.sh
#
# Environment:
#   RUN_ID    -- Experiment identifier (REQUIRED)
#   MODEL     -- Model name (REQUIRED, e.g., gpt-5.4-mini, gemini-3-flash)
#   PROVIDER  -- API provider (REQUIRED): openai | google | anthropic | openrouter | litellm
#   SHARDS    -- Total shards (default: 1, set >1 with --array)
#   MAX_TASKS -- Limit tasks (default: all)
#   VERSION   -- v1 or v2 (default: v1)
# ==============================================================================

#SBATCH --job-name=cb_browser_use
#SBATCH --partition=compsci
#SBATCH --nodes=1
#SBATCH --cpus-per-task=8
#SBATCH --mem=64G
#SBATCH --time=7-00:00:00
#SBATCH --output=/usr/project/xtmp/%u/slurm-cb-browser-use-%A_%a.out
#SBATCH --error=/usr/project/xtmp/%u/slurm-cb-browser-use-%A_%a.err

set -euo pipefail

# ==============================================================================
# Fixed mode for this script
# ==============================================================================
BENCHMARK_MODE="browser_use"

# ==============================================================================
# Configuration
# ==============================================================================

PROJECT_DIR="${PROJECT_DIR:-/home/users/${USER}/projects/ComponentBench}"
PLAYWRIGHT_BROWSERS_DIR="/usr/project/xtmp/${USER}/playwright-browsers"

: "${RUN_ID:?ERROR: RUN_ID not set. Example: RUN_ID=gpt54_bu_20260401 MODEL=gpt-5.4-mini PROVIDER=openai sbatch scripts/slurm/browser_use.sh}"
: "${MODEL:?ERROR: MODEL not set. Example: MODEL=gpt-5.4-mini}"
: "${PROVIDER:?ERROR: PROVIDER not set. Options: openai | google | anthropic | openrouter | litellm}"

VERSION="${VERSION:-v1}"
MAX_STEPS="${MAX_STEPS:-20}"
MAX_TASK_WALLTIME="${MAX_TASK_WALLTIME:-600}"
MAX_TASKS="${MAX_TASKS:-0}"
SHARD_STRATEGY="${SHARD_STRATEGY:-stride}"

SHARD_ID="${SLURM_ARRAY_TASK_ID:-0}"
SHARDS="${SHARDS:-${SLURM_ARRAY_TASK_COUNT:-1}}"

# Map PROVIDER -> AGENT_CONFIG
# (Structured so this block can be replaced by: source scripts/_lib/common.sh; resolve_provider)
case "${PROVIDER}" in
    openai)     AGENT_CONFIG="gpt" ;;
    google)     AGENT_CONFIG="gemini" ;;
    anthropic)  AGENT_CONFIG="claude" ;;
    openrouter) AGENT_CONFIG="openrouter" ;;
    litellm)    AGENT_CONFIG="gpt" ;;
    *)          echo "ERROR: Unknown PROVIDER '${PROVIDER}'. Use: openai | google | anthropic | openrouter | litellm"; exit 1 ;;
esac

# Directories
RUN_ROOT="/usr/project/xtmp/${USER}/componentbench-runs/${RUN_ID}"
MODE_ROOT="${RUN_ROOT}/${BENCHMARK_MODE}"
if [ "${SHARDS}" -gt 1 ]; then
    RESULTS_DIR="${MODE_ROOT}/shard_${SHARD_ID}"
    LOGS_DIR="${RUN_ROOT}/logs/${BENCHMARK_MODE}/shard_${SHARD_ID}"
else
    RESULTS_DIR="${MODE_ROOT}"
    LOGS_DIR="${RUN_ROOT}/logs/${BENCHMARK_MODE}"
fi
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
echo "ComponentBench ${BENCHMARK_MODE} -- ${PROVIDER}/${MODEL}"
echo "=============================================="
echo "Job:       ${SLURM_ARRAY_JOB_ID:-${SLURM_JOB_ID:-local}}_${SLURM_ARRAY_TASK_ID:-0}"
echo "Node:      $(hostname)"
echo "Provider:  ${PROVIDER}"
echo "Model:     ${MODEL}"
echo "Config:    ${AGENT_CONFIG}"
echo "Mode:      ${BENCHMARK_MODE}"
echo "Version:   ${VERSION}"
echo "Shard:     ${SHARD_ID}/${SHARDS}"
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

# Map PROVIDER -> VLLM_BASE_URL + VLLM_API_KEY
# (Structured so this block can be replaced by: resolve_credentials)
if [ -z "${VLLM_BASE_URL:-}" ]; then
    case "${PROVIDER}" in
        openai)
            if [ -z "${OPENAI_API_KEY:-}" ]; then
                echo "ERROR: OPENAI_API_KEY not set. Create ~/.secrets/openai.env"; exit 1
            fi
            export VLLM_BASE_URL="https://api.openai.com/v1"
            export VLLM_API_KEY="${OPENAI_API_KEY}"
            ;;
        google)
            if [ -z "${GOOGLE_API_KEY:-}" ]; then
                echo "ERROR: GOOGLE_API_KEY not set. Create ~/.secrets/google.env"; exit 1
            fi
            export VLLM_BASE_URL="https://generativelanguage.googleapis.com/v1beta/openai/"
            export VLLM_API_KEY="${GOOGLE_API_KEY}"
            ;;
        openrouter)
            if [ -z "${OPENROUTER_API_KEY:-}" ]; then
                echo "ERROR: OPENROUTER_API_KEY not set. Create ~/.secrets/openrouter.env"; exit 1
            fi
            export VLLM_BASE_URL="${OPENROUTER_BASE_URL:-https://openrouter.ai/api/v1}"
            export VLLM_API_KEY="${OPENROUTER_API_KEY}"
            ;;
        anthropic)
            if [ -z "${ANTHROPIC_API_KEY:-}" ]; then
                echo "ERROR: ANTHROPIC_API_KEY not set. Create ~/.secrets/anthropic.env"; exit 1
            fi
            export VLLM_BASE_URL="https://api.anthropic.com/v1"
            export VLLM_API_KEY="${ANTHROPIC_API_KEY}"
            ;;
        litellm)
            if [ -z "${LITELLM_BASE_URL:-}" ]; then
                echo "ERROR: LITELLM_BASE_URL not set for litellm provider"; exit 1
            fi
            export VLLM_BASE_URL="${LITELLM_BASE_URL}"
            export VLLM_API_KEY="${LITELLM_API_KEY:-${OPENAI_API_KEY:-EMPTY}}"
            ;;
    esac
fi
echo "  VLLM_BASE_URL=${VLLM_BASE_URL}"
echo ""

# --- Step 2: Environment ---
echo "[2/5] Setting up environment..."
mkdir -p "${RESULTS_DIR}" "${LOGS_DIR}"

export PLAYWRIGHT_BROWSERS_PATH="${PLAYWRIGHT_BROWSERS_DIR}"
export TMPDIR="/usr/project/xtmp/${USER}/cb_${BENCHMARK_MODE}_${SLURM_JOB_ID:-$$}_shard_${SHARD_ID}"
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

# --- Step 5: Run browser-use benchmark ---
echo "[5/5] Running browser-use benchmark (shard ${SHARD_ID}/${SHARDS})..."
echo "=============================================="

VERSION_FLAGS=""
if [ "${VERSION}" = "v2" ]; then
    VERSION_FLAGS="--data_dir data/componentbench_v2 --benchmark_version v2"
fi

TASK_FLAGS=""
if [ "${MAX_TASKS}" -gt 0 ] 2>/dev/null; then
    TASK_FLAGS="--max_tasks ${MAX_TASKS}"
fi

python3 scripts/browser_use/run_and_pack.py \
    --model_id "${MODEL}" \
    --base_url "http://127.0.0.1:${NEXTJS_PORT}" \
    --output_dir "${RESULTS_DIR}" \
    --shard_id "${SHARD_ID}" \
    --num_shards "${SHARDS}" \
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
echo "  Mode:     ${BENCHMARK_MODE}"
echo "  Exit:     ${BENCH_EXIT}"
echo "  Results:  ${RESULTS_DIR}"
echo "  Time:     $(date)"
echo "=============================================="

exit ${BENCH_EXIT}
