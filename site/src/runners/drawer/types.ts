import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific drawer components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
