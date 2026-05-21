import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific checkbox group components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
