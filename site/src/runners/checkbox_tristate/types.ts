import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific checkbox_tristate components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * Tristate checkbox states
 */
export type TristateValue = 'unchecked' | 'indeterminate' | 'checked';

/**
 * Cycle through tristate values: unchecked → checked → indeterminate → unchecked
 * (This matches the common UX pattern for tri-state checkboxes)
 */
export function cycleTristateValue(current: TristateValue): TristateValue {
  switch (current) {
    case 'unchecked':
      return 'checked';
    case 'checked':
      return 'indeterminate';
    case 'indeterminate':
      return 'unchecked';
  }
}

/**
 * Convert tristate value to display string
 */
export function tristateToDisplayString(value: TristateValue): string {
  switch (value) {
    case 'unchecked':
      return 'Unchecked';
    case 'checked':
      return 'Checked';
    case 'indeterminate':
      return 'Partial';
  }
}
