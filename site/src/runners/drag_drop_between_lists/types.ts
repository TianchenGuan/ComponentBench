import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific drag-drop between lists components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * Item type for droppable lists
 */
export interface DraggableItem {
  id: string;
  label: string;
}

/**
 * Container state for between-lists drag and drop
 */
export interface ContainerState {
  [containerId: string]: DraggableItem[];
}

/**
 * Helper to check if two sets have the same elements (order doesn't matter)
 */
export function setsEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const setA = new Set(a);
  const setB = new Set(b);
  for (let i = 0; i < a.length; i++) {
    if (!setB.has(a[i])) return false;
  }
  return true;
}

/**
 * Helper to check if two arrays have the same elements in the same order
 */
export function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

/**
 * Helper to get labels from items
 */
export function getItemLabels(items: DraggableItem[]): string[] {
  return items.map(item => item.label);
}

/**
 * Helper to get IDs from items
 */
export function getItemIds(items: DraggableItem[]): string[] {
  return items.map(item => item.id);
}

/**
 * Check if containers match target state (order doesn't matter)
 */
export function checkSetMembership(
  containers: ContainerState,
  target: Record<string, string[]>
): boolean {
  for (const [containerId, targetLabels] of Object.entries(target)) {
    const items = containers[containerId];
    if (!items) return false;
    const currentLabels = getItemLabels(items);
    if (!setsEqual(currentLabels, targetLabels)) return false;
  }
  return true;
}

/**
 * Check if containers match target state with exact order
 */
export function checkExactOrder(
  containers: ContainerState,
  target: Record<string, string[]>
): boolean {
  for (const [containerId, targetLabels] of Object.entries(target)) {
    const items = containers[containerId];
    if (!items) return false;
    const currentLabels = getItemLabels(items);
    if (!arraysEqual(currentLabels, targetLabels)) return false;
  }
  return true;
}
