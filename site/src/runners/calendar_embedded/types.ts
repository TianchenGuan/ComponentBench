import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific calendar_embedded components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
