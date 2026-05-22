import { NextRequest } from 'next/server';
import { isLogViewerEnabled, logDisabledResponse } from '@/lib/logConfig';
import { getRun, listEpisodes } from '@/lib/logLocalBackend';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  if (!isLogViewerEnabled()) return logDisabledResponse();

  try {
    const { runId } = await params;
    const mode = req.nextUrl.searchParams.get('mode') || undefined;

    const run = getRun(runId);
    if (!run) return Response.json({ error: 'run_not_found', runId }, { status: 404 });

    const episodes = listEpisodes(runId, mode);
    return Response.json({ run, episodes });
  } catch (e) {
    return Response.json({ error: 'internal_error', message: String(e) }, { status: 500 });
  }
}
