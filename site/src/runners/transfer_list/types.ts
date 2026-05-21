import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific transfer list components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * Helper to check if two arrays have the same elements (order independent)
 */
export function setsEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const setA = new Set(a);
  const setB = new Set(b);
  if (setA.size !== setB.size) return false;
  const arrA = Array.from(setA);
  for (let i = 0; i < arrA.length; i++) {
    if (!setB.has(arrA[i])) return false;
  }
  return true;
}

/**
 * Item type for transfer lists
 */
export interface TransferItem {
  key: string;
  title: string;
  disabled?: boolean;
}
