/**
 * View Mode Utilities
 * 
 * Manages the presentation/benchmark mode toggle.
 * - presentation: Full UI with navigation, goal, details (for demos)
 * - benchmark: Clean UI with component only (for agent testing)
 */

import type { ViewMode } from '../types';

const STORAGE_KEY = 'componentbench_view_mode';

/**
 * Get the current view mode from localStorage
 * Defaults to 'presentation' if not set
 */
export function getViewMode(): ViewMode {
  if (typeof window === 'undefined') return 'presentation';
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'presentation' || stored === 'benchmark') {
    return stored;
  }
  return 'presentation';
}

/**
 * Save view mode to localStorage
 */
export function setViewMode(mode: ViewMode): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, mode);
}

/**
 * Generate a task URL with the appropriate mode query parameter
 * @param taskId The task ID
 * @param mode The view mode (if 'benchmark', adds ?mode=benchmark)
 * @param benchVersion Optional benchmark version to include
 */
export function getTaskUrlWithMode(taskId: string, mode: ViewMode, benchVersion?: string): string {
  const baseUrl = `/task/${taskId}`;
  const params: string[] = [];
  if (mode === 'benchmark') {
    params.push('mode=benchmark');
  }
  if (benchVersion && benchVersion !== 'v1') {
    params.push(`bench=${benchVersion}`);
  }
  if (params.length > 0) {
    return `${baseUrl}?${params.join('&')}`;
  }
  return baseUrl;
}

/**
 * Parse view mode from URL search params
 * @param searchParams URLSearchParams or null
 */
export function parseViewModeFromUrl(searchParams: URLSearchParams | null): ViewMode {
  if (!searchParams) return 'presentation';
  
  const mode = searchParams.get('mode');
  if (mode === 'benchmark') {
    return 'benchmark';
  }
  return 'presentation';
}
