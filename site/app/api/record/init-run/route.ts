import { NextRequest } from 'next/server';
import path from 'path';
import { isRecordingEnabled, recordingDisabledResponse } from '@/lib/recording/config';
import { runDir, atomicWriteJson, readJsonSafe, ensureDir } from '@/lib/recording/fsHelpers';
import type { RunConfig, RunProgress } from '@/lib/recording/schema';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!isRecordingEnabled()) return recordingDisabledResponse();

  try {
    const body = await req.json();
    const { run_id, pass, task_ids, base_url } = body as {
      run_id: string;
      pass: number;
      task_ids: string[];
      base_url?: string;
    };

    if (!run_id || !task_ids?.length) {
      return Response.json({ error: 'run_id and task_ids required' }, { status: 400 });
    }

    const dir = runDir(run_id);
    ensureDir(dir);

    const runPath = path.join(dir, 'run.json');
    const progressPath = path.join(dir, 'progress.json');

    const existingRun = readJsonSafe<RunConfig>(runPath);
    if (existingRun) {
      const existingProgress = readJsonSafe<RunProgress>(progressPath);
      return Response.json({
        status: 'existing',
        run: existingRun,
        progress: existingProgress,
      });
    }

    const runConfig: RunConfig = {
      run_id,
      pass: pass || 1,
      created_at: new Date().toISOString(),
      base_url: base_url || 'http://127.0.0.1:3000',
      task_ids,
      total_tasks: task_ids.length,
    };

    const progress: RunProgress = {
      run_id,
      completed_tasks: [],
      skipped_tasks: [],
      current_index: 0,
      last_updated: new Date().toISOString(),
    };

    atomicWriteJson(runPath, runConfig);
    atomicWriteJson(progressPath, progress);

    return Response.json({ status: 'created', run: runConfig, progress });
  } catch (e) {
    return Response.json({ error: 'internal_error', message: String(e) }, { status: 500 });
  }
}
