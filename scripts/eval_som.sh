#!/bin/bash
# ==============================================================================
# ComponentBench: Set-of-Marks mode evaluation (local)
# ==============================================================================
#
# Evaluates a model using the Set-of-Marks observation space: the agent sees
# a screenshot with numbered bounding-box overlays and acts through marker
# IDs (e.g., click(marker=7)).
#
# Usage:
#   ./scripts/eval_som.sh <model> <provider> [extra flags...]
#
# Arguments:
#   model       Model name (e.g., gpt-5.4-mini, gemini-3-flash, claude-opus-4.6)
#   provider    API provider: openai | google | anthropic | openrouter | litellm | vllm
#
# Models & coordinate handling:
#   gpt-5.4-mini, gpt-5.4      — raw pixel coords (1280x720)
#   gemini-3-flash, gemini-3.1-flash-lite — normalized 0-1000
#   claude-opus-4.6             — XGA 1024x768 scaled
#   Qwen3-VL-235B               — normalized 0-1000
#
# Examples:
#   ./scripts/eval_som.sh gpt-5.4-mini openai
#   ./scripts/eval_som.sh gpt-5.4-mini openai --max_tasks 5
#   ./scripts/eval_som.sh gemini-3-flash google
#   ./scripts/eval_som.sh claude-opus-4.6 anthropic --canonical_types button
#   ./scripts/eval_som.sh gpt-5-mini litellm --resume
#
# Requirements:
#   - ComponentBench site running on http://localhost:3002
#   - API credentials configured (see scripts/_lib/common.sh)
#   - Python venv with ComponentBench installed
# ==============================================================================

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/_lib/common.sh"

MODEL="${1:?Usage: $0 <model> <provider> [extra flags...]}"
PROVIDER="${2:?Usage: $0 <model> <provider> [extra flags...]}"
shift 2

resolve_agent_config "${MODEL}" "${PROVIDER}"
load_credentials "${PROVIDER}"
show_banner "som" "${AGENT_CONFIG}" "${MODEL}"

python3 scripts/run_benchmark.py \
    --mode som \
    --model_id "${MODEL}" \
    --agent_config "${AGENT_CONFIG}" \
    --base_url "${BASE_URL:-http://127.0.0.1:3002}" \
    --headless \
    ${EXTRA_FLAGS:-} \
    "$@"
