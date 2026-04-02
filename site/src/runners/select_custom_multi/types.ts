import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific select_custom_multi components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
