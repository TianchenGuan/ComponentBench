#!/bin/bash
# ==============================================================================
# ComponentBench Cluster: Browser-Use mode with local vLLM model (GPU)
# ==============================================================================
# Starts a vLLM server on GPU, then runs browser-use benchmark against it.
#
# Usage:
#   RUN_ID=qwen_bu_$(date +%Y%m%d) MODEL=Qwen3-VL-235B \
#       HF_MODEL=Qwen/Qwen3-VL-235B-A22B-Thinking-FP8 \
#       TENSOR_PARALLEL=4 \
#       sbatch scripts/slurm/browser_use_gpu.sh
#
# Environment:
#   RUN_ID          — Experiment identifier (REQUIRED)
#   MODEL           — Model display name (REQUIRED)
#   HF_MODEL        — HuggingFace model ID (REQUIRED)
#   TENSOR_PARALLEL — TP size for vLLM (default: 1)
#   SHARDS          — Total array size (default: from SLURM_ARRAY_TASK_COUNT)
#   MAX_TASKS       — Limit tasks (default: all)
#   VERSION         — v1 or v2 (default: v1)
# ==============================================================================

#SBATCH --job-name=cb_bu_gpu
#SBATCH --partition=compsci-gpu
#SBATCH --gres=gpu:4
#SBATCH --nodes=1
#SBATCH --cpus-per-task=16
#SBATCH --mem=100G
#SBATCH --time=7-00:00:00
#SBATCH --output=/usr/project/xtmp/%u/slurm-cb-bu-gpu-%A_%a.out
#SBATCH --error=/usr/project/xtmp/%u/slurm-cb-bu-gpu-%A_%a.err

set -euo pipefail

BENCHMARK_MODE="browser_use"

# ==============================================================================
# Configuration
# ==============================================================================

PROJECT_DIR="${PROJECT_DIR:-/home/users/${USER}/projects/ComponentBench}"
VLLM_VENV_DIR="${VLLM_VENV_DIR:-/usr/project/xtmp/${USER}/vllm_env}"
HF_CACHE_DIR="${HF_CACHE_DIR:-/usr/project/xtmp/${USER}/huggingface}"
PLAYWRIGHT_BROWSERS_DIR="/usr/project/xtmp/${USER}/playwright-browsers"

: "${RUN_ID:?ERROR: RUN_ID not set.}"
: "${MODEL:?ERROR: MODEL not set. Example: MODEL=Qwen3-VL-235B}"
: "${HF_MODEL:?ERROR: HF_MODEL not set. Example: HF_MODEL=Qwen/Qwen3-VL-235B-A22B-Thinking-FP8}"

VERSION="${VERSION:-v1}"
MAX_STEPS="${MAX_STEPS:-20}"
MAX_TASK_WALLTIME="${MAX_TASK_WALLTIME:-600}"
MAX_TASKS="${MAX_TASKS:-0}"
TENSOR_PARALLEL="${TENSOR_PARALLEL:-1}"
MAX_MODEL_LEN="${MAX_MODEL_LEN:-32768}"

WORKER_ID="${SLURM_ARRAY_TASK_ID:-0}"
SHARDS="${SHARDS:-${SLURM_ARRAY_TASK_COUNT:-1}}"

NEXTJS_PORT=$((3100 + WORKER_ID))
VLLM_PORT=$((8000 + WORKER_ID * 100))

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
    [ -n "$VLLM_PID" ] && kill "$VLLM_PID" 2>/dev/null; sleep 2; kill -9 "$VLLM_PID" 2>/dev/null || true
    [ -n "$NEXTJS_PID" ] && kill "$NEXTJS_PID" 2>/dev/null; kill -9 "$NEXTJS_PID" 2>/dev/null || true
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
            echo "  ERROR: ${name} failed to start after ${max_wait}s"; return 1
        fi
    done
    echo "  ${name} ready on port ${port}!"
}

# ==============================================================================
# Main
# ==============================================================================

echo "=============================================="
echo "ComponentBench Browser-Use (GPU) — ${MODEL}"
echo "=============================================="
echo "Job:       ${SLURM_JOB_ID:-local}"
echo "Node:      $(hostname)"
echo "GPU:       ${CUDA_VISIBLE_DEVICES:-N/A}"
echo "Model:     ${HF_MODEL}"
echo "Served as: ${MODEL}"
echo "Mode:      ${BENCHMARK_MODE}"
echo "Version:   ${VERSION}"
echo "Worker:    ${WORKER_ID}/${SHARDS}"
echo "TP:        ${TENSOR_PARALLEL}"
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

export TMPDIR="/tmp/cb_bu_gpu_${SLURM_JOB_ID:-$$}_w${WORKER_ID}"
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
echo ""

# --- Step 2: Build site ---
echo "[2/6] Building ComponentBench site..."
export NVM_DIR="${HOME}/.nvm"
[ -s "${NVM_DIR}/nvm.sh" ] && \. "${NVM_DIR}/nvm.sh"
nvm use 20 2>/dev/null || echo "  WARNING: nvm use 20 failed"

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
echo "  Build OK"

./node_modules/.bin/next start -p "${NEXTJS_PORT}" > "${LOGS_DIR}/nextjs.log" 2>&1 &
NEXTJS_PID=$!
cd "${PROJECT_DIR}"
echo ""

# --- Step 3: Start vLLM server ---
echo "[3/6] Starting vLLM server (TP=${TENSOR_PARALLEL})..."

python -m vllm.entrypoints.openai.api_server \
    --model "${HF_MODEL}" \
    --served-model-name "${MODEL}" \
    --port "${VLLM_PORT}" \
    --tensor-parallel-size "${TENSOR_PARALLEL}" \
    --max-model-len "${MAX_MODEL_LEN}" \
    --gpu-memory-utilization 0.90 \
    --trust-remote-code \
    --dtype auto \
    > "${LOGS_DIR}/vllm.log" 2>&1 &
VLLM_PID=$!
echo "  vLLM PID: ${VLLM_PID}"
echo ""

# --- Step 4: Wait for services ---
echo "[4/6] Waiting for services..."
wait_for_port "${NEXTJS_PORT}" "Next.js" 300 || { tail -20 "${LOGS_DIR}/nextjs.log"; exit 1; }

wait_for_port "${VLLM_PORT}" "vLLM" 600 || { tail -40 "${LOGS_DIR}/vllm.log"; exit 1; }

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
    echo "ERROR: vLLM model failed to load"
    tail -40 "${LOGS_DIR}/vllm.log"
    exit 1
fi
echo ""

# --- Step 5: Run browser-use benchmark ---
echo "[5/6] Running browser-use benchmark (worker ${WORKER_ID}/${SHARDS})..."
echo "=============================================="

export VLLM_BASE_URL="http://localhost:${VLLM_PORT}/v1"
export VLLM_API_KEY="EMPTY"

TASK_FLAGS=""
if [ "${MAX_TASKS}" -gt 0 ] 2>/dev/null; then
    TASK_FLAGS="--limit ${MAX_TASKS}"
fi

python3 scripts/browser_use/run_and_pack.py \
    --run-id "${RUN_ID}" \
    --output-root "${RUN_ROOT}" \
    --output-subdir "worker_${WORKER_ID}" \
    --server-url "http://127.0.0.1:${NEXTJS_PORT}" \
    --model "${MODEL}" \
    --mode "${BENCHMARK_MODE}" \
    --max-steps "${MAX_STEPS}" \
    --task-timeout "${MAX_TASK_WALLTIME}" \
    --shard-id "${WORKER_ID}" \
    --num-shards "${SHARDS}" \
    --benchmark-version "${VERSION}" \
    --data-dir "data/tasks_v1" \
    --resume \
    ${TASK_FLAGS} \
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
