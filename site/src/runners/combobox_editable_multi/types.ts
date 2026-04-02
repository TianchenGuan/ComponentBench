import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific combobox_editable_multi components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * Helper function to check if two arrays have the same set of values (order-insensitive)
 */
export function setsEqual(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) return false;
  const set1 = new Set(arr1.map(s => s.trim()));
  const set2 = new Set(arr2.map(s => s.trim()));
  if (set1.size !== set2.size) return false;
  // Use Array.from instead of for...of to avoid downlevelIteration requirement
  const arr1Items = Array.from(set1);
  for (let i = 0; i < arr1Items.length; i++) {
    if (!set2.has(arr1Items[i])) return false;
  }
  return true;
}
