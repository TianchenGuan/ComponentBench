import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific hover card components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
