import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific time_input_text components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
