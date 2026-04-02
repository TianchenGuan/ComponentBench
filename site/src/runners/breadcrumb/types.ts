import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific breadcrumb components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
