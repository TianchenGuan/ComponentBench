import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific time_picker components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
