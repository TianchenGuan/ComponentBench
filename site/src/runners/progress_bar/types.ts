import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific progress bar components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
