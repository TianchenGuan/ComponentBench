/**
 * Benchmark Version Utilities
 *
 * Manages the v1/v2 benchmark version switch.
 * Version is persisted in the URL query param `bench=v1|v2`.
 */

import type { BenchmarkVersion } from '../types';
import { DEFAULT_BENCHMARK_VERSION } from '../types';

const STORAGE_KEY = 'componentbench_version';

export function getBenchmarkVersion(): BenchmarkVersion {
  if (typeof window === 'undefined') return DEFAULT_BENCHMARK_VERSION;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'v1' || stored === 'v2') return stored;
  return DEFAULT_BENCHMARK_VERSION;
}

export function setBenchmarkVersion(version: BenchmarkVersion): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, version);
}

export function parseBenchVersionFromUrl(searchParams: URLSearchParams | null): BenchmarkVersion {
  if (!searchParams) return DEFAULT_BENCHMARK_VERSION;
  const v = searchParams.get('bench');
  if (v === 'v1' || v === 'v2') return v;
  return DEFAULT_BENCHMARK_VERSION;
}

/**
 * YAML source directory for each version (relative to repo root).
 */
export const YAML_DIRS: Record<BenchmarkVersion, string> = {
  v1: 'data/tasks_v1',
  v2: 'data/tasks_v2',
};

/**
 * Blob storage namespace prefix per version.
 */
export const BLOB_NAMESPACE: Record<BenchmarkVersion, string> = {
  v1: 'componentbench',
  v2: 'componentbench-v2',
};
