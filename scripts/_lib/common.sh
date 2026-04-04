#!/bin/bash
# ComponentBench shared shell library — sourced by eval and slurm scripts.
# Do not execute directly.

# ---------------------------------------------------------------------------
# resolve_agent_config MODEL PROVIDER
#
# Maps model+provider to the correct agent config name.
# Sets globals: AGENT_CONFIG, EXTRA_FLAGS (optional).
# ---------------------------------------------------------------------------
resolve_agent_config() {
    local model="$1"
    local provider="$2"

    EXTRA_FLAGS=""

    case "${provider}" in
        openai)
            AGENT_CONFIG="gpt"
            ;;
        google)
            AGENT_CONFIG="gemini"
            ;;
        anthropic)
            AGENT_CONFIG="claude"
            ;;
        openrouter)
            AGENT_CONFIG="openrouter"
            ;;
        litellm)
            AGENT_CONFIG="gpt"
            EXTRA_FLAGS="--base_url ${LITELLM_BASE_URL:-http://localhost:4000/v1}"
            ;;
        vllm)
            # Auto-detect config from model name
            local model_lower
            model_lower="$(echo "${model}" | tr '[:upper:]' '[:lower:]')"
            if [[ "${model_lower}" == *"ui_tars"* ]] || [[ "${model_lower}" == *"ui-tars"* ]]; then
                AGENT_CONFIG="ui_tars"
            elif [[ "${model_lower}" == *"qwen"* ]]; then
                AGENT_CONFIG="qwen"
            else
                echo "WARNING: Could not auto-detect agent config for vllm model '${model}'." >&2
                echo "         Defaulting to 'gpt'. Pass --agent_config to override." >&2
                AGENT_CONFIG="gpt"
            fi
            ;;
        *)
            echo "ERROR: Unknown provider '${provider}'." >&2
            echo "       Supported: openai | google | anthropic | openrouter | litellm | vllm" >&2
            exit 1
            ;;
    esac
}

# ---------------------------------------------------------------------------
# load_credentials PROVIDER
#
# Sources credential files from ~/.secrets/ and sets VLLM_BASE_URL / VLLM_API_KEY
# so that downstream code has a uniform interface.
# ---------------------------------------------------------------------------
load_credentials() {
    local provider="$1"

    case "${provider}" in
        openai)
            _source_secrets_file "openai.env"
            export VLLM_BASE_URL="https://api.openai.com/v1"
            export VLLM_API_KEY="${OPENAI_API_KEY:-}"
            ;;
        google)
            _source_secrets_file "google.env"
            export VLLM_BASE_URL="https://generativelanguage.googleapis.com/v1beta/openai/"
            export VLLM_API_KEY="${GOOGLE_API_KEY:-}"
            ;;
        anthropic)
            _source_secrets_file "anthropic.env"
            export VLLM_BASE_URL="https://api.anthropic.com/v1"
            export VLLM_API_KEY="${ANTHROPIC_API_KEY:-}"
            ;;
        openrouter)
            _source_secrets_file "openrouter.env"
            export VLLM_BASE_URL="https://openrouter.ai/api/v1"
            export VLLM_API_KEY="${OPENROUTER_API_KEY:-}"
            ;;
        litellm)
            _source_secrets_file "litellm.env" optional
            export VLLM_BASE_URL="${LITELLM_BASE_URL:-http://localhost:4000/v1}"
            export VLLM_API_KEY="${LITELLM_API_KEY:-}"
            ;;
        vllm)
            # No credentials needed — local server
            export VLLM_BASE_URL="${VLLM_BASE_URL:-http://localhost:8000/v1}"
            export VLLM_API_KEY="${VLLM_API_KEY:-EMPTY}"
            ;;
        *)
            echo "ERROR: Unknown provider '${provider}' in load_credentials." >&2
            exit 1
            ;;
    esac

    if [[ -z "${VLLM_API_KEY:-}" && "${provider}" != "vllm" ]]; then
        echo "WARNING: VLLM_API_KEY is empty for provider '${provider}'." >&2
        echo "         Either set the env var directly or create ~/.secrets/${provider}.env" >&2
    fi
}

# Internal helper: source a secrets file.
# Usage: _source_secrets_file <filename> [optional]
_source_secrets_file() {
    local filename="$1"
    local optional="${2:-}"
    local filepath="${HOME}/.secrets/${filename}"

    if [[ -f "${filepath}" ]]; then
        set -a
        # shellcheck disable=SC1090
        source "${filepath}"
        set +a
    elif [[ "${optional}" == "optional" ]]; then
        : # Silently skip
    else
        echo "WARNING: Credentials file ${filepath} not found." >&2
        echo "         Continuing — the required env var may already be set." >&2
    fi
}

# ---------------------------------------------------------------------------
# build_and_start_site SITE_SOURCE_DIR BUILD_DIR PORT
#
# Copies the site, installs deps, builds, and starts Next.js on PORT.
# Sets global: NEXTJS_PID
# ---------------------------------------------------------------------------
build_and_start_site() {
    local site_source_dir="$1"
    local build_dir="$2"
    local port="$3"

    echo "==> Preparing site build in ${build_dir} ..."

    # Copy site source (exclude heavy/generated dirs)
    rsync -a \
        --exclude '.next' \
        --exclude 'node_modules' \
        "${site_source_dir}/" "${build_dir}/"

    # Symlink the data directory into the build if it isn't already there
    local repo_root
    repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
    if [[ ! -e "${build_dir}/data" ]]; then
        ln -sfn "${repo_root}/data" "${build_dir}/data"
    fi

    echo "==> Installing dependencies ..."
    (cd "${build_dir}" && npm ci --prefer-offline 2>&1 | tail -5)

    echo "==> Building site ..."
    (cd "${build_dir}" && npm run build 2>&1 | tail -10)

    echo "==> Starting Next.js on port ${port} ..."
    (cd "${build_dir}" && PORT="${port}" npm run start &)
    NEXTJS_PID=$!

    wait_for_port "${port}" 30
    echo "==> Site ready at http://localhost:${port} (PID ${NEXTJS_PID})"
}

# ---------------------------------------------------------------------------
# wait_for_port PORT TIMEOUT
#
# Polls with nc until the port is accepting connections, or exits after
# TIMEOUT seconds.
# ---------------------------------------------------------------------------
wait_for_port() {
    local port="$1"
    local timeout="${2:-30}"
    local elapsed=0

    echo -n "    Waiting for port ${port} "
    while ! nc -z 127.0.0.1 "${port}" 2>/dev/null; do
        if (( elapsed >= timeout )); then
            echo " TIMEOUT (${timeout}s)"
            echo "ERROR: Port ${port} did not become available." >&2
            exit 1
        fi
        echo -n "."
        sleep 1
        (( elapsed++ ))
    done
    echo " ready (${elapsed}s)"
}

# ---------------------------------------------------------------------------
# register_cleanup
#
# Installs an EXIT/INT/TERM trap that kills the Next.js server, frees the
# port, and removes the temporary build directory.
# ---------------------------------------------------------------------------
register_cleanup() {
    trap _cleanup EXIT INT TERM
}

_cleanup() {
    echo ""
    echo "==> Cleaning up ..."

    # Kill Next.js server
    if [[ -n "${NEXTJS_PID:-}" ]]; then
        kill "${NEXTJS_PID}" 2>/dev/null && echo "    Stopped Next.js (PID ${NEXTJS_PID})" || true
    fi

    # Free the port (belt-and-suspenders)
    if [[ -n "${SITE_PORT:-}" ]]; then
        fuser -k "${SITE_PORT}/tcp" 2>/dev/null || true
    fi

    # Remove temp build dir
    if [[ -n "${BUILD_DIR:-}" && -d "${BUILD_DIR:-}" ]]; then
        rm -rf "${BUILD_DIR}"
        echo "    Removed ${BUILD_DIR}"
    fi
}

# ---------------------------------------------------------------------------
# show_banner MODE AGENT_CONFIG MODEL_ID
#
# Pretty-prints the run configuration header.
# ---------------------------------------------------------------------------
show_banner() {
    local mode="$1"
    local agent_config="$2"
    local model_id="$3"

    echo "======================================================================"
    echo "  ComponentBench Evaluation"
    echo "======================================================================"
    echo "  Mode         : ${mode}"
    echo "  Agent config : ${agent_config}"
    echo "  Model        : ${model_id}"
    echo "  Base URL     : ${BASE_URL:-http://127.0.0.1:3002}"
    echo "  VLLM endpoint: ${VLLM_BASE_URL:-<not set>}"
    echo "  Timestamp    : $(date '+%Y-%m-%d %H:%M:%S')"
    echo "======================================================================"
    echo ""
}
