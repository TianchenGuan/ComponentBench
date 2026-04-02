import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific collapsible disclosure components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
