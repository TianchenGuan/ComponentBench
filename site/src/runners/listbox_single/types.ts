import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific listbox single components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
