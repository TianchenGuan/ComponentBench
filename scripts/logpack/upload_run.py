#!/usr/bin/env python3
"""
upload_run.py — Upload packed episodes to Vercel Blob (public) + upsert Supabase index.

All blobs are uploaded as PUBLIC so the website can reference them by direct URL.
Supports parallel uploads via --workers (default 1).

Usage:
  BLOB_READ_WRITE_TOKEN=... \
  SUPABASE_SERVICE_ROLE_KEY=... \
  NEXT_PUBLIC_SUPABASE_URL=... \
  python3 scripts/logpack/upload_run.py \
      --packed-dir /usr/xtmp/tg295/componentbench-packed/run_001 \
      --workers 32 \
      [--dry-run]
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import time
import urllib.request
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from threading import Lock

SCRIPT_DIR = Path(__file__).resolve().parent

VIDEO_VARIANTS = ["frames_raw", "frames_annot", "frames_som", "frames_grid"]

print_lock = Lock()


def log(msg: str, end="\n", flush=True):
    with print_lock:
        print(msg, end=end, flush=flush)


def blob_upload(blob_path: str, local_file: Path, max_retries: int = 5) -> dict:
    """Upload a file to Vercel Blob (public) via blob_put.mjs with retry on rate-limit."""
    mjs = SCRIPT_DIR / "blob_put.mjs"
    for attempt in range(max_retries):
        result = subprocess.run(
            ["node", str(mjs), blob_path, str(local_file)],
            capture_output=True, text=True, timeout=300,
        )
        if result.returncode == 0:
            return json.loads(result.stdout.strip())
        if "RateLimited" in result.stderr or "Too many requests" in result.stderr:
            wait = 2 ** attempt + 1
            time.sleep(wait)
            continue
        raise RuntimeError(f"Blob upload failed: {result.stderr[:500]}")
    raise RuntimeError(f"Blob upload failed after {max_retries} retries (rate-limited)")


def supabase_rpc(url: str, key: str, method: str, path: str, body=None, extra_prefer: str = ""):
    full_url = f"{url}/rest/v1{path}"
    prefer = "return=representation"
    if extra_prefer:
        prefer = f"{extra_prefer},{prefer}"
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": prefer,
    }
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(full_url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        err_body = e.read().decode() if e.fp else ""
        raise RuntimeError(f"Supabase {method} {path} failed ({e.code}): {err_body}")


def upsert_run(url: str, key: str, manifest: dict, mode: str, mode_stats: dict,
               benchmark_version: str = "v1") -> str:
    row = {
        "benchmark": manifest.get("benchmark", "componentbench"),
        "benchmark_version": benchmark_version,
        "mode": mode,
        "model_name": manifest["model_name"],
        "agent_name": manifest["agent_name"],
        "commit_sha": manifest.get("commit_sha", ""),
        "run_id_text": manifest["run_id"],
        "total_tasks": mode_stats["total"],
        "total_success": mode_stats["success"],
        "pass_rate": mode_stats["pass_rate"],
        "avg_steps": mode_stats.get("avg_steps", 0),
        "avg_duration_seconds": mode_stats.get("avg_duration", 0),
    }
    qs = "on_conflict=benchmark,run_id_text,mode,model_name,agent_name,benchmark_version"
    result = supabase_rpc(url, key, "POST", f"/runs?{qs}", [row],
                          extra_prefer="resolution=merge-duplicates")
    if isinstance(result, list) and len(result) > 0:
        return result[0]["id"]
    raise RuntimeError(f"Upsert run failed: {result}")


def upsert_episodes(url: str, key: str, run_uuid: str, episodes: list[dict]):
    BATCH = 100
    for i in range(0, len(episodes), BATCH):
        batch = episodes[i:i + BATCH]
        rows = []
        for ep in batch:
            rows.append({
                "run_uuid": run_uuid,
                "task_id": ep["task_id"],
                "canonical_type": ep["canonical_type"],
                "library": ep["library"],
                "difficulty_bucket": ep.get("difficulty_bucket", ""),
                "difficulty_tier": ep.get("difficulty_tier", ""),
                "success": ep["success"],
                "steps": ep["steps"],
                "duration_seconds": ep.get("duration_seconds", 0),
                "blob_episode_json_url": ep["blob_episode_json_url"],
                "blob_frames_raw_url": ep.get("blob_frames_raw_url", ""),
                "blob_frames_annot_url": ep.get("blob_frames_annot_url", ""),
                "blob_frames_som_url": ep.get("blob_frames_som_url", ""),
                "blob_frames_grid_url": ep.get("blob_frames_grid_url", ""),
            })
        qs = "on_conflict=run_uuid,task_id"
        supabase_rpc(url, key, "POST", f"/episodes?{qs}", rows,
                     extra_prefer="resolution=merge-duplicates")


def upload_one_episode(task_dir: Path, run_id: str, mode: str, namespace: str, dry_run: bool) -> dict | None:
    """Upload all blobs for a single episode. Returns enriched ep_data or None on error."""
    task_id = task_dir.name
    ep_json = task_dir / "episode.json"
    if not ep_json.exists():
        return None

    ep_data = json.loads(ep_json.read_text())
    base_path = f"{namespace}/runs/{run_id}/{mode}/{task_id}"
    blob_urls: dict[str, str] = {}

    if not dry_run:
        res = blob_upload(f"{base_path}/episode.json", ep_json)
        blob_urls["blob_episode_json_url"] = res["url"]
    else:
        blob_urls["blob_episode_json_url"] = f"DRY:{base_path}/episode.json"

    videos = ep_data.get("videos", {})
    for variant in VIDEO_VARIANTS:
        filename = videos.get(variant, "")
        if filename:
            local_mp4 = task_dir / filename
            if local_mp4.exists():
                col_name = f"blob_{variant}_url"
                if not dry_run:
                    res = blob_upload(f"{base_path}/{filename}", local_mp4)
                    blob_urls[col_name] = res["url"]
                else:
                    blob_urls[col_name] = f"DRY:{base_path}/{filename}"

    ep_data.update(blob_urls)
    return ep_data


def main():
    parser = argparse.ArgumentParser(description="Upload packed run to Vercel Blob + Supabase")
    parser.add_argument("--packed-dir", required=True, help="Path to packed run directory")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--namespace", default="componentbench", help="Blob key prefix")
    parser.add_argument("--benchmark-version", default="v1", choices=["v1", "v2"],
                        help="Benchmark version (v1 or v2)")
    parser.add_argument("--workers", type=int, default=1, help="Parallel upload threads (default=1)")
    args = parser.parse_args()

    packed_dir = Path(args.packed_dir)
    manifest_path = packed_dir / "manifest.json"
    if not manifest_path.exists():
        print(f"ERROR: No manifest.json in {packed_dir}")
        sys.exit(1)

    manifest = json.loads(manifest_path.read_text())
    run_id = manifest["run_id"]
    workers = max(1, args.workers)

    supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

    if not args.dry_run:
        if not supabase_url or not supabase_key:
            print("ERROR: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required")
            sys.exit(1)
        if not os.environ.get("BLOB_READ_WRITE_TOKEN"):
            print("ERROR: BLOB_READ_WRITE_TOKEN required")
            sys.exit(1)

    runs_dir = packed_dir / "runs" / run_id
    if not runs_dir.exists():
        print(f"ERROR: runs/{run_id} not found in packed dir")
        sys.exit(1)

    bench_version = args.benchmark_version
    namespace = args.namespace
    if bench_version == "v2" and namespace == "componentbench":
        namespace = "componentbench-v2"

    print(f"Workers: {workers}")
    print(f"Run ID:  {run_id}")
    print(f"Version: {bench_version}")
    print(f"Namespace: {namespace}")
    print()

    for mode_dir in sorted(runs_dir.iterdir()):
        if not mode_dir.is_dir():
            continue
        mode = mode_dir.name
        mode_stats = manifest.get("by_mode", {}).get(mode, {})
        if not mode_stats:
            print(f"  [SKIP] No stats for mode {mode}")
            continue

        print(f"\n=== Mode: {mode} (total={mode_stats['total']}, pass={mode_stats['pass_rate']:.1%}) ===")

        run_uuid = None
        if not args.dry_run:
            run_uuid = upsert_run(supabase_url, supabase_key, manifest, mode, mode_stats,
                                  benchmark_version=bench_version)
            print(f"  Run UUID: {run_uuid}")
        else:
            print("  [DRY] Would upsert run")

        task_dirs = sorted([d for d in mode_dir.iterdir() if d.is_dir()])
        total = len(task_dirs)

        if workers == 1:
            episode_batch = []
            for i, task_dir in enumerate(task_dirs):
                task_id = task_dir.name
                print(f"  [{i+1}/{total}] Uploading {task_id} ... ", end="", flush=True)
                result = upload_one_episode(task_dir, run_id, mode, namespace, args.dry_run)
                if result:
                    episode_batch.append(result)
                    print("OK")
                else:
                    print("SKIP")
        else:
            episode_batch = []
            done = 0
            ok = 0
            with ThreadPoolExecutor(max_workers=workers) as pool:
                futures = {
                    pool.submit(upload_one_episode, td, run_id, mode, namespace, args.dry_run): td
                    for td in task_dirs
                }
                for future in as_completed(futures):
                    done += 1
                    try:
                        result = future.result()
                        if result:
                            episode_batch.append(result)
                            ok += 1
                    except Exception as e:
                        td = futures[future]
                        log(f"  [ERROR] {td.name}: {e}")
                    if done % 100 == 0 or done == total:
                        log(f"  Progress: {done}/{total} uploaded, {ok} OK")

        if episode_batch:
            if not args.dry_run:
                print(f"  Upserting {len(episode_batch)} episodes to Supabase...")
                upsert_episodes(supabase_url, supabase_key, run_uuid, episode_batch)
                print("  Done")
            else:
                print(f"  [DRY] Would upsert {len(episode_batch)} episodes")

    print(f"\nUpload complete for run {run_id}")


if __name__ == "__main__":
    main()
