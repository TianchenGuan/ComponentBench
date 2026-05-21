import { NextRequest } from 'next/server';
import taskIndexV1 from '@/generated/task-index-v1.json';
import taskIndexV2 from '@/generated/task-index-v2.json';

const indices: Record<string, typeof taskIndexV1> = {
  v1: taskIndexV1,
  v2: taskIndexV2 as typeof taskIndexV1,
};

export async function GET(req: NextRequest) {
  const bench = req.nextUrl.searchParams.get('bench') || 'v1';
  const index = indices[bench] || indices.v1;
  const taskIds = (index as { tasks: { id: string }[] }).tasks.map(t => t.id);
  return Response.json({ task_ids: taskIds, total: taskIds.length, benchmark_version: bench });
}
