/**
 * Recording feature gate and config.
 * Recording is only available when RECORDING_ENABLED=true and not in production builds.
 */

export function isRecordingEnabled(): boolean {
  if (process.env.BENCHMARK_BUILD === '1') return false;
  if (process.env.NODE_ENV === 'production') return false;
  return process.env.RECORDING_ENABLED === 'true';
}

export function getRecordRoot(): string {
  return process.env.HUMAN_RECORD_ROOT || '/tmp/componentbench-human-traces';
}

export function recordingDisabledResponse(): Response {
  return Response.json({ error: 'recording_disabled' }, { status: 404 });
}
