import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific autocomplete_restricted components
 * 
 * autocomplete_restricted: User MUST select from suggestions - custom/free text not allowed.
 * User types to filter, then selects from filtered options. Success = correct option selected.
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}
