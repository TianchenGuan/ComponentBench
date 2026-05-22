import { NextRequest } from 'next/server';
import { isLogViewerEnabled, logDisabledResponse } from '@/lib/logConfig';
import { listRuns } from '@/lib/logLocalBackend';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  if (!isLogViewerEnabled()) return logDisabledResponse();

  try {
    const runs = listRuns();
    return Response.json(runs);
  } catch (e) {
    return Response.json({ error: 'internal_error', message: String(e) }, { status: 500 });
  }
}
