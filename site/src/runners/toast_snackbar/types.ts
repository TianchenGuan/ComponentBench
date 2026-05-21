import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific toast/snackbar components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
