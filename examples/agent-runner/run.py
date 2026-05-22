#!/usr/bin/env python3
"""End-to-end agent runner that writes a LogViewer-compatible run.

Drives one ComponentBench task through a Playwright-controlled Chromium with
an OpenAI vision model picking each action. Writes the result to
`<repo>/runs/<run-id>/` in the schema the site's log viewer expects:

  runs/<run-id>/manifest.json
  runs/<run-id>/runs/<run-id>/<mode>/<task-id>/episode.json
  runs/<run-id>/runs/<run-id>/<mode>/<task-id>/step_<idx>.png

Requirements:
    pip install openai playwright pyyaml
    playwright install chromium
    export OPENAI_API_KEY=sk-...

Usage:
    python run.py --task-id alert_dialog_confirm-antd-T01 --model gpt-5.4-mini
"""

from __future__ import annotations

import argparse
import base64
import datetime as dt
import json
import os
import re
import sys
import time
from pathlib import Path

try:
    import yaml  # type: ignore
except ImportError:
    print("Need PyYAML: pip install pyyaml", file=sys.stderr)
    sys.exit(1)

try:
    from playwright.sync_api import sync_playwright  # type: ignore
except ImportError:
    print("Need Playwright: pip install playwright && playwright install chromium", file=sys.stderr)
    sys.exit(1)

try:
    from openai import OpenAI  # type: ignore
except ImportError:
    print("Need OpenAI: pip install openai", file=sys.stderr)
    sys.exit(1)


REPO_ROOT = Path(__file__).resolve().parent.parent.parent
RUNS_ROOT = REPO_ROOT / "runs"

SYSTEM_PROMPT = """You are a computer-use agent controlling a web browser.

You are given:
  - a task goal (text)
  - the current page screenshot

Reply with EXACTLY ONE JSON object describing your next action:

  {"thinking": "<short reasoning>", "action": "click", "x": <int>, "y": <int>, "target": "<element label>"}
  {"thinking": "<short reasoning>", "action": "type", "text": "<text>"}
  {"thinking": "<short reasoning>", "action": "scroll", "dy": <int>}
  {"thinking": "<short reasoning>", "action": "done"}

Coordinates are in browser pixels (origin top-left, the viewport is 1280x768).
Click the precise center of the target. Do not invent UI that is not visible.
Stop with action=done when you believe the task goal is achieved.
"""


def load_task(task_id: str) -> dict:
    canonical = task_id.split("-")[0]
    for suite in ("tasks_v1", "tasks_v2"):
        yaml_path = REPO_ROOT / "data" / suite / f"{canonical}.yaml"
        if not yaml_path.exists():
            continue
        with yaml_path.open() as f:
            tasks = yaml.safe_load(f) or []
        for t in tasks:
            if t.get("id") == task_id:
                return t
    raise FileNotFoundError(f"task_id {task_id!r} not found in data/tasks_v{{1,2}}/")


JSON_BLOCK_RE = re.compile(r"\{.*\}", re.DOTALL)


def parse_action(raw: str) -> dict:
    """Pull the first JSON object out of a model response."""
    m = JSON_BLOCK_RE.search(raw)
    if not m:
        raise ValueError(f"no JSON object in model output: {raw!r}")
    return json.loads(m.group(0))


def call_model(client: OpenAI, model: str, goal: str, screenshot_png: bytes) -> tuple[str, dict]:
    img_b64 = base64.b64encode(screenshot_png).decode("ascii")
    resp = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": f"Task goal: {goal}\n\nReply with a single JSON action object."},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/png;base64,{img_b64}"},
                    },
                ],
            },
        ],
        max_completion_tokens=400,
    )
    raw = resp.choices[0].message.content or ""
    return raw, parse_action(raw)


def execute_action(page, action: dict) -> None:
    kind = action.get("action")
    if kind == "click":
        page.mouse.click(int(action["x"]), int(action["y"]))
    elif kind == "type":
        page.keyboard.type(str(action.get("text", "")))
    elif kind == "scroll":
        page.mouse.wheel(0, int(action.get("dy", 0)))
    elif kind == "done":
        return
    else:
        raise ValueError(f"unknown action {kind!r}")


def check_dialog_state(page) -> dict | None:
    try:
        return page.evaluate("window.__cbDialogState || null")
    except Exception:
        return None


def matches_predicate(state: dict | None, predicate: dict) -> bool:
    if not state or not predicate:
        return False
    target = predicate.get("target_state") or {}
    for k, v in target.items():
        if state.get(k) != v:
            return False
    return True


def run_episode(
    task: dict,
    site_url: str,
    model: str,
    out_dir: Path,
    max_steps: int,
    mode_name: str,
) -> dict:
    task_id = task["id"]
    goal = task["browsergym_goal"]
    predicate = (task.get("success_trigger") or {}).get("canonical_predicate") or {}

    url = f"{site_url.rstrip('/')}/task/{task_id}?mode=benchmark"
    client = OpenAI()

    started = time.time()
    step_list: list[dict] = []
    success = False
    termination_reason = "max_steps"

    out_dir.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 768})
        page = context.new_page()
        page.goto(url, wait_until="domcontentloaded", timeout=120_000)
        # Wait for the task spec to load — the page shows "Loading task..." until
        # /api/tasks/<canonical> resolves, which on a cold Next-dev server may
        # take 30-90s while routes compile.
        try:
            page.wait_for_function(
                "document.body && !document.body.innerText.includes('Loading task...')",
                timeout=120_000,
            )
        except Exception as e:
            print(f"[agent-runner] warning: page never finished loading task spec: {e}")
        page.wait_for_timeout(1500)

        for step_idx in range(max_steps):
            shot = page.screenshot()
            shot_name = f"step_{step_idx:03d}.png"
            (out_dir / shot_name).write_bytes(shot)

            ts = dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S,%f")[:-3]
            try:
                raw, action = call_model(client, model, goal, shot)
                err = ""
            except Exception as e:
                raw, action, err = str(e), {"action": "done"}, str(e)

            step_list.append({
                "step_idx": step_idx,
                "timestamp": ts,
                "thinking": action.get("thinking", ""),
                "action": json.dumps({k: v for k, v in action.items() if k != "thinking"}),
                "raw_model_output": raw,
                "error": err,
                "transformed_action": "",
                "screenshot": shot_name,
            })

            if action.get("action") == "done":
                termination_reason = "agent_done"
                break

            try:
                execute_action(page, action)
            except Exception as e:
                step_list[-1]["error"] = str(e)
                termination_reason = "exec_error"
                break

            page.wait_for_timeout(400)
            state = check_dialog_state(page)
            if matches_predicate(state, predicate):
                success = True
                termination_reason = "predicate_matched"
                # one more screenshot for the final state
                final_shot = page.screenshot()
                final_name = f"step_{step_idx+1:03d}.png"
                (out_dir / final_name).write_bytes(final_shot)
                step_list.append({
                    "step_idx": step_idx + 1,
                    "timestamp": dt.datetime.now().strftime("%Y-%m-%d %H:%M:%S,%f")[:-3],
                    "thinking": "Predicate matched — task complete.",
                    "action": "done",
                    "raw_model_output": "",
                    "error": "",
                    "transformed_action": "",
                    "screenshot": final_name,
                })
                break

        browser.close()

    duration = time.time() - started
    return {
        "task_id": task_id,
        "mode": mode_name,
        "canonical_type": task.get("canonical_type", ""),
        "library": task.get("implementation_source", ""),
        "success": success,
        "steps": len(step_list),
        "duration_seconds": duration,
        "termination_reason": termination_reason,
        "model_name": model,
        "step_list": step_list,
        "videos": {},
        "difficulty_bucket": (task.get("difficulty") or {}).get("difficulty_bucket", ""),
        "difficulty_tier": (task.get("difficulty") or {}).get("tier", ""),
    }


def write_manifest(run_dir: Path, run_id: str, model: str, mode_name: str, episode: dict) -> None:
    success_count = 1 if episode["success"] else 0
    manifest = {
        "run_id": run_id,
        "model_name": model,
        "agent_name": "agent-runner",
        "benchmark": "componentbench",
        "commit_sha": "",
        "modes": [mode_name],
        "total_episodes": 1,
        "total_success": success_count,
        "pass_rate": float(success_count),
        "created_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "by_mode": {
            mode_name: {
                "total": 1,
                "success": success_count,
                "pass_rate": float(success_count),
                "avg_steps": float(episode["steps"]),
                "avg_duration": float(episode["duration_seconds"]),
            }
        },
    }
    (run_dir / "manifest.json").write_text(json.dumps(manifest, indent=2))


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--task-id", required=True)
    ap.add_argument("--model", default="gpt-4o-mini",
                    help="OpenAI vision model id (any chat-completions model with image input).")
    ap.add_argument("--site-url", default="http://localhost:3002")
    ap.add_argument("--max-steps", type=int, default=8)
    ap.add_argument("--mode-name", default="pixel", help="Logged as the run mode (e.g. pixel, som, ax_tree).")
    ap.add_argument("--run-id", default=None, help="Override the generated run id.")
    args = ap.parse_args()

    if not os.environ.get("OPENAI_API_KEY"):
        print("ERROR: OPENAI_API_KEY not set in env", file=sys.stderr)
        return 2

    task = load_task(args.task_id)
    run_id = args.run_id or dt.datetime.now().strftime("smoke_%Y%m%d_%H%M%S")

    run_dir = RUNS_ROOT / run_id
    episode_dir = run_dir / "runs" / run_id / args.mode_name / args.task_id

    print(f"[agent-runner] run_id={run_id}")
    print(f"[agent-runner] task={args.task_id} model={args.model} site={args.site_url}")
    print(f"[agent-runner] output: {run_dir}")

    episode = run_episode(task, args.site_url, args.model, episode_dir, args.max_steps, args.mode_name)

    (episode_dir / "episode.json").write_text(json.dumps(episode, indent=2))
    write_manifest(run_dir, run_id, args.model, args.mode_name, episode)

    print(f"[agent-runner] success={episode['success']} steps={episode['steps']} termination={episode['termination_reason']}")
    print(f"[agent-runner] open: {args.site_url}/?mode=log&bench=v1")
    return 0 if episode["success"] else 1


if __name__ == "__main__":
    sys.exit(main())
