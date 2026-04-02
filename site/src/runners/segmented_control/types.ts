import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific segmented control components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
