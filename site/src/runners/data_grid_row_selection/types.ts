import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific data_grid_row_selection components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * Selection model for row selection tracking
 */
export type SelectionModel = string[] | number[];

/**
 * Helper to check if selection sets are equal (order-independent)
 */
export function selectionEquals(current: (string | number)[], target: (string | number)[]): boolean {
  if (current.length !== target.length) return false;
  const currentSet = new Set(current.map(String));
  return target.every(id => currentSet.has(String(id)));
}

/**
 * Helper to check multi-instance selection
 */
export interface MultiInstanceSelection {
  primary: (string | number)[];
  secondary: (string | number)[];
}

export function multiInstanceSelectionEquals(
  current: MultiInstanceSelection,
  targetPrimary: (string | number)[],
  targetSecondary: (string | number)[]
): boolean {
  return (
    selectionEquals(current.primary, targetPrimary) &&
    selectionEquals(current.secondary, targetSecondary)
  );
}
