#!/bin/bash
# ==============================================================================
# ComponentBench: GPU array job — Local vLLM models (UI-TARS, Qwen, etc.)
# ==============================================================================
# Each worker gets 1 GPU, launches its own vLLM server and site server, and
# runs its shard of the benchmark independently. Workers share no state.
#
# Architecture per worker:
#   +--------------+      +------------------+      +------------------+
#   | Benchmark    |----->| vLLM (1 GPU)     |      | Next.js site     |
#   | Runner       |      | port 8000+W*100  |      | port 3100+W      |
#   | (shard W/N)  |----->|                  |      |                  |
#   +--------------+      +------------------+      +------------------+
#
# Usage examples:
#
#   # UI-TARS-1.5-7B (12 workers, default)
#   RUN_ID=ui_tars_$(date +%Y%m%d) \
#       sbatch scripts/slurm/submit_vllm.sh
#
#   # Qwen model
#   RUN_ID=qwen_$(date +%Y%m%d) HF_MODEL_ID=Qwen/Qwen2.5-VL-72B-Instruct \
#       SERVED_MODEL_NAME=Qwen2.5-VL-72B AGENT_CONFIG=qwen \
#       BENCHMARK_MODE=pixel \
#       sbatch --array=0-7 scripts/slurm/submit_vllm.sh
#
#   # Fewer workers
#   RUN_ID=ui_tars_$(date +%Y%m%d) \
#       sbatch --array=0-3 scripts/slurm/submit_vllm.sh
#
#   # Smoke test (1 worker, 10 tasks)
#   RUN_ID=smoke MAX_TASKS=10 \
#       sbatch --array=0 scripts/slurm/submit_vllm.sh
#
#   # Resume after partial failure
#   RUN_ID=<same_run_id> RESUME=1 \
#       sbatch scripts/slurm/submit_vllm.sh
#
# Environment:
#   RUN_ID              — Experiment identifier (REQUIRED)
#   HF_MODEL_ID         — HuggingFace model (default: ByteDance-Seed/UI-TARS-1.5-7B)
#   SERVED_MODEL_NAME   — Name exposed by vLLM (default: UI-TARS-1.5-7B)
#   AGENT_CONFIG        — Agent config name (default: ui_tars)
#   BENCHMARK_MODE      — ui_tars_native, pixel, ax_tree, etc. (default: ui_tars_native)
#   BENCHMARK_VERSION   — v1 or v2 (default: v1)
#   MAX_STEPS           — Steps per task (default: 20)
#   MAX_TASK_WALLTIME   — Per-task timeout seconds (default: 600)
#   MAX_TASKS           — Smoke-test limit; 0 = all (default: 0)
#   RESUME              — Set to 1 to skip completed tasks (default: 0)
#   TASK_IDS            — Comma-separated task IDs to run (default: all)
#   NUM_WORKERS         — Total shard count; override when resubmitting a
#                         subset, e.g. NUM_WORKERS=12 sbatch --array=3-6 ...
#   TENSOR_PARALLEL_SIZE — TP size for vLLM (default: 1)
#   MAX_MODEL_LEN       — Max sequence length (default: 32768)
#   VLLM_VENV_DIR       — Path to vLLM virtualenv
#   HF_CACHE_DIR        — HuggingFace model cache directory
# ==============================================================================

#SBATCH --job-name=cb_vllm
#SBATCH --partition=compsci-gpu
#SBATCH --gres=gpu:1
#SBATCH --array=0-11
#SBATCH --nodes=1
#SBATCH --cpus-per-task=8
#SBATCH --mem=64G
#SBATCH --time=7-00:00:00
#SBATCH --output=/usr/project/xtmp/%u/slurm-cb-vllm-%A_%a.out
#SBATCH --error=/usr/project/xtmp/%u/slurm-cb-vllm-%A_%a.err

set -euo pipefail

# ==============================================================================
# Configuration
# ==============================================================================

PROJECT_DIR="${PROJECT_DIR:-/home/users/${USER}/projects/ComponentBench}"
VLLM_VENV_DIR="${VLLM_VENV_DIR:-/usr/project/xtmp/${USER}/vllm_env}"
HF_CACHE_DIR="${HF_CACHE_DIR:-/usr/project/xtmp/${USER}/huggingface}"
PLAYWRIGHT_BROWSERS_DIR="/usr/project/xtmp/${USER}/playwright-browsers"

: "${RUN_ID:?ERROR: RUN_ID not set. Example: RUN_ID=ui_tars_20260401 sbatch scripts/slurm/submit_vllm.sh}"

# Worker identity
WORKER_ID="${SLURM_ARRAY_TASK_ID:-0}"
NUM_WORKERS="${NUM_WORKERS:-${SLURM_ARRAY_TASK_COUNT:-1}}"

# Per-worker ports: spaced by 100 for vLLM (torch.distributed uses nearby offsets)
SITE_PORT=$((3100 + WORKER_ID))
MODEL_PORT=$((8000 + WORKER_ID * 100))

# Model defaults (UI-TARS)
HF_MODEL_ID="${HF_MODEL_ID:-ByteDance-Seed/UI-TARS-1.5-7B}"
SERVED_MODEL_NAME="${SERVED_MODEL_NAME:-UI-TARS-1.5-7B}"
TENSOR_PARALLEL_SIZE="${TENSOR_PARALLEL_SIZE:-1}"
MAX_MODEL_LEN="${MAX_MODEL_LEN:-32768}"

# Agent / benchmark
AGENT_CONFIG="${AGENT_CONFIG:-ui_tars}"
BENCHMARK_MODE="${BENCHMARK_MODE:-ui_tars_native}"
BENCHMARK_VERSION="${BENCHMARK_VERSION:-v1}"
MAX_STEPS="${MAX_STEPS:-20}"
MAX_TASK_WALLTIME="${MAX_TASK_WALLTIME:-600}"
MAX_TASKS="${MAX_TASKS:-0}"
TASK_IDS="${TASK_IDS:-}"
RESUME="${RESUME:-0}"

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
    fuser -k "${MODEL_PORT}/tcp" 2>/dev/null || true
    fuser -k "${SITE_PORT}/tcp" 2>/dev/null || true
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
echo "ComponentBench vLLM — Worker ${WORKER_ID}/${NUM_WORKERS}"
echo "=============================================="
echo "Job:       ${SLURM_JOB_ID:-local}"
echo "Node:      $(hostname)"
echo "GPU:       ${CUDA_VISIBLE_DEVICES:-N/A}"
echo "Model:     ${HF_MODEL_ID}"
echo "Config:    ${AGENT_CONFIG}"
echo "Mode:      ${BENCHMARK_MODE}"
echo "Version:   ${BENCHMARK_VERSION}"
echo "Shard:     ${WORKER_ID}/${NUM_WORKERS}"
echo "Ports:     site=${SITE_PORT} model=${MODEL_PORT}"
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

export TMPDIR="/tmp/cb_vllm_${SLURM_JOB_ID:-$$}_w${WORKER_ID}"
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

./node_modules/.bin/next start -p "${SITE_PORT}" > "${LOGS_DIR}/nextjs.log" 2>&1 &
NEXTJS_PID=$!
cd "${PROJECT_DIR}"
echo ""

# --- Step 3: Start vLLM server (1 GPU) ---
echo "[3/6] Starting vLLM server..."
echo "  GPU: ${CUDA_VISIBLE_DEVICES:-N/A}"
echo "  Model: ${HF_MODEL_ID}"
echo "  Port: ${MODEL_PORT}"
echo "  TP: ${TENSOR_PARALLEL_SIZE}"

export MODEL_NAME="${HF_MODEL_ID}"
export VLLM_SERVED_MODEL_NAME="${SERVED_MODEL_NAME}"
export TENSOR_PARALLEL_SIZE="${TENSOR_PARALLEL_SIZE}"
export MAX_MODEL_LEN="${MAX_MODEL_LEN}"
export VLLM_PORT="${MODEL_PORT}"
export VLLM_REASONING_PARSER=""
export VLLM_LIMIT_MM_IMAGES="5"

python "${PROJECT_DIR}/scripts/vllm_server_wrapper.py" 2>&1 | tee "${LOGS_DIR}/vllm.log" &
VLLM_PID=$!
echo "  vLLM PID: ${VLLM_PID}"
echo ""

# --- Step 4: Wait for services ---
echo "[4/6] Waiting for services..."
if ! wait_for_port "${SITE_PORT}" "Next.js" 300; then
    echo "ERROR: site failed to start"
    tail -20 "${LOGS_DIR}/nextjs.log"
    exit 1
fi

if ! wait_for_port "${MODEL_PORT}" "vLLM" 600; then
    echo "ERROR: vLLM failed to start"
    tail -40 "${LOGS_DIR}/vllm.log"
    exit 1
fi

# Wait for model to be fully loaded (health check)
VLLM_READY=0
for i in $(seq 1 60); do
    if curl -s "http://localhost:${MODEL_PORT}/v1/models" 2>/dev/null | grep -q '"id"'; then
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
echo "[5/6] Running ${BENCHMARK_MODE} benchmark (worker ${WORKER_ID}/${NUM_WORKERS})..."
echo "=============================================="

export VLLM_BASE_URL="http://localhost:${MODEL_PORT}/v1"
export VLLM_API_KEY="EMPTY"
export OPENAI_API_KEY="EMPTY"

BENCHMARK_CMD="python scripts/run_benchmark.py"
BENCHMARK_CMD="${BENCHMARK_CMD} --mode ${BENCHMARK_MODE}"
BENCHMARK_CMD="${BENCHMARK_CMD} --model_id ${SERVED_MODEL_NAME}"
BENCHMARK_CMD="${BENCHMARK_CMD} --agent_config ${AGENT_CONFIG}"
BENCHMARK_CMD="${BENCHMARK_CMD} --base_url http://127.0.0.1:${SITE_PORT}"
BENCHMARK_CMD="${BENCHMARK_CMD} --output_dir ${RESULTS_DIR}"
BENCHMARK_CMD="${BENCHMARK_CMD} --shard_id ${WORKER_ID}"
BENCHMARK_CMD="${BENCHMARK_CMD} --num_shards ${NUM_WORKERS}"
BENCHMARK_CMD="${BENCHMARK_CMD} --shard_strategy stride"
BENCHMARK_CMD="${BENCHMARK_CMD} --benchmark_version ${BENCHMARK_VERSION}"
BENCHMARK_CMD="${BENCHMARK_CMD} --headless"
BENCHMARK_CMD="${BENCHMARK_CMD} --max_steps ${MAX_STEPS}"
BENCHMARK_CMD="${BENCHMARK_CMD} --max_task_walltime_seconds ${MAX_TASK_WALLTIME}"

VERSION_FLAGS=""
if [ "${BENCHMARK_VERSION}" = "v2" ]; then
    VERSION_FLAGS="--data_dir data/componentbench_v2"
fi
if [ -n "${VERSION_FLAGS}" ]; then
    BENCHMARK_CMD="${BENCHMARK_CMD} ${VERSION_FLAGS}"
fi

if [ "${MAX_TASKS}" -gt 0 ] 2>/dev/null; then
    BENCHMARK_CMD="${BENCHMARK_CMD} --max_tasks ${MAX_TASKS}"
fi

if [ -n "${TASK_IDS}" ]; then
    BENCHMARK_CMD="${BENCHMARK_CMD} --task_ids ${TASK_IDS}"
fi

if [ "${RESUME}" = "1" ]; then
    BENCHMARK_CMD="${BENCHMARK_CMD} --resume"
fi

echo "Running: ${BENCHMARK_CMD}"
echo ""

timeout 604800 ${BENCHMARK_CMD} 2>&1 | tee "${LOGS_DIR}/benchmark.log"
BENCH_EXIT=$?

# --- Step 6: Done ---
echo ""
echo "=============================================="
echo "Worker ${WORKER_ID} complete."
echo "  Exit:     ${BENCH_EXIT}"
echo "  Results:  ${RESULTS_DIR}"
echo "  Time:     $(date)"
echo "=============================================="

exit ${BENCH_EXIT}
