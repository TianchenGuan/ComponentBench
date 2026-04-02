import { NextRequest } from 'next/server';
import path from 'path';
import { isRecordingEnabled, recordingDisabledResponse } from '@/lib/recording/config';
import { episodeDir, appendJsonLine, ensureDir } from '@/lib/recording/fsHelpers';
import type { RecordedStep } from '@/lib/recording/schema';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!isRecordingEnabled()) return recordingDisabledResponse();

  try {
    const body = await req.json();
    const { run_id, task_id, step } = body as {
      run_id: string;
      task_id: string;
      step: RecordedStep;
    };

    if (!run_id || !task_id || step == null) {
      return Response.json({ error: 'run_id, task_id, and step required' }, { status: 400 });
    }

    const epDir = episodeDir(run_id, task_id);
    ensureDir(epDir);
    appendJsonLine(path.join(epDir, 'trace.jsonl'), step);

    return Response.json({ ok: true, step_index: step.i });
  } catch (e) {
    return Response.json({ error: 'internal_error', message: String(e) }, { status: 500 });
  }
}
