import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific dialog_modal components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * Modal state interface for tracking open/close and close reasons
 */
export interface ModalState {
  open: boolean;
  close_reason:
    | 'cancel'
    | 'ok'
    | 'close_icon'
    | 'mask_click'
    | 'backdrop_click'
    | 'escape_key'
    | 'close_button'
    | 'close_preview_button'
    | 'agree_button'
    | 'accept_changes_button'
    | 'apply_update_button'
    | 'acknowledge_button'
    | 'return_to_dashboard_button'
    | 'return_to_settings_button'
    | 'primary_confirm_button'
    | 'done_button'
    | 'footer_close_button'
    | 'back_to_app_button'
    | null;
  modal_instance: string | null;
  /** v2 canonical predicate field; mirrors the active instance label when relevant */
  last_opened_instance?: string | null;
  step?: string | null;
  position?: { x: number; y: number } | null;
  related_instances?: Record<string, { open: boolean }>;
  last_drag_source?: 'title_bar' | 'body' | 'footer' | null;
  layout_saved?: boolean;
  /** Viewport coordinates of the dialog paper for drag tolerance checks */
  modal_bounds?: { left: number; top: number; right: number; bottom: number };
}

/**
 * Declare the global window state for modal tracking
 */
declare global {
  interface Window {
    __cbModalState?: ModalState;
  }
}
