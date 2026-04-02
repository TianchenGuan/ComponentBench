import { NextRequest } from 'next/server';
import { isLogViewerEnabled, logDisabledResponse, getLogBackend } from '@/lib/logConfig';
import { getEpisode } from '@/lib/logLocalBackend';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ runId: string; taskId: string }> }
) {
  if (!isLogViewerEnabled()) return logDisabledResponse();

  try {
    const { runId, taskId } = await params;
    const mode = req.nextUrl.searchParams.get('mode') || '';
    const backend = getLogBackend();

    if (backend === 'local') {
      if (!mode) return Response.json({ error: 'mode_required' }, { status: 400 });
      const ep = getEpisode(runId, mode, taskId);
      if (!ep) return Response.json({ error: 'episode_not_found', runId, taskId, mode }, { status: 404 });
      return Response.json(ep);
    }

    const { getEpisodeSupabase } = await import('@/lib/logSupabaseBackend');
    const ep = await getEpisodeSupabase(runId, taskId);
    if (!ep) return Response.json({ error: 'episode_not_found', runId, taskId }, { status: 404 });

    const blobUrl = ep.blob_episode_json_url;
    if (!blobUrl) return Response.json({ error: 'episode_not_found', runId, taskId }, { status: 404 });

    const blobResp = await fetch(blobUrl);
    if (!blobResp.ok) return Response.json({ error: 'episode_not_found' }, { status: 404 });
    const data = await blobResp.json();

    // Replace local filenames in `videos` with full public blob URLs so
    // the client can load them directly without the /api/logs/blob proxy.
    const VIDEO_URL_MAP: Record<string, string> = {
      frames_raw: ep.blob_frames_raw_url || '',
      frames_annot: ep.blob_frames_annot_url || '',
      frames_som: ep.blob_frames_som_url || '',
      frames_grid: ep.blob_frames_grid_url || '',
    };
    if (data.videos && typeof data.videos === 'object') {
      for (const key of Object.keys(data.videos)) {
        if (VIDEO_URL_MAP[key]) {
          data.videos[key] = VIDEO_URL_MAP[key];
        }
      }
    }

    return Response.json(data);
  } catch (e) {
    return Response.json({ error: 'internal_error', message: String(e) }, { status: 500 });
  }
}
