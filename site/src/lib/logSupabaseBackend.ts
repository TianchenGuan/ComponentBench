/**
 * Supabase backend for the log viewer.
 * Queries Supabase for run/episode index data.
 * All blobs are PUBLIC — the website uses direct blob URLs (no proxying needed).
 *
 * Supports benchmark_version filtering: v1 runs have NULL or 'v1',
 * v2 runs have 'v2'. Defaults to 'v1' for backward compat.
 */

import type { BenchmarkVersion } from '@/types';

interface SupabaseRun {
  id: string;
  created_at: string;
  benchmark: string;
  benchmark_version: string | null;
  dataset_version: string;
  mode: string;
  model_name: string;
  agent_name: string;
  commit_sha: string;
  run_id_text: string;
  total_tasks: number;
  total_success: number;
  pass_rate: number;
  avg_steps: number;
  avg_duration_seconds: number;
}

interface SupabaseEpisode {
  run_uuid: string;
  task_id: string;
  canonical_type: string;
  library: string;
  difficulty_bucket: string;
  difficulty_tier: string;
  success: boolean;
  steps: number;
  duration_seconds: number;
  blob_episode_json_url: string;
  blob_frames_raw_url: string;
  blob_frames_annot_url: string;
  blob_frames_som_url: string;
  blob_frames_grid_url: string;
}

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || '';
}

function getServiceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || '';
}

async function supabaseQuery<T>(table: string, params: string = ''): Promise<T[]> {
  const url = `${getSupabaseUrl()}/rest/v1/${table}?${params}`;
  const res = await fetch(url, {
    headers: {
      'apikey': getServiceKey(),
      'Authorization': `Bearer ${getServiceKey()}`,
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Supabase query failed: ${res.status}`);
  return res.json();
}

async function supabaseQueryAll<T>(table: string, params: string = ''): Promise<T[]> {
  const PAGE_SIZE = 1000;
  const all: T[] = [];
  let offset = 0;

  while (true) {
    const url = `${getSupabaseUrl()}/rest/v1/${table}?${params}&limit=${PAGE_SIZE}&offset=${offset}`;
    const res = await fetch(url, {
      headers: {
        'apikey': getServiceKey(),
        'Authorization': `Bearer ${getServiceKey()}`,
      },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Supabase query failed: ${res.status}`);
    const rows: T[] = await res.json();
    all.push(...rows);
    if (rows.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return all;
}

/**
 * Build a PostgREST filter for benchmark_version.
 * v1 matches rows where benchmark_version IS NULL or = 'v1'.
 * v2 matches rows where benchmark_version = 'v2'.
 */
function versionFilter(bench: BenchmarkVersion): string {
  if (bench === 'v2') {
    return 'benchmark_version=eq.v2';
  }
  // Keep legacy rows without benchmark_version visible in v1, but exclude v2 rows.
  return 'or=(benchmark_version.is.null,benchmark_version.eq.v1)';
}

export async function listRunsSupabase(bench: BenchmarkVersion = 'v1') {
  const filter = versionFilter(bench);
  const params = filter ? `${filter}&order=created_at.desc` : 'order=created_at.desc';
  const rows = await supabaseQuery<SupabaseRun>('runs', params);

  const grouped: Record<string, {
    id: string;
    run_id: string;
    model_name: string;
    agent_name: string;
    benchmark: string;
    benchmark_version: string;
    commit_sha: string;
    modes: string[];
    mode_run_ids: Record<string, string>;
    total_episodes: number;
    total_success: number;
    pass_rate: number;
    created_at: string;
    by_mode: Record<string, { total: number; success: number; pass_rate: number; avg_steps: number; avg_duration: number }>;
  }> = {};

  for (const r of rows) {
    const key = `${r.run_id_text}_${r.model_name}`;
    if (!grouped[key]) {
      grouped[key] = {
        id: r.id,
        run_id: r.run_id_text,
        model_name: r.model_name,
        agent_name: r.agent_name,
        benchmark: r.benchmark,
        benchmark_version: r.benchmark_version || 'v1',
        commit_sha: r.commit_sha || '',
        modes: [],
        mode_run_ids: {},
        total_episodes: 0,
        total_success: 0,
        pass_rate: 0,
        created_at: r.created_at,
        by_mode: {},
      };
    }
    grouped[key].modes.push(r.mode);
    grouped[key].mode_run_ids[r.mode] = r.id;
    grouped[key].total_episodes += r.total_tasks;
    grouped[key].total_success += r.total_success;
    grouped[key].by_mode[r.mode] = {
      total: r.total_tasks,
      success: r.total_success,
      pass_rate: r.pass_rate,
      avg_steps: r.avg_steps,
      avg_duration: r.avg_duration_seconds,
    };
  }

  return Object.values(grouped).map(g => ({
    ...g,
    pass_rate: g.total_episodes > 0 ? g.total_success / g.total_episodes : 0,
  }));
}

export async function getRunSupabase(runId: string) {
  const rows = await supabaseQuery<SupabaseRun>('runs', `id=eq.${runId}`);
  return rows[0] || null;
}

export async function listEpisodesSupabase(runId: string) {
  const params = `run_uuid=eq.${runId}&order=task_id.asc`;
  const episodes = await supabaseQueryAll<SupabaseEpisode>('episodes', params);
  return episodes.map(e => ({
    task_id: e.task_id,
    canonical_type: e.canonical_type,
    library: e.library,
    success: e.success,
    steps: e.steps,
    duration_seconds: e.duration_seconds,
    difficulty_bucket: e.difficulty_bucket,
    difficulty_tier: e.difficulty_tier,
    blob_episode_json_url: e.blob_episode_json_url,
    blob_frames_raw_url: e.blob_frames_raw_url,
    blob_frames_annot_url: e.blob_frames_annot_url,
    blob_frames_som_url: e.blob_frames_som_url,
    blob_frames_grid_url: e.blob_frames_grid_url,
  }));
}

export async function getEpisodeSupabase(runId: string, taskId: string) {
  const rows = await supabaseQuery<SupabaseEpisode>(
    'episodes',
    `run_uuid=eq.${runId}&task_id=eq.${taskId}`
  );
  return rows[0] || null;
}
