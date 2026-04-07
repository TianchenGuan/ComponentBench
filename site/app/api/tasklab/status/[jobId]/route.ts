import { NextRequest, NextResponse } from 'next/server';
import { getJob } from '@/lib/tasklab-jobs';

export async function GET(
  _req: NextRequest,
  { params }: { params: { jobId: string } },
) {
  if (process.env.TASKLAB_ENABLED !== 'true') {
    return NextResponse.json(
      { error: 'Task Lab is not enabled on this server' },
      { status: 403 },
    );
  }

  const { jobId } = params;
  const job = getJob(jobId);

  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  const duration = job.completedAt
    ? (job.completedAt - job.startedAt) / 1000
    : (Date.now() - job.startedAt) / 1000;

  return NextResponse.json({
    status: job.status,
    phase: job.phase,
    phases: job.phases,
    taskId: job.taskId,
    output: job.output || undefined,
    error: job.error || undefined,
    filePath: job.filePath || undefined,
    designedYaml: job.designedYaml || undefined,
    duration: Math.round(duration * 10) / 10,
  });
}
