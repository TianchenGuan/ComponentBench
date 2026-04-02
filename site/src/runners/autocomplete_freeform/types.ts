import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific autocomplete_freeform components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
