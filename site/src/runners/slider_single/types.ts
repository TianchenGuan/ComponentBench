import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific slider single components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
