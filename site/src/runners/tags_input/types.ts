import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific tags_input components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
