import { NextRequest } from 'next/server';
import { isLogViewerEnabled, logDisabledResponse, getLogBackend } from '@/lib/logConfig';
import { getRun, getLocalFilePath, createLocalFileStream, getLocalFileSize } from '@/lib/logLocalBackend';
import { Readable } from 'stream';

export async function GET(req: NextRequest) {
  if (!isLogViewerEnabled()) return logDisabledResponse();

  const sp = req.nextUrl.searchParams;
  const backend = getLogBackend();

  if (backend === 'local') {
    const runDirName = sp.get('run') || '';
    const mode = sp.get('mode') || '';
    const taskId = sp.get('task') || '';
    const file = sp.get('file') || '';

    if (!runDirName || !mode || !taskId || !file) {
      return Response.json({ error: 'missing_params', required: 'run, mode, task, file' }, { status: 400 });
    }

    const run = getRun(runDirName);
    if (!run) return Response.json({ error: 'run_not_found' }, { status: 404 });

    const filePath = getLocalFilePath(runDirName, run.run_id, mode, taskId, file);
    if (!filePath) return Response.json({ error: 'file_not_found' }, { status: 404 });

    const size = getLocalFileSize(filePath);
    const isVideo = file.endsWith('.mp4');
    const contentType = isVideo ? 'video/mp4' : 'application/json';

    const nodeStream = createLocalFileStream(filePath);
    const webStream = Readable.toWeb(nodeStream) as ReadableStream;

    return new Response(webStream, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(size),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }

  // Supabase backend: blobs are PUBLIC, so redirect directly.
  const blobUrl = sp.get('url') || '';
  if (!blobUrl) return Response.json({ error: 'url_param_required' }, { status: 400 });
  return Response.redirect(blobUrl, 302);
}
