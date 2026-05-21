import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific data_table_sortable components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * Sort model representing the current sort state of a table
 */
export interface SortKey {
  column_key: string;
  direction: 'asc' | 'desc';
  priority: number;
}

export type SortModel = SortKey[];

/**
 * Helper to check if sort model matches target
 */
export function sortModelEquals(current: SortModel, target: SortModel): boolean {
  if (current.length !== target.length) return false;
  return target.every((targetKey, idx) => {
    const currentKey = current[idx];
    return (
      currentKey &&
      currentKey.column_key === targetKey.column_key &&
      currentKey.direction === targetKey.direction &&
      currentKey.priority === targetKey.priority
    );
  });
}
