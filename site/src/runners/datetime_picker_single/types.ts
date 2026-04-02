import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific datetime_picker_single components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
