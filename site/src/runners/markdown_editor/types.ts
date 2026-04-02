import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific markdown editor components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * Editor modes for @uiw/react-md-editor
 */
export type EditorMode = 'edit' | 'live' | 'preview';

/**
 * Normalize markdown text for comparison:
 * - Convert CRLF -> LF
 * - Trim trailing whitespace per line
 * - Trim leading/trailing blank lines
 */
export function normalizeMarkdown(text: string): string {
  // Convert CRLF to LF
  let normalized = text.replace(/\r\n/g, '\n');
  
  // Trim trailing whitespace per line
  normalized = normalized.split('\n').map(line => line.trimEnd()).join('\n');
  
  // Trim leading/trailing blank lines
  normalized = normalized.replace(/^\n+/, '').replace(/\n+$/, '');
  
  return normalized;
}

/**
 * Check if two markdown texts match (with normalization)
 */
export function markdownMatches(actual: string, expected: string): boolean {
  return normalizeMarkdown(actual) === normalizeMarkdown(expected);
}

/**
 * Check if markdown text matches any of the expected values
 */
export function markdownMatchesAny(actual: string, expectedValues: string[]): boolean {
  const normalizedActual = normalizeMarkdown(actual);
  return expectedValues.some(expected => normalizedActual === normalizeMarkdown(expected));
}

/**
 * Check if markdown is empty after normalization
 */
export function isMarkdownEmpty(text: string): boolean {
  return normalizeMarkdown(text) === '';
}
