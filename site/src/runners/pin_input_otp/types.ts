import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific pin_input_otp components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
