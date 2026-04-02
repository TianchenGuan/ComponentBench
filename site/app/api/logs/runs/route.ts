import { NextRequest } from 'next/server';
import { isLogViewerEnabled, logDisabledResponse, getLogBackend } from '@/lib/logConfig';
import { listRuns } from '@/lib/logLocalBackend';
import type { BenchmarkVersion } from '@/types';

export async function GET(req: NextRequest) {
  if (!isLogViewerEnabled()) return logDisabledResponse();

  const bench = (req.nextUrl.searchParams.get('bench') || 'v1') as BenchmarkVersion;

  try {
    const backend = getLogBackend();

    if (backend === 'local') {
      const runs = listRuns();
      return Response.json(runs);
    }

    const { listRunsSupabase } = await import('@/lib/logSupabaseBackend');
    const runs = await listRunsSupabase(bench);
    return Response.json(runs);
  } catch (e) {
    return Response.json({ error: 'internal_error', message: String(e) }, { status: 500 });
  }
}
