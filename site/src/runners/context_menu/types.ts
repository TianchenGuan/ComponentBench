import type { TaskSpec } from '@/types';

/**
 * Common props for all context_menu task components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
