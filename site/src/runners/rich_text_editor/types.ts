import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific rich text editor components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * Helper to normalize text: collapse whitespace runs, trim ends
 */
export function normalizeText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Helper to check if two texts match (with whitespace normalization)
 */
export function textsMatch(actual: string, expected: string, options?: { normalize?: boolean; ignoreTrailingNewline?: boolean }): boolean {
  let a = actual;
  let e = expected;
  
  if (options?.ignoreTrailingNewline) {
    a = a.replace(/\n+$/, '');
    e = e.replace(/\n+$/, '');
  }
  
  if (options?.normalize !== false) {
    a = normalizeText(a);
    e = normalizeText(e);
  }
  
  return a === e;
}
