import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific toggle button components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
