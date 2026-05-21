import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific notification center components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * Notification item state
 */
export interface NotificationItem {
  id: string;
  title: string;
  message?: string;
  timestamp: string;
  read: boolean;
  archived: boolean;
  expanded?: boolean;
  pinned?: boolean;
  severity?: 'info' | 'warning' | 'error' | 'success';
}

/**
 * Notification center state
 */
export interface NotificationCenterState {
  notifications: NotificationItem[];
  activeView: 'All' | 'Unread' | 'Archived';
  searchQuery: string;
  filters: {
    type: 'All' | 'Info' | 'Warning' | 'Error' | 'Success';
  };
  settings: {
    mute_popups?: boolean;
    show_read?: boolean;
    dnd_minutes?: number;
  };
  sort_order?: 'newest' | 'oldest';
  panelOpen: boolean;
}
