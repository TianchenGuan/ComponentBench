/**
 * Local filesystem backend for the log viewer.
 * Reads packed run data from LOG_LOCAL_ROOT.
 *
 * Expected structure:
 *   <LOG_LOCAL_ROOT>/
 *     <packed_run_dir>/
 *       manifest.json
 *       runs/<run_id>/<mode>/<task_id>/
 *         episode.json
 *         frames_raw.mp4
 *         frames_annot.mp4  (pixel modes)
 *         frames_som.mp4    (som mode)
 *         frames_grid.mp4   (pixel_grid mode)
 */
import { readFileSync, readdirSync, existsSync, statSync, createReadStream } from 'fs';
import { join } from 'path';
import { getLogLocalRoot } from './logConfig';

export interface RunSummary {
  id: string;
  run_id: string;
  model_name: string;
  agent_name: string;
  benchmark: string;
  commit_sha: string;
  modes: string[];
  total_episodes: number;
  total_success: number;
  pass_rate: number;
  created_at: string;
  by_mode: Record<string, {
    total: number;
    success: number;
    pass_rate: number;
    avg_steps: number;
    avg_duration: number;
  }>;
}

export interface EpisodeSummary {
  task_id: string;
  canonical_type: string;
  library: string;
  success: boolean;
  steps: number;
  duration_seconds: number;
  difficulty_bucket: string;
  difficulty_tier: string;
  mode: string;
  videos: Record<string, string>;
}

function readManifest(dir: string): RunSummary | null {
  const mpath = join(dir, 'manifest.json');
  if (!existsSync(mpath)) return null;
  try {
    const data = JSON.parse(readFileSync(mpath, 'utf-8'));
    return {
      id: dir.split('/').pop() || '',
      run_id: data.run_id || '',
      model_name: data.model_name || '',
      agent_name: data.agent_name || '',
      benchmark: data.benchmark || 'componentbench',
      commit_sha: data.commit_sha || '',
      modes: data.modes || [],
      total_episodes: data.total_episodes || 0,
      total_success: data.total_success || 0,
      pass_rate: data.pass_rate || 0,
      created_at: data.created_at || '',
      by_mode: data.by_mode || {},
    };
  } catch {
    return null;
  }
}

export function listRuns(): RunSummary[] {
  const root = getLogLocalRoot();
  if (!root || !existsSync(root)) return [];

  const runs: RunSummary[] = [];
  for (const entry of readdirSync(root)) {
    const dir = join(root, entry);
    if (!statSync(dir).isDirectory()) continue;
    const manifest = readManifest(dir);
    if (manifest) runs.push(manifest);
  }
  return runs.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function getRun(runDirName: string): RunSummary | null {
  const root = getLogLocalRoot();
  if (!root) return null;
  const dir = join(root, runDirName);
  if (!existsSync(dir)) return null;
  return readManifest(dir);
}

export function listEpisodes(runDirName: string, mode?: string): EpisodeSummary[] {
  const root = getLogLocalRoot();
  if (!root) return [];

  const run = getRun(runDirName);
  if (!run) return [];

  const episodes: EpisodeSummary[] = [];
  const runsPath = join(root, runDirName, 'runs', run.run_id);
  if (!existsSync(runsPath)) return [];

  const modeDirs = mode ? [mode] : readdirSync(runsPath).filter(d =>
    statSync(join(runsPath, d)).isDirectory()
  );

  for (const m of modeDirs) {
    const modeDir = join(runsPath, m);
    if (!existsSync(modeDir)) continue;

    for (const taskDirName of readdirSync(modeDir)) {
      const taskPath = join(modeDir, taskDirName);
      if (!statSync(taskPath).isDirectory()) continue;

      const epPath = join(taskPath, 'episode.json');
      if (!existsSync(epPath)) continue;

      try {
        const ep = JSON.parse(readFileSync(epPath, 'utf-8'));
        episodes.push({
          task_id: ep.task_id,
          canonical_type: ep.canonical_type || '',
          library: ep.library || '',
          success: ep.success,
          steps: ep.steps,
          duration_seconds: ep.duration_seconds || 0,
          difficulty_bucket: ep.difficulty_bucket || '',
          difficulty_tier: ep.difficulty_tier || '',
          mode: m,
          videos: ep.videos || {},
        });
      } catch {
        // skip broken files
      }
    }
  }

  return episodes;
}

export function getEpisode(runDirName: string, mode: string, taskId: string): object | null {
  const root = getLogLocalRoot();
  if (!root) return null;

  const run = getRun(runDirName);
  if (!run) return null;

  const epPath = join(root, runDirName, 'runs', run.run_id, mode, taskId, 'episode.json');
  if (!existsSync(epPath)) return null;

  try {
    return JSON.parse(readFileSync(epPath, 'utf-8'));
  } catch {
    return null;
  }
}

export function getLocalFilePath(runDirName: string, runId: string, mode: string, taskId: string, filename: string): string | null {
  const root = getLogLocalRoot();
  if (!root) return null;

  const fpath = join(root, runDirName, 'runs', runId, mode, taskId, filename);
  if (!existsSync(fpath)) return null;
  return fpath;
}

export function createLocalFileStream(filePath: string) {
  return createReadStream(filePath);
}

export function getLocalFileSize(filePath: string): number {
  try {
    return statSync(filePath).size;
  } catch {
    return 0;
  }
}
