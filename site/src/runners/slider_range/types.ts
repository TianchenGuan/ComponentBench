import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific slider range components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
