/**
 * Log Viewer configuration (local-filesystem only).
 *
 * The public ComponentBench site reads runs from a local folder so users can
 * view their own evaluation outputs without any Supabase/auth setup.
 *
 * Env var:
 *   LOG_LOCAL_ROOT - absolute or repo-relative path to the runs folder.
 *                    Defaults to "<repo>/runs" (one level above site/).
 */
import { resolve } from 'path';

export function isLogViewerEnabled(): boolean {
  return true;
}

export function getLogLocalRoot(): string {
  const fromEnv = process.env.LOG_LOCAL_ROOT;
  if (fromEnv) {
    return resolve(process.cwd(), fromEnv);
  }
  // Site runs from <repo>/site/, runs live at <repo>/runs/.
  return resolve(process.cwd(), '..', 'runs');
}

export function logDisabledResponse() {
  return Response.json({ error: 'not_found' }, { status: 404 });
}
