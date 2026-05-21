import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific menu components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
