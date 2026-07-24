#!/bin/bash
# ==============================================================================
# Shared helpers for scripts/eval_*.sh
#
# Maps a provider name to (a) the agent config YAML under configs/agents/ and
# (b) the environment variables the harness reads (VLLM_BASE_URL /
# VLLM_API_KEY — see benchmark/agents/openai_agent.py). Set the provider's
# native API-key variable before running:
#
#   openai     -> OPENAI_API_KEY
#   google     -> GOOGLE_API_KEY      (Gemini, OpenAI-compatible endpoint)
#   anthropic  -> ANTHROPIC_API_KEY
#   openrouter -> OPENROUTER_API_KEY
#   litellm    -> OPENAI_API_KEY + VLLM_BASE_URL pointing at your LiteLLM proxy
#   vllm       -> nothing (local server; VLLM_BASE_URL defaults to :8000)
# ==============================================================================

resolve_agent_config() {
    local model="$1"
    local provider="$2"
    case "${provider}" in
        openai)     AGENT_CONFIG="gpt" ;;
        google)     AGENT_CONFIG="gemini" ;;
        anthropic)  AGENT_CONFIG="claude" ;;
        openrouter) AGENT_CONFIG="openrouter" ;;
        litellm)    AGENT_CONFIG="gpt" ;;
        vllm)       AGENT_CONFIG="qwen" ;;
        *)
            echo "ERROR: unknown provider '${provider}' (openai|google|anthropic|openrouter|litellm|vllm)" >&2
            exit 2
            ;;
    esac
    export AGENT_CONFIG
}

load_credentials() {
    local provider="$1"
    case "${provider}" in
        openai)
            : "${OPENAI_API_KEY:?Set OPENAI_API_KEY first}"
            export VLLM_BASE_URL="${VLLM_BASE_URL:-https://api.openai.com/v1}"
            export VLLM_API_KEY="${VLLM_API_KEY:-${OPENAI_API_KEY}}"
            ;;
        google)
            : "${GOOGLE_API_KEY:?Set GOOGLE_API_KEY first}"
            export VLLM_BASE_URL="${VLLM_BASE_URL:-https://generativelanguage.googleapis.com/v1beta/openai/}"
            export VLLM_API_KEY="${VLLM_API_KEY:-${GOOGLE_API_KEY}}"
            ;;
        anthropic)
            : "${ANTHROPIC_API_KEY:?Set ANTHROPIC_API_KEY first}"
            ;;
        openrouter)
            : "${OPENROUTER_API_KEY:?Set OPENROUTER_API_KEY first}"
            export VLLM_BASE_URL="${VLLM_BASE_URL:-https://openrouter.ai/api/v1}"
            export VLLM_API_KEY="${VLLM_API_KEY:-${OPENROUTER_API_KEY}}"
            ;;
        litellm)
            : "${VLLM_BASE_URL:?Set VLLM_BASE_URL to your LiteLLM proxy URL}"
            export VLLM_API_KEY="${VLLM_API_KEY:-${OPENAI_API_KEY:-dummy}}"
            ;;
        vllm)
            export VLLM_BASE_URL="${VLLM_BASE_URL:-http://localhost:8000/v1}"
            export VLLM_API_KEY="${VLLM_API_KEY:-dummy}"
            ;;
    esac
}

show_banner() {
    local mode="$1"
    local agent_config="$2"
    local model="$3"
    echo "======================================================================"
    echo "  ComponentBench Evaluation — ${mode}"
    echo "======================================================================"
    echo "  Model        : ${model}"
    echo "  Agent config : configs/agents/${agent_config}.yaml"
    echo "  Base URL     : ${BASE_URL:-http://127.0.0.1:3002}"
    echo "  Endpoint     : ${VLLM_BASE_URL:-<not set>}"
    echo "  Timestamp    : $(date '+%Y-%m-%d %H:%M:%S')"
    echo "======================================================================"
    echo ""
}
