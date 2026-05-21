import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific date_input_text components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
