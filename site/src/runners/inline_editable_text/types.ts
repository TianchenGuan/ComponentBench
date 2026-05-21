import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific inline_editable_text components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
