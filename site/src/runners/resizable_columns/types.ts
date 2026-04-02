import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific resizable columns components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * Column definition for resizable tables
 */
export interface ColumnDef {
  key: string;
  title: string;
  width: number;
  minWidth?: number;
  maxWidth?: number;
}

/**
 * Table data row
 */
export interface TableRow {
  id: string;
  [key: string]: string | number;
}

/**
 * Check if a width is within tolerance of a target
 */
export function isWithinTolerance(actual: number, target: number, tolerance: number): boolean {
  return Math.abs(actual - target) <= tolerance;
}

/**
 * Check if a width is within a range (inclusive)
 */
export function isInRange(actual: number, min: number, max: number): boolean {
  return actual >= min && actual <= max;
}

/**
 * Check if all column widths match targets within tolerance
 */
export function allWidthsMatch(
  widths: Record<string, number>,
  targets: Record<string, number>,
  tolerance: number
): boolean {
  for (const [key, target] of Object.entries(targets)) {
    const actual = widths[key];
    if (actual === undefined || !isWithinTolerance(actual, target, tolerance)) {
      return false;
    }
  }
  return true;
}

/**
 * Check if all column widths exactly match targets (tolerance = 0)
 */
export function allWidthsExactMatch(
  widths: Record<string, number>,
  targets: Record<string, number>
): boolean {
  for (const [key, target] of Object.entries(targets)) {
    const actual = widths[key];
    if (actual !== target) {
      return false;
    }
  }
  return true;
}
