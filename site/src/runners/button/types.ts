import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific button components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
