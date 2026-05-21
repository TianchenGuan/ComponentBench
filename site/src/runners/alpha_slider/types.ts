import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific alpha slider components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * Helper to check if alpha is within tolerance
 */
export function isAlphaWithinTolerance(
  current: number,
  target: number,
  tolerance: number
): boolean {
  return Math.abs(current - target) <= tolerance;
}
