import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific masked_input components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
