# ComponentBench Observation Modes & Agent Setup

This document describes how the four observation/action modes are configured in
ComponentBench, and how different LLM agents connect to the benchmark.

---

## 1. Overview of Modes

ComponentBench supports four observation modes. Each mode determines **what the
agent sees** (observation space) and **how the agent interacts** (action space).

| Mode | Observation | Action Space | Element Reference |
|------|-------------|-------------|-------------------|
| **AX-tree** | Screenshot + W3C accessibility tree text | BID (element IDs) | `click('42')`, `fill('42', 'text')` |
| **SoM** | Screenshot with numbered element overlays | BID (marker IDs) | `click('42')`, `fill('42', 'text')` |
| **Pixel** | Screenshot only (no DOM info) | Coordinates | `mouse_click(x, y)`, `keyboard_type('text')` |
| **Browser-Use** | Screenshot + DOM tree + bounding boxes (browser-use library) | Element index or coordinates | `click_element(index=7)`, `input_text(index=3, text='hello')` |

### AX-tree Mode (`ax_tree`)
The agent receives a **screenshot** and the full **W3C accessibility tree** as
text. Each interactive element has an ID in square brackets like `[42]`. The
agent references elements by their ID: `click('42')`.

- Config: `config/obs/webarena.yaml`
- Action space: `bid` (BrowserGym's ID-based actions)
- Best for: Models with strong text understanding (reading structured trees)

### SoM Mode (`som`)
The agent receives a **screenshot with numbered visual markers** overlaid on
interactive elements (Set-of-Mark). No accessibility tree text is provided. The
agent clicks elements by their marker number: `click('42')`.

- Config: `config/obs/som_visual.yaml`
- Action space: `bid`
- Best for: Vision-language models that can read overlay numbers

### Pixel Mode (`pixel`)
The agent receives only a **raw screenshot** with no DOM or element
information. It must visually identify elements and click by pixel coordinates:
`mouse_click(640, 360)`.

- Config: `config/obs/pixel_grid.yaml` (with grid) or inline in `task.py`
- Action space: `coord` (coordinate-based)
- Important: Some models output **normalized 0-1000 coordinates** (Qwen3-VL,
  Gemini) while others output **actual pixel coordinates** (GPT). The
  `normalize_coordinates` flag in agent configs controls whether to apply the
  0-1000 -> pixel transformation.

### Browser-Use Mode (`browser_use`)
Uses the **browser-use** Python library instead of BrowserGym. The agent gets a
screenshot with bounding boxes on interactive elements plus a serialized DOM
tree. It outputs structured JSON actions (not free-text). This is a completely
separate pipeline from the BrowserGym modes.

- Runner: `scripts/browser_use/run_and_pack.py`
- Supports Google Gemini (`ChatGoogle`) and OpenAI-compatible APIs (`ChatOpenAI`)

---

## 2. Mode Configuration (BrowserGym)

Modes are defined in `src/benchmarks/componentbench/task.py` as the `OBS_MODES`
dictionary:

```python
OBS_MODES = {
    "ax_tree": {
        "use_screenshot": True,
        "use_axtree": True,        # Send accessibility tree text
        "use_som_overlay": False,
        "use_grid_overlay": False,
        "action_space": "bid",      # Element ID-based actions
    },
    "som": {
        "use_screenshot": True,
        "use_axtree": False,
        "use_som_overlay": True,    # Overlay numbered markers on elements
        "action_space": "bid",
    },
    "pixel": {
        "use_screenshot": True,
        "use_axtree": False,
        "use_som_overlay": False,
        "use_grid_overlay": False,
        "action_space": "coord",    # Coordinate-based (mouse_click(x, y))
    },
    "pixel_grid": {
        "use_screenshot": True,
        "use_grid_overlay": True,   # Add 10x10 coordinate reference grid
        "action_space": "coord",
    },
}
```

The runner (`src/benchmarks/componentbench/runner.py`) reads the mode, looks up
`OBS_MODES`, and configures the agent accordingly.

---

## 3. Agent Configurations

### BrowserGym Agent (OpenRouterAgent)

All BrowserGym modes use `OpenRouterAgent` (`src/agents/openrouter_agent.py`),
which talks to any OpenAI-compatible chat completions API. The agent:

1. Receives observations from BrowserGym (screenshot, AX-tree, SoM overlay)
2. Sends them to the LLM as a multi-modal message (text + images)
3. Parses the LLM's text response to extract an action
4. Returns the action to BrowserGym for execution

Key agent config files:

| Config | Provider | Model | Coordinate Normalization |
|--------|----------|-------|--------------------------|
| `config/agent/local_vllm.yaml` | Local vLLM | Qwen3-VL-235B | Yes (0-1000) |
| `config/agent/gemini_api.yaml` | Google Gemini API | gemini-3.1-flash-lite | Yes (0-1000) |
| `config/agent/openrouter_generic.yaml` | OpenRouter / any API | GPT, Claude, etc. | No (actual pixels) |

The `normalize_coordinates` flag determines whether the agent transforms model
output coordinates from a 0-1000 normalized scale to actual pixel coordinates.
Models like Qwen3-VL and Gemini are trained on 0-1000 output; GPT models output
actual pixel coordinates.

### Browser-Use Agent

The browser-use agent (`scripts/browser_use/run_and_pack.py`) uses the
`browser-use` Python library directly. It:

1. Creates a `Browser` and `Agent` from the browser-use library
2. The library handles its own observation (DOM serialization + screenshot with
   bounding boxes) and action space (structured JSON actions)
3. Success is detected by checking for a `#cb-success-banner` element in the DOM
4. Results are packed into `episode.json` + MP4 videos

LLM selection in browser-use:
- If `VLLM_BASE_URL` and `VLLM_API_KEY` are set: uses `browser_use.llm.openai.chat.ChatOpenAI`
- Otherwise: uses `browser_use.ChatGoogle` with `GOOGLE_API_KEY`

---

## 4. Screenshot Handling

Screenshots are sent as **PNG** images with `detail: "auto"` to preserve full
resolution. Previous versions used JPEG (lossy) with `detail: "high"` (which
downscales), but this was found to reduce coordinate accuracy for pixel mode.

The grid overlay (used for debugging) is still saved to disk but is **not sent
to the model** — only the original screenshot is sent.

---

## 5. Slurm Job Submission

### BrowserGym modes (ax_tree, som, pixel)

```bash
# Google Gemini API
GOOGLE_API_KEY=$KEY RUN_ID=my_run BENCHMARK_MODE=ax_tree \
    sbatch scripts/slurm_cb_gemini_api.sh

# OpenRouter / third-party API
VLLM_BASE_URL=https://api.example.com/v1 VLLM_API_KEY=$KEY \
    RUN_ID=my_run BENCHMARK_MODE=pixel MODEL_ID=gpt-5.4 \
    AGENT_CONFIG=openrouter_generic sbatch scripts/slurm_cb_gemini_api.sh

# Local vLLM (GPU nodes)
BENCHMARK_MODE=som sbatch scripts/run_componentbench_slurm.sh
```

### Browser-Use mode

```bash
# Google Gemini
GOOGLE_API_KEY=$KEY RUN_ID=my_run NUM_WORKERS=1 \
    sbatch scripts/browser_use/slurm_full_shard.sh

# OpenAI-compatible API
VLLM_BASE_URL=https://api.example.com/v1 VLLM_API_KEY=$KEY \
    RUN_ID=my_run MODEL_ID=gpt-5.4 NUM_WORKERS=1 \
    sbatch scripts/browser_use/slurm_full_shard.sh
```

### Port Collision Prevention

Each Slurm job derives a unique Next.js port from its job ID:
```bash
NEXTJS_PORT=$(( 3100 + (${SLURM_JOB_ID:-$$} % 1000) ))
```
This prevents conflicts when multiple jobs land on the same node.

---

## 6. File Inventory

### Core mode definitions
- `src/benchmarks/componentbench/task.py` — `OBS_MODES` dict, goal string builder
- `src/benchmarks/componentbench/runner.py` — Task runner, agent construction, timeout handling

### Agent implementations
- `src/agents/openrouter_agent.py` — BrowserGym agent (handles all 3 BrowserGym modes)
- `scripts/browser_use/run_and_pack.py` — Browser-use agent + episode packer

### Observation configs
- `config/obs/webarena.yaml` — AX-tree mode settings
- `config/obs/som_visual.yaml` — SoM mode settings
- `config/obs/pixel_grid.yaml` — Pixel-grid mode settings

### Agent configs
- `config/agent/local_vllm.yaml` — Qwen3-VL (local GPU)
- `config/agent/gemini_api.yaml` — Google Gemini API
- `config/agent/openrouter_generic.yaml` — OpenRouter / third-party API

### Slurm scripts
- `scripts/slurm_cb_gemini_api.sh` — BrowserGym on CPU (API models)
- `scripts/run_componentbench_slurm.sh` — BrowserGym on GPU (local vLLM)
- `scripts/browser_use/slurm_full_shard.sh` — Browser-use agent
