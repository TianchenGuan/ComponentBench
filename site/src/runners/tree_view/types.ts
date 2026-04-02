import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific tree_view components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * Tree node structure for tree data
 */
export interface TreeNode {
  key: string;
  title: string;
  children?: TreeNode[];
  isLeaf?: boolean;
}

/**
 * Helper to compare sets for equality
 */
export function setsEqual<T>(a: T[] | Set<T>, b: T[] | Set<T>): boolean {
  const setA = a instanceof Set ? a : new Set(a);
  const setB = b instanceof Set ? b : new Set(b);
  if (setA.size !== setB.size) return false;
  const arrA = Array.from(setA);
  for (const item of arrA) {
    if (!setB.has(item)) return false;
  }
  return true;
}

/**
 * Helper to compare arrays for exact order equality
 */
export function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
