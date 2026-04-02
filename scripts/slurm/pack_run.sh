#!/bin/bash
# ==============================================================================
# pack_run.sh — Wrapper for scripts/logpack/pack_run.py
# ==============================================================================
# Packs a BrowserGym run directory into compressed episode archives.
#
# Usage:
#   scripts/slurm/pack_run.sh \
#       --input /usr/project/xtmp/$USER/componentbench-runs/my_run \
#       --output /usr/project/xtmp/$USER/componentbench-packed/my_run \
#       --run-id my_run \
#       --model-name "gpt-5.4-mini" \
#       --agent-name openai_agent
#
# All arguments are forwarded to scripts/logpack/pack_run.py.
# ==============================================================================

set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-/home/users/${USER}/projects/ComponentBench}"

VLLM_VENV_DIR="/usr/project/xtmp/${USER}/vllm_env"
if [ -f "${VLLM_VENV_DIR}/bin/activate" ]; then
    source "${VLLM_VENV_DIR}/bin/activate"
fi

cd "${PROJECT_DIR}"
exec python3 scripts/logpack/pack_run.py "$@"
