#!/bin/bash
# ==============================================================================
# ComponentBench: Browser-Use mode evaluation (local)
# ==============================================================================
#
# Evaluates a model using the Browser-Use framework. Unlike AX-tree/SoM/Pixel
# modes (which use BrowserGym), Browser-Use provides direct DOM access,
# serialized page information, and richer tool capabilities.
#
# This is a separate pipeline from run_benchmark.py.
#
# Usage:
#   ./scripts/eval_browser_use.sh <model> <provider> [extra flags...]
#
# Arguments:
#   model       Model name (e.g., gpt-5.4-mini, gemini-3-flash, claude-opus-4.6)
#   provider    API provider: openai | google | anthropic | openrouter | litellm | vllm
#
# Examples:
#   ./scripts/eval_browser_use.sh gemini-3-flash google
#   ./scripts/eval_browser_use.sh gpt-5.4-mini openai --limit 10
#   ./scripts/eval_browser_use.sh claude-opus-4.6 anthropic
#
# Requirements:
#   - ComponentBench site running on http://localhost:3002
#   - browser-use library installed (pip install browser-use)
# ==============================================================================

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/_lib/common.sh"

MODEL="${1:?Usage: $0 <model> <provider> [extra flags...]}"
PROVIDER="${2:?Usage: $0 <model> <provider> [extra flags...]}"
shift 2

load_credentials "${PROVIDER}"

echo "======================================================================"
echo "  ComponentBench Evaluation — Browser-Use"
echo "======================================================================"
echo "  Model        : ${MODEL}"
echo "  Provider     : ${PROVIDER}"
echo "  Base URL     : ${BASE_URL:-http://127.0.0.1:3002}"
echo "  VLLM endpoint: ${VLLM_BASE_URL:-<not set>}"
echo "  Timestamp    : $(date '+%Y-%m-%d %H:%M:%S')"
echo "======================================================================"
echo ""

# Browser-use pipeline (separate from BrowserGym)
if [ ! -f "${SCRIPT_DIR}/browser_use/run_and_pack.py" ]; then
    echo "ERROR: scripts/browser_use/run_and_pack.py not found."
    echo "This script requires the browser-use pipeline to be ported from InterfaceGym."
    exit 1
fi

python3 scripts/browser_use/run_and_pack.py \
    --model "${MODEL}" \
    --server-url "${BASE_URL:-http://127.0.0.1:3002}" \
    "$@"
