import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific table_static components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
