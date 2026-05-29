import { NextRequest } from 'next/server';
import path from 'path';
import { isRecordingEnabled, recordingDisabledResponse } from '@/lib/recording/config';
import { runDir, readJsonSafe } from '@/lib/recording/fsHelpers';
import type { RunConfig, RunProgress } from '@/lib/recording/schema';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  if (!isRecordingEnabled()) return recordingDisabledResponse();

  try {
    const runId = req.nextUrl.searchParams.get('run_id') || '';
    if (!runId) {
      return Response.json({ error: 'run_id required' }, { status: 400 });
    }

    const dir = runDir(runId);
    const runConfig = readJsonSafe<RunConfig>(path.join(dir, 'run.json'));
    if (!runConfig) {
      return Response.json({ error: 'run_not_found' }, { status: 404 });
    }

    const progress = readJsonSafe<RunProgress>(path.join(dir, 'progress.json'));
    if (!progress) {
      return Response.json({ error: 'progress_not_found' }, { status: 404 });
    }

    const doneSet = new Set([...progress.completed_tasks, ...progress.skipped_tasks]);
    const nextIndex = runConfig.task_ids.findIndex((id, i) => i >= progress.current_index && !doneSet.has(id));
    const nextTaskId = nextIndex >= 0 ? runConfig.task_ids[nextIndex] : null;

    return Response.json({
      run: runConfig,
      progress,
      next_task_id: nextTaskId,
      next_index: nextIndex >= 0 ? nextIndex : runConfig.total_tasks,
      is_complete: nextTaskId === null,
      completed_count: progress.completed_tasks.length,
      skipped_count: progress.skipped_tasks.length,
      remaining: runConfig.total_tasks - doneSet.size,
    });
  } catch (e) {
    return Response.json({ error: 'internal_error', message: String(e) }, { status: 500 });
  }
}
