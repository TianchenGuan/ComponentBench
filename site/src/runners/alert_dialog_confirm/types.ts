import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific alert_dialog_confirm components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * Dialog state interface for tracking confirm/cancel actions
 */
export interface DialogState {
  dialog_open: boolean;
  last_action: 'confirm' | 'cancel' | 'dismiss' | null;
  dialog_instance: string | null;
}

/**
 * Declare the global window state for dialog tracking
 */
declare global {
  interface Window {
    __cbDialogState?: DialogState;
  }
}
