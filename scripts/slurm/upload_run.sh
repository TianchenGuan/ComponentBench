#!/bin/bash
# ==============================================================================
# upload_run.sh — Wrapper for scripts/logpack/upload_run.py
# ==============================================================================
# Uploads packed episodes to Vercel Blob and upserts the Supabase index.
#
# Required env vars (load from ~/.secrets or set manually):
#   BLOB_READ_WRITE_TOKEN
#   SUPABASE_SERVICE_ROLE_KEY
#   NEXT_PUBLIC_SUPABASE_URL
#
# Usage:
#   scripts/slurm/upload_run.sh \
#       --packed-dir /usr/project/xtmp/$USER/componentbench-packed/my_run \
#       --workers 32
#
# All arguments are forwarded to scripts/logpack/upload_run.py.
# ==============================================================================

set -euo pipefail

PROJECT_DIR="${PROJECT_DIR:-/home/users/${USER}/projects/ComponentBench}"

# Load secrets if available
for secrets_file in \
    "${HOME}/.secrets/vercel.env" \
    "${HOME}/.secrets/supabase.env"; do
    if [ -f "$secrets_file" ]; then
        set -a; source "$secrets_file"; set +a
    fi
done

VLLM_VENV_DIR="/usr/project/xtmp/${USER}/vllm_env"
if [ -f "${VLLM_VENV_DIR}/bin/activate" ]; then
    source "${VLLM_VENV_DIR}/bin/activate"
fi

cd "${PROJECT_DIR}"
exec python3 scripts/logpack/upload_run.py "$@"
