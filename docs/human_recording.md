# Human Trajectory Recording

Record human action traces for ComponentBench tasks and pack them into the log viewer format.

## Architecture

```
[Browser /record page]
  |
  v
[/task/<id>?mode=benchmark&record=1]
  |  RecordOverlay captures events
  |  POSTs steps to /api/record/append-step
  |  On success: /api/record/finalize-episode
  v
[Raw traces on disk]
  $HUMAN_RECORD_ROOT/<run_id>/episodes/<task_id>/trace.jsonl
  |
  v
[pack_human_run.py]  (Playwright replays steps, captures screenshots)
  |
  v
[Packed episodes]
  episode.json + frames_raw.mp4 per task
  Compatible with log viewer local backend
```

## Prerequisites

- Duke CS cluster account
- Node.js 20+ (via nvm)
- Python 3.12+ with Playwright installed
- SSH tunnel for browser access

## Quick Start (Duke Cluster)

### 1. Get an interactive compute node

```bash
# Request a CPU node for 8 hours
salloc --partition=compsci --cpus-per-task=8 --mem=32G --time=8:00:00

# Note the node name (e.g., compsci-cluster-fitz-36)
hostname
```

### 2. Set up environment on the compute node

```bash
cd ~/projects/ComponentBench

# Activate Python venv
source /usr/project/xtmp/$USER/vllm_env/bin/activate

# Load Node.js
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 20
```

### 3. Start the dev server with recording enabled

```bash
cd site

# Set recording environment variables
export RECORDING_ENABLED=true
export HUMAN_RECORD_ROOT="/usr/project/xtmp/$USER/componentbench-human-traces"
export NODE_ENV=development

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev -- -p 3002
```

### 4. Set up SSH tunnel (from your local machine)

```bash
# Replace <node> with the compute node hostname
ssh -L 3002:<node>:3002 tg295@login.cs.duke.edu
```

### 5. Open the recording UI

Navigate to: `http://localhost:3002/record`

- Enter a Run ID (e.g., `human_pass1_20260311`)
- Select Pass 1 or 2
- Optionally filter tasks or set a limit
- Click "Start / Resume Run"

### 6. Record tasks

- The task page loads with a recording overlay in the top-right corner
- Complete the task normally by interacting with the UI
- When the success banner appears, the episode is finalized automatically
- The next task loads automatically
- Use **Pause** to stop and resume later
- Use **Skip** to skip a task with an optional reason

### 7. Pack traces (after recording)

Start the ComponentBench site in production mode on a compute node:

```bash
# On a compute node (salloc)
cd ~/projects/ComponentBench/site
export BENCHMARK_BUILD=1
npm run build
npx next start -p 3002 &

# Wait for site to start
sleep 10

# Run the pack script
cd ~/projects/ComponentBench
python3 scripts/logpack/pack_human_run.py \
    --trace-root /usr/project/xtmp/$USER/componentbench-human-traces/human_pass1_20260311 \
    --out /usr/project/xtmp/$USER/componentbench-packed/human_pass1 \
    --base-url http://127.0.0.1:3002 \
    --workers 4
```

### 8. View in log viewer

```bash
cd site
export LOG_VIEWER_ENABLED=true
export LOG_VIEWER_BACKEND=local
export LOG_LOCAL_ROOT=/usr/project/xtmp/$USER/componentbench-packed/human_pass1
npm run dev -- -p 3002
```

Then open `http://localhost:3002/?mode=log` (via SSH tunnel).

## File Structure

### Raw traces

```
$HUMAN_RECORD_ROOT/<run_id>/
  run.json              # Run configuration
  progress.json         # Resume state
  episodes/
    <task_id>/
      trace.jsonl       # Append-only step log
      meta.json         # Episode metadata (status, timing, step count)
```

### Packed output

```
<packed_dir>/
  manifest.json
  runs/<run_id>/human/
    <task_id>/
      episode.json      # Log viewer compatible
      frames_raw.mp4    # 1fps screenshot video
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `RECORDING_ENABLED` | Yes | Set to `true` to enable recording routes |
| `HUMAN_RECORD_ROOT` | Yes | Filesystem path for raw traces |
| `NODE_ENV` | Yes | Must NOT be `production` |

## Two-Pass Protocol

- **Pass 1 (cold)**: Attempt tasks without prior knowledge. Use `run_id = human_pass1_<date>`.
- **Pass 2 (warm)**: Re-attempt tasks knowing the expected interaction. Use `run_id = human_pass2_<date>`. Aim for near-minimal steps.

## API Routes

All routes return 404 unless `RECORDING_ENABLED=true` and `NODE_ENV !== 'production'`.

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/record/init-run` | Create or resume a run |
| GET | `/api/record/run-status?run_id=...` | Get run progress and next task |
| POST | `/api/record/append-step` | Append a step to a task trace |
| POST | `/api/record/finalize-episode` | Finalize an episode and update progress |
