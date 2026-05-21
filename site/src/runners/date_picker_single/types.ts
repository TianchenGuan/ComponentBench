import type { TaskSpec } from '@/types';

/**
 * Common props for all date_picker_single task components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
