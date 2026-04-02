import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific window_splitter components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
