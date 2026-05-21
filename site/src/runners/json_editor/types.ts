import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific JSON editor components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * JSON value types
 */
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

/**
 * Helper to deep compare two JSON values
 * - Object key order is ignored
 * - Array order is respected
 */
export function jsonEquals(
  a: JsonValue,
  b: JsonValue,
  options?: { ignoreArrayOrder?: boolean }
): boolean {
  // Handle null
  if (a === null && b === null) return true;
  if (a === null || b === null) return false;

  // Handle primitives
  if (typeof a !== 'object' && typeof b !== 'object') {
    return a === b;
  }

  // Handle arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    if (options?.ignoreArrayOrder) {
      // Sort and compare (for set membership)
      const sortedA = [...a].map(v => JSON.stringify(v)).sort();
      const sortedB = [...b].map(v => JSON.stringify(v)).sort();
      return sortedA.every((v, i) => v === sortedB[i]);
    }
    return a.every((val, i) => jsonEquals(val, b[i], options));
  }

  // Handle objects
  if (typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) {
    const keysA = Object.keys(a as object);
    const keysB = Object.keys(b as object);
    if (keysA.length !== keysB.length) return false;
    return keysA.every(key => {
      const objA = a as { [key: string]: JsonValue };
      const objB = b as { [key: string]: JsonValue };
      return key in objB && jsonEquals(objA[key], objB[key], options);
    });
  }

  return false;
}

/**
 * Helper to get a value at a JSON path (e.g., "$.notifications.email")
 */
export function getJsonPath(obj: JsonValue, path: string): JsonValue | undefined {
  // Remove leading $. if present
  const cleanPath = path.replace(/^\$\.?/, '');
  if (!cleanPath) return obj;

  const parts = cleanPath.split('.');
  let current: JsonValue | undefined = obj;

  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    if (Array.isArray(current)) {
      const index = parseInt(part, 10);
      if (isNaN(index)) return undefined;
      current = current[index];
    } else {
      current = (current as { [key: string]: JsonValue })[part];
    }
  }

  return current;
}

/**
 * Helper to check if an array contains specific values
 */
export function arrayContains(
  arr: JsonValue[],
  values: JsonValue[],
  options?: { ignoreDuplicates?: boolean; ignoreOrder?: boolean }
): boolean {
  const arrStrings = arr.map(v => JSON.stringify(v));
  return values.every(v => {
    const vStr = JSON.stringify(v);
    return arrStrings.includes(vStr);
  });
}

/**
 * Helper to check if a number is within tolerance
 */
export function withinTolerance(
  actual: number,
  expected: number,
  tolerance: number
): boolean {
  return Math.abs(actual - expected) <= tolerance;
}

/**
 * Helper to safely parse JSON
 */
export function safeParseJson(str: string): { success: true; value: JsonValue } | { success: false; error: string } {
  try {
    const value = JSON.parse(str);
    return { success: true, value };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Parse error' };
  }
}

/**
 * Helper to format JSON with indentation
 */
export function formatJson(value: JsonValue, indent: number = 2): string {
  return JSON.stringify(value, null, indent);
}
