/**
 * Recording feature gate and config.
 * Recording is only available when RECORDING_ENABLED=true and not in production builds.
 */
import path from 'path';

export function isRecordingEnabled(): boolean {
  if (process.env.BENCHMARK_BUILD === '1') return false;
  if (process.env.NODE_ENV === 'production') return false;
  return process.env.RECORDING_ENABLED === 'true';
}

export function getRecordRoot(): string {
  // Default to a repo-relative folder so traces are easy to find and zip on any
  // OS. `npm run record` sets HUMAN_RECORD_ROOT=./human-traces explicitly.
  return process.env.HUMAN_RECORD_ROOT || path.join(process.cwd(), 'human-traces');
}

export function recordingDisabledResponse(): Response {
  return Response.json({ error: 'recording_disabled' }, { status: 404 });
}
