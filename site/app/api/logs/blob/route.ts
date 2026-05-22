import { NextRequest } from 'next/server';
import { isLogViewerEnabled, logDisabledResponse } from '@/lib/logConfig';
import { getRun, getLocalFilePath, createLocalFileStream, getLocalFileSize } from '@/lib/logLocalBackend';
import { Readable } from 'stream';

export const dynamic = 'force-dynamic';

const CONTENT_TYPES: Record<string, string> = {
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.json': 'application/json',
};

function contentTypeForFile(name: string): string {
  const dot = name.lastIndexOf('.');
  if (dot === -1) return 'application/octet-stream';
  return CONTENT_TYPES[name.slice(dot).toLowerCase()] || 'application/octet-stream';
}

export async function GET(req: NextRequest) {
  if (!isLogViewerEnabled()) return logDisabledResponse();

  const sp = req.nextUrl.searchParams;
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
  const nodeStream = createLocalFileStream(filePath);
  const webStream = Readable.toWeb(nodeStream) as ReadableStream;

  return new Response(webStream, {
    headers: {
      'Content-Type': contentTypeForFile(file),
      'Content-Length': String(size),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
