#!/bin/bash
# ==============================================================================
# ComponentBench Cluster: Pixel mode with local vLLM model (GPU)
# ==============================================================================
# For models that run locally via vLLM (UI-TARS, Qwen, etc.)
# Starts a vLLM server on the GPU, then runs pixel-mode benchmark.
#
# Usage:
#   RUN_ID=uitars_pixel_$(date +%Y%m%d) MODEL=UI-TARS-1.5-7B \
#       HF_MODEL=ByteDance-Seed/UI-TARS-1.5-7B \
#       sbatch scripts/slurm/pixel_gpu.sh
#
#   RUN_ID=qwen_pixel_$(date +%Y%m%d) MODEL=Qwen3-VL-235B \
#       HF_MODEL=Qwen/Qwen3-VL-235B-A22B-Thinking-FP8 \
#       AGENT_CONFIG=qwen TENSOR_PARALLEL=4 \
#       sbatch scripts/slurm/pixel_gpu.sh
#
#   # Smoke test (1 worker, 5 tasks):
#   RUN_ID=smoke MODEL=UI-TARS-1.5-7B \
#       HF_MODEL=ByteDance-Seed/UI-TARS-1.5-7B MAX_TASKS=5 \
#       sbatch --array=0 scripts/slurm/pixel_gpu.sh
#
# Environment:
#   RUN_ID          -- Experiment identifier (REQUIRED)
#   MODEL           -- Model display name (REQUIRED)
#   HF_MODEL        -- HuggingFace model ID (REQUIRED)
#   AGENT_CONFIG    -- Agent config: ui_tars or qwen (default: auto-detect from MODEL)
#   TENSOR_PARALLEL -- TP size for vLLM (default: 1)
#   SHARDS          -- Total array size (default: from SLURM_ARRAY_TASK_COUNT)
#   MAX_TASKS       -- Limit tasks (default: all)
#   VERSION         -- v1 or v2 (default: v1)
# ==============================================================================

#SBATCH --job-name=cb_pixel_gpu
#SBATCH --partition=compsci-gpu
#SBATCH --gres=gpu:1
#SBATCH --array=0-11
#SBATCH --nodes=1
#SBATCH --cpus-per-task=8
#SBATCH --mem=64G
#SBATCH --time=7-00:00:00
#SBATCH --output=/usr/project/xtmp/%u/slurm-cb-pixel-gpu-%A_%a.out
#SBATCH --error=/usr/project/xtmp/%u/slurm-cb-pixel-gpu-%A_%a.err

set -euo pipefail

# ==============================================================================
# Fixed mode for this script
# ==============================================================================
BENCHMARK_MODE="pixel"

# ==============================================================================
# Configuration
# ==============================================================================

PROJECT_DIR="${PROJECT_DIR:-/home/users/${USER}/projects/ComponentBench}"
VLLM_VENV_DIR="${VLLM_VENV_DIR:-/usr/project/xtmp/${USER}/vllm_env}"
HF_CACHE_DIR="${HF_CACHE_DIR:-/usr/project/xtmp/${USER}/huggingface}"
PLAYWRIGHT_BROWSERS_DIR="/usr/project/xtmp/${USER}/playwright-browsers"

: "${RUN_ID:?ERROR: RUN_ID not set. Example: RUN_ID=uitars_pixel_20260401 MODEL=UI-TARS-1.5-7B HF_MODEL=ByteDance-Seed/UI-TARS-1.5-7B sbatch scripts/slurm/pixel_gpu.sh}"
: "${MODEL:?ERROR: MODEL not set. Example: MODEL=UI-TARS-1.5-7B}"
: "${HF_MODEL:?ERROR: HF_MODEL not set. Example: HF_MODEL=ByteDance-Seed/UI-TARS-1.5-7B}"

VERSION="${VERSION:-v1}"
MAX_STEPS="${MAX_STEPS:-20}"
MAX_TASK_WALLTIME="${MAX_TASK_WALLTIME:-600}"
MAX_TASKS="${MAX_TASKS:-0}"
TENSOR_PARALLEL="${TENSOR_PARALLEL:-1}"
MAX_MODEL_LEN="${MAX_MODEL_LEN:-32768}"

# Worker identity
WORKER_ID="${SLURM_ARRAY_TASK_ID:-0}"
SHARDS="${SHARDS:-${SLURM_ARRAY_TASK_COUNT:-1}}"

# Auto-detect AGENT_CONFIG from MODEL name if not set
# (Structured so this block can be replaced by: source scripts/_lib/common.sh; resolve_vllm_agent)
if [ -z "${AGENT_CONFIG:-}" ]; then
    case "${MODEL}" in
        *UI-TARS*|*ui_tars*|*uitars*)  AGENT_CONFIG="ui_tars" ;;
        *Qwen*|*qwen*)                 AGENT_CONFIG="qwen" ;;
        *)                             AGENT_CONFIG="ui_tars"
                                       echo "WARNING: Could not auto-detect AGENT_CONFIG from MODEL='${MODEL}', defaulting to ui_tars" ;;
    esac
fi

# Per-worker ports: spaced by 100 for vLLM (torch.distributed uses nearby offsets)
NEXTJS_PORT=$((3100 + WORKER_ID))
VLLM_PORT=$((8000 + WORKER_ID * 100))

# Directories (all per-worker)
RUN_ROOT="/usr/project/xtmp/${USER}/componentbench-runs/${RUN_ID}"
RESULTS_DIR="${RUN_ROOT}/${BENCHMARK_MODE}/worker_${WORKER_ID}"
LOGS_DIR="${RUN_ROOT}/logs/${BENCHMARK_MODE}/worker_${WORKER_ID}"
SITE_BUILD_DIR="${RUN_ROOT}/site_build_${BENCHMARK_MODE}_${SLURM_JOB_ID:-$$}_worker_${WORKER_ID}"
SITE_DIR="${SITE_BUILD_DIR}/site"

# ==============================================================================
# Cleanup
# ==============================================================================

VLLM_PID=""
NEXTJS_PID=""
cleanup() {
    echo ""
    echo "=== Worker ${WORKER_ID}: Cleaning up ==="
    if [ -n "$VLLM_PID" ]; then
        kill "$VLLM_PID" 2>/dev/null || true
        sleep 2
        kill -9 "$VLLM_PID" 2>/dev/null || true
    fi
    if [ -n "$NEXTJS_PID" ]; then
        kill "$NEXTJS_PID" 2>/dev/null || true
        sleep 1
        kill -9 "$NEXTJS_PID" 2>/dev/null || true
    fi
    fuser -k "${VLLM_PORT}/tcp" 2>/dev/null || true
    fuser -k "${NEXTJS_PORT}/tcp" 2>/dev/null || true
    [ -d "${SITE_BUILD_DIR}" ] && rm -rf "${SITE_BUILD_DIR}"
    [ -d "${TMPDIR:-}" ] && rm -rf "${TMPDIR}"
    echo "Cleanup complete."
}
trap cleanup EXIT INT TERM

wait_for_port() {
    local port=$1 name=$2 max_wait=${3:-300} waited=0
    echo "  Waiting for ${name} on port ${port}..."
    while ! nc -z localhost "${port}" 2>/dev/null; do
        sleep 5; waited=$((waited + 5))
        if [ $waited -ge $max_wait ]; then
            echo "  ERROR: ${name} failed to start after ${max_wait}s"
            return 1
        fi
        echo "    Still waiting... (${waited}s)"
    done
    echo "  ${name} ready on port ${port}!"
}

# ==============================================================================
# Main
# ==============================================================================

echo "=============================================="
echo "ComponentBench ${BENCHMARK_MODE} (GPU) -- ${MODEL}"
echo "=============================================="
echo "Job:       ${SLURM_JOB_ID:-local}"
echo "Node:      $(hostname)"
echo "GPU:       ${CUDA_VISIBLE_DEVICES:-N/A}"
echo "Model:     ${HF_MODEL}"
echo "Served as: ${MODEL}"
echo "Config:    ${AGENT_CONFIG}"
echo "Mode:      ${BENCHMARK_MODE}"
echo "Version:   ${VERSION}"
echo "Worker:    ${WORKER_ID}/${SHARDS}"
echo "Ports:     site=${NEXTJS_PORT} vllm=${VLLM_PORT}"
echo "Run ID:    ${RUN_ID}"
echo "Results:   ${RESULTS_DIR}"
echo "Time:      $(date)"
echo ""

# --- Step 1: Environment ---
echo "[1/6] Setting up environment..."
mkdir -p "${RESULTS_DIR}" "${LOGS_DIR}"

module load python/3.12.8 2>/dev/null || echo "  Warning: python module not loaded"

export HF_HOME="${HF_CACHE_DIR}"
export HUGGINGFACE_HUB_CACHE="${HF_CACHE_DIR}"
export TRANSFORMERS_CACHE="${HF_CACHE_DIR}"
export PLAYWRIGHT_BROWSERS_PATH="${PLAYWRIGHT_BROWSERS_DIR}"

export TMPDIR="/tmp/cb_pixel_gpu_${SLURM_JOB_ID:-$$}_w${WORKER_ID}"
mkdir -p "${TMPDIR}"
export npm_config_cache="${TMPDIR}/npm-cache"
export NPM_CONFIG_CACHE="${npm_config_cache}"
export XDG_CACHE_HOME="${TMPDIR}/xdg-cache"
mkdir -p "${npm_config_cache}" "${XDG_CACHE_HOME}"

if [ -f "${VLLM_VENV_DIR}/bin/activate" ]; then
    source "${VLLM_VENV_DIR}/bin/activate"
    echo "  Activated venv: ${VLLM_VENV_DIR}"
else
    echo "ERROR: vLLM venv not found at ${VLLM_VENV_DIR}"
    exit 1
fi
cd "${PROJECT_DIR}"
echo "  Python: $(which python)"
echo "  TMPDIR: ${TMPDIR}"
echo ""

# --- Step 2: Build site (per-worker isolated copy) ---
echo "[2/6] Building ComponentBench site (isolated per worker)..."
export NVM_DIR="${HOME}/.nvm"
[ -s "${NVM_DIR}/nvm.sh" ] && \. "${NVM_DIR}/nvm.sh"
nvm use 20 2>/dev/null || echo "  WARNING: nvm use 20 failed"
echo "  Node.js: $(node --version 2>/dev/null || echo 'not found')"

rm -rf "${SITE_BUILD_DIR}"
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

# --- Step 3: Start vLLM server (1 GPU) ---
echo "[3/6] Starting vLLM server..."
echo "  GPU: ${CUDA_VISIBLE_DEVICES:-N/A}"
echo "  Model: ${HF_MODEL}"
echo "  Port: ${VLLM_PORT}"
echo "  TP: ${TENSOR_PARALLEL}"

export MODEL_NAME="${HF_MODEL}"
export VLLM_SERVED_MODEL_NAME="${MODEL}"
export TENSOR_PARALLEL_SIZE="${TENSOR_PARALLEL}"
export MAX_MODEL_LEN="${MAX_MODEL_LEN}"
export VLLM_PORT="${VLLM_PORT}"
export VLLM_REASONING_PARSER=""
export VLLM_LIMIT_MM_IMAGES="5"

python "${PROJECT_DIR}/scripts/vllm_server_wrapper.py" 2>&1 | tee "${LOGS_DIR}/vllm.log" &
VLLM_PID=$!
echo "  vLLM PID: ${VLLM_PID}"
echo ""

# --- Step 4: Wait for services ---
echo "[4/6] Waiting for services..."
if ! wait_for_port "${NEXTJS_PORT}" "Next.js" 300; then
    echo "ERROR: site failed to start"
    tail -20 "${LOGS_DIR}/nextjs.log"
    exit 1
fi

if ! wait_for_port "${VLLM_PORT}" "vLLM" 600; then
    echo "ERROR: vLLM failed to start"
    tail -40 "${LOGS_DIR}/vllm.log"
    exit 1
fi

# Wait for model to be fully loaded (health check)
VLLM_READY=0
for i in $(seq 1 60); do
    if curl -s "http://localhost:${VLLM_PORT}/v1/models" 2>/dev/null | grep -q '"id"'; then
        echo "  vLLM model loaded!"
        VLLM_READY=1
        break
    fi
    sleep 10
    echo "  Loading model... ($((i*10))s)"
done
if [ "${VLLM_READY}" -eq 0 ]; then
    echo "ERROR: vLLM model failed to load after 600s"
    tail -40 "${LOGS_DIR}/vllm.log"
    exit 1
fi
echo ""

# --- Step 5: Run benchmark ---
echo "[5/6] Running ${BENCHMARK_MODE} benchmark (worker ${WORKER_ID}/${SHARDS})..."
echo "=============================================="

export VLLM_BASE_URL="http://localhost:${VLLM_PORT}/v1"
export VLLM_API_KEY="EMPTY"
export OPENAI_API_KEY="EMPTY"

VERSION_FLAGS=""
if [ "${VERSION}" = "v2" ]; then
    VERSION_FLAGS="--data_dir data/componentbench_v2 --benchmark_version v2"
fi

TASK_FLAGS=""
if [ "${MAX_TASKS}" -gt 0 ] 2>/dev/null; then
    TASK_FLAGS="--max_tasks ${MAX_TASKS}"
fi

python3 scripts/run_benchmark.py \
    --mode "${BENCHMARK_MODE}" \
    --model_id "${MODEL}" \
    --agent_config "${AGENT_CONFIG}" \
    --base_url "http://127.0.0.1:${NEXTJS_PORT}" \
    --output_dir "${RESULTS_DIR}" \
    --shard_id "${WORKER_ID}" \
    --num_shards "${SHARDS}" \
    --shard_strategy stride \
    --benchmark_version "${VERSION}" \
    --headless \
    --max_steps "${MAX_STEPS}" \
    --max_task_walltime_seconds "${MAX_TASK_WALLTIME}" \
    --resume \
    ${TASK_FLAGS} \
    ${VERSION_FLAGS} \
    2>&1 | tee "${LOGS_DIR}/benchmark.log"

BENCH_EXIT=$?

# --- Step 6: Done ---
echo ""
echo "=============================================="
echo "Worker ${WORKER_ID} complete."
echo "  Mode:     ${BENCHMARK_MODE}"
echo "  Exit:     ${BENCH_EXIT}"
echo "  Results:  ${RESULTS_DIR}"
echo "  Time:     $(date)"
echo "=============================================="

exit ${BENCH_EXIT}
