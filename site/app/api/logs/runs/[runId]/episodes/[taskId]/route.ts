import { NextRequest } from 'next/server';
import { isLogViewerEnabled, logDisabledResponse } from '@/lib/logConfig';
import { getEpisode } from '@/lib/logLocalBackend';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ runId: string; taskId: string }> }
) {
  if (!isLogViewerEnabled()) return logDisabledResponse();

  try {
    const { runId, taskId } = await params;
    const mode = req.nextUrl.searchParams.get('mode') || '';

    if (!mode) return Response.json({ error: 'mode_required' }, { status: 400 });
    const ep = getEpisode(runId, mode, taskId);
    if (!ep) return Response.json({ error: 'episode_not_found', runId, taskId, mode }, { status: 404 });
    return Response.json(ep);
  } catch (e) {
    return Response.json({ error: 'internal_error', message: String(e) }, { status: 500 });
  }
}
