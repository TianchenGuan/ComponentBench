import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific tour teaching tip components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
