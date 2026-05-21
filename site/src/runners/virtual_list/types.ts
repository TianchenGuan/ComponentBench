import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific virtual_list components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * Item data for virtual list rows
 */
export interface VirtualListItem {
  key: string;
  label: string;
  secondary?: string;
  status?: string;
  isSelected?: boolean;
  isStarred?: boolean;
  isFavorite?: boolean;
  isMuted?: boolean;
  isChecked?: boolean;
}

/**
 * Selection state for virtual lists
 */
export interface VirtualListSelectionState {
  mode: 'single' | 'multiple';
  selectedKeys: Set<string>;
}

/**
 * Helper to check if selection matches target for single-select
 */
export function selectionEquals(selectedKey: string | null, targetKey: string): boolean {
  return selectedKey === targetKey;
}

/**
 * Helper to check if selection matches target set for multi-select
 */
export function selectionSetEquals(selectedKeys: Set<string>, targetKeys: string[]): boolean {
  if (selectedKeys.size !== targetKeys.length) return false;
  return targetKeys.every(key => selectedKeys.has(key));
}

/**
 * Helper to check if an item is visible in the viewport
 */
export function isItemVisible(
  itemElement: HTMLElement | null,
  containerElement: HTMLElement | null,
  minVisibleRatio: number = 0.6
): boolean {
  if (!itemElement || !containerElement) return false;
  
  const itemRect = itemElement.getBoundingClientRect();
  const containerRect = containerElement.getBoundingClientRect();
  
  const visibleTop = Math.max(itemRect.top, containerRect.top);
  const visibleBottom = Math.min(itemRect.bottom, containerRect.bottom);
  const visibleHeight = Math.max(0, visibleBottom - visibleTop);
  const itemHeight = itemRect.height;
  
  if (itemHeight === 0) return false;
  
  const visibleRatio = visibleHeight / itemHeight;
  return visibleRatio >= minVisibleRatio;
}
