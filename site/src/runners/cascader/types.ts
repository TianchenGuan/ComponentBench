import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific cascader components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * Cascader option structure
 */
export interface CascaderOption {
  value: string;
  label: string;
  children?: CascaderOption[];
  isLeaf?: boolean;
}

/**
 * Helper to compare path arrays for equality
 */
export function pathEquals(a: string[] | undefined | null, b: string[]): boolean {
  if (!a) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * Helper to compare sets of path arrays for equality (order-insensitive)
 */
export function pathSetsEqual(
  a: string[][] | undefined | null,
  b: string[][]
): boolean {
  if (!a) return false;
  if (a.length !== b.length) return false;
  
  // Convert to string representations for comparison
  const arrA = a.map(p => p.join('/'));
  const setB = new Set(b.map(p => p.join('/')));
  
  for (let i = 0; i < arrA.length; i++) {
    if (!setB.has(arrA[i])) return false;
  }
  return true;
}
