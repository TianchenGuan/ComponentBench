import { NextRequest } from 'next/server';
import path from 'path';
import { isRecordingEnabled, recordingDisabledResponse } from '@/lib/recording/config';
import { runDir, episodeDir, atomicWriteJson, readJsonSafe, ensureDir } from '@/lib/recording/fsHelpers';
import type { EpisodeMeta, RunProgress } from '@/lib/recording/schema';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!isRecordingEnabled()) return recordingDisabledResponse();

  try {
    const body = await req.json();
    const { run_id, task_id, meta } = body as {
      run_id: string;
      task_id: string;
      meta: EpisodeMeta;
    };

    if (!run_id || !task_id || !meta) {
      return Response.json({ error: 'run_id, task_id, and meta required' }, { status: 400 });
    }

    const epDir = episodeDir(run_id, task_id);
    ensureDir(epDir);
    atomicWriteJson(path.join(epDir, 'meta.json'), meta);

    // Extract base task ID (strip _pass1/_pass2 suffix) for progress tracking.
    // Episodes are stored under task_id (with pass suffix), but progress tracks
    // base task IDs. A task is "completed" only after pass 2 finishes (or skip).
    const baseTaskId = task_id.replace(/_pass[12]$/, '');
    const passNum = meta.pass || 1;

    const dir = runDir(run_id);
    const progressPath = path.join(dir, 'progress.json');
    const progress = readJsonSafe<RunProgress>(progressPath);
    if (!progress) {
      return Response.json({ error: 'progress_not_found' }, { status: 404 });
    }

    // Only mark the base task as completed after pass 2, or on skip from any pass
    const shouldMarkDone = passNum === 2 || meta.status === 'SKIPPED';

    if (shouldMarkDone) {
      if (meta.status === 'SUCCESS' || meta.status === 'FAILED') {
        if (!progress.completed_tasks.includes(baseTaskId)) {
          progress.completed_tasks.push(baseTaskId);
        }
      } else if (meta.status === 'SKIPPED') {
        if (!progress.skipped_tasks.includes(baseTaskId)) {
          progress.skipped_tasks.push(baseTaskId);
        }
      }
    }
    // Pass 1 success or ABORTED: don't mark completed (pass 2 still needed)

    // Advance current_index past all done/skipped tasks
    const doneSet = new Set([...progress.completed_tasks, ...progress.skipped_tasks]);
    const runConfig = readJsonSafe<{ task_ids: string[] }>(path.join(dir, 'run.json'));
    if (runConfig) {
      let idx = progress.current_index;
      while (idx < runConfig.task_ids.length && doneSet.has(runConfig.task_ids[idx])) {
        idx++;
      }
      progress.current_index = idx;
    }

    progress.last_updated = new Date().toISOString();
    atomicWriteJson(progressPath, progress);

    return Response.json({ ok: true, progress });
  } catch (e) {
    return Response.json({ error: 'internal_error', message: String(e) }, { status: 500 });
  }
}
