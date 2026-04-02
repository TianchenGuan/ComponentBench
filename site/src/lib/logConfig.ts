/**
 * Log Viewer configuration and guard utilities.
 *
 * Env vars:
 *   LOG_VIEWER_ENABLED    - "true" to enable (default: disabled)
 *   BENCHMARK_BUILD       - "1" hard-disables logs always
 *   LOG_VIEWER_BACKEND    - "local" | "supabase"
 *   LOG_LOCAL_ROOT        - local packed-run root (for backend=local)
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   BLOB_READ_WRITE_TOKEN
 */

export function isLogViewerEnabled(): boolean {
  if (process.env.BENCHMARK_BUILD === '1') return false;
  return process.env.LOG_VIEWER_ENABLED === 'true';
}

export function getLogBackend(): 'local' | 'supabase' {
  return (process.env.LOG_VIEWER_BACKEND as 'local' | 'supabase') || 'local';
}

export function getLogLocalRoot(): string {
  return process.env.LOG_LOCAL_ROOT || '';
}

export function logDisabledResponse() {
  return Response.json({ error: 'not_found' }, { status: 404 });
}
