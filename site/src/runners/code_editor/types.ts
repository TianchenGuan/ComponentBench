import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific code editor components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * Language type supported by code editors
 */
export type EditorLanguage = 'javascript' | 'typescript' | 'json' | 'python' | 'yaml' | 'sql' | 'toml' | 'text';

/**
 * Overlay type for code editor
 */
export type OverlayType = 'find' | 'replace' | 'goto_line' | null;

/**
 * Editor state for success checking
 */
export interface EditorState {
  content: string;
  language: EditorLanguage;
  saved?: boolean;
  wordWrap?: boolean;
  tabSize?: number;
  fontSize?: number;
  overlay?: {
    type: OverlayType;
    open: boolean;
  };
}

/**
 * Helper to normalize content for comparison:
 * - Normalize line endings (CRLF -> LF)
 * - Optionally trim trailing whitespace per line
 * - Optionally allow trailing newline
 */
export function normalizeContent(
  content: string,
  options?: {
    normalizeLineEndings?: boolean;
    ignoreTrailingWhitespace?: boolean;
    allowTrailingNewline?: boolean;
  }
): string {
  let result = content;
  
  if (options?.normalizeLineEndings !== false) {
    result = result.replace(/\r\n/g, '\n');
  }
  
  if (options?.ignoreTrailingWhitespace) {
    result = result.split('\n').map(line => line.trimEnd()).join('\n');
  }
  
  if (options?.allowTrailingNewline) {
    result = result.replace(/\n+$/, '');
  }
  
  return result;
}

/**
 * Helper to check if editor content matches expected content.
 * Uses multiple strategies:
 * 1. If both parse as valid JSON, compare parsed values (format-agnostic)
 * 2. Otherwise, normalize whitespace aggressively: trim each line, normalize
 *    indentation to 2-space units, strip trailing newlines
 */
export function contentMatches(
  actual: string,
  expected: string,
  options?: {
    normalizeLineEndings?: boolean;
    ignoreTrailingWhitespace?: boolean;
    allowTrailingNewline?: boolean;
  }
): boolean {
  // Strategy 1: JSON value comparison
  try {
    const actualJson = JSON.parse(actual);
    const expectedJson = JSON.parse(expected);
    if (JSON.stringify(actualJson) === JSON.stringify(expectedJson)) {
      return true;
    }
  } catch {
    // Not valid JSON — fall through
  }

  // Strategy 2: Indentation-stripped comparison (content lines match regardless of spacing)
  const stripIndent = (s: string) =>
    s.replace(/\r\n/g, '\n')
     .split('\n')
     .map(line => line.trim())
     .filter(line => line.length > 0)
     .join('\n');

  if (stripIndent(actual) === stripIndent(expected)) {
    return true;
  }

  // Strategy 3: Original exact comparison (with basic normalization)
  const normalizedActual = normalizeContent(actual, options);
  const normalizedExpected = normalizeContent(expected, options);
  return normalizedActual === normalizedExpected;
}

/**
 * Helper to check if content contains a substring
 */
export function contentContains(content: string, substring: string): boolean {
  const normalizedContent = normalizeContent(content, { normalizeLineEndings: true });
  const normalizedSubstring = normalizeContent(substring, { normalizeLineEndings: true });
  return normalizedContent.includes(normalizedSubstring);
}

/**
 * Helper to count occurrences of a substring
 */
export function countOccurrences(content: string, substring: string): number {
  const normalizedContent = normalizeContent(content, { normalizeLineEndings: true });
  let count = 0;
  let pos = 0;
  while ((pos = normalizedContent.indexOf(substring, pos)) !== -1) {
    count++;
    pos += substring.length;
  }
  return count;
}

/**
 * Generate a long file with numbered lines for scroll tasks
 */
export function generateNumberedLines(count: number, prefix: string = '// LINE '): string {
  const lines: string[] = [];
  for (let i = 1; i <= count; i++) {
    const paddedNum = String(i).padStart(3, '0');
    lines.push(`${prefix}${paddedNum}`);
  }
  return lines.join('\n');
}

/**
 * Generate a long JSON config file for scroll tasks
 */
export function generateLongJsonConfig(lineCount: number, targetLine: number): string {
  const lines: string[] = ['{'];
  for (let i = 2; i < lineCount; i++) {
    if (i === targetLine) {
      lines.push('  "timeoutMs": 1000,');
    } else if (i === targetLine + 10) {
      lines.push('  "retryMs": 500,');
    } else {
      lines.push(`  "setting${i}": ${i},`);
    }
  }
  // Remove trailing comma from last setting
  lines[lines.length - 1] = lines[lines.length - 1].replace(',', '');
  lines.push('}');
  return lines.join('\n');
}
