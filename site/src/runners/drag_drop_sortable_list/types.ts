import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific drag & drop sortable list components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * Item type for sortable lists
 */
export interface SortableItem {
  id: string;
  label: string;
}

/**
 * Helper to check if two arrays have the same elements in the same order
 */
export function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * Helper to get IDs from items
 */
export function getItemIds(items: SortableItem[]): string[] {
  return items.map(item => item.id);
}
