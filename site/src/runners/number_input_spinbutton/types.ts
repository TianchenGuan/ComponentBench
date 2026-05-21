import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific number_input_spinbutton components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
