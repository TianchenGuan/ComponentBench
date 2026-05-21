import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific select_native components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
