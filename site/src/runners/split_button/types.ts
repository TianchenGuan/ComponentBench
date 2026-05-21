import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific split button components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
