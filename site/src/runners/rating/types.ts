import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific rating components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
