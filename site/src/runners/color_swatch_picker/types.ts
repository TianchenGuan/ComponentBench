import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific color swatch picker components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * Standard swatch colors used across tasks
 * Based on AntD and Mantine default palettes
 */
export const BRAND_SWATCHES = [
  { color: '#1677ff', name: 'Ant Blue' },
  { color: '#13c2c2', name: 'Cyan' },
  { color: '#52c41a', name: 'Green' },
  { color: '#faad14', name: 'Gold' },
  { color: '#fa8c16', name: 'Warm Orange' },
  { color: '#f5222d', name: 'Red' },
  { color: '#722ed1', name: 'Purple' },
  { color: '#eb2f96', name: 'Magenta' },
];

export const NEUTRAL_SWATCHES = [
  { color: '#000000', name: 'Black' },
  { color: '#434343', name: 'Dark Gray' },
  { color: '#8c8c8c', name: 'Mid Gray' },
  { color: '#d9d9d9', name: 'Light Gray' },
  { color: '#ffffff', name: 'White' },
];

export const STATUS_SWATCHES = [
  { color: '#52c41a', name: 'Success' },
  { color: '#faad14', name: 'Warning' },
  { color: '#f5222d', name: 'Error' },
  { color: '#1677ff', name: 'Info' },
];

// Mantine's default swatch colors
export const MANTINE_SWATCHES = [
  '#25262b',
  '#868e96',
  '#fa5252',
  '#e64980',
  '#be4bdb',
  '#7950f2',
  '#4c6ef5',
  '#228be6',
  '#15aabf',
  '#12b886',
  '#40c057',
  '#82c91e',
  '#fab005',
  '#fd7e14',
];

// Extended swatch list for scroll tasks
export const EXTENDED_MANTINE_SWATCHES = [
  '#f8f9fa', '#f1f3f5', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd', '#868e96', '#495057', '#343a40', '#212529',
  '#fff5f5', '#ffe3e3', '#ffc9c9', '#ffa8a8', '#ff8787', '#ff6b6b', '#fa5252', '#f03e3e', '#e03131', '#c92a2a',
  '#e3fafc', '#c5f6fa', '#99e9f2', '#66d9e8', '#3bc9db', '#22b8cf', '#15aabf', '#1098ad', '#0c8599', '#0b7285',
  '#ebfbee', '#d3f9d8', '#b2f2bb', '#8ce99a', '#69db7c', '#51cf66', '#40c057', '#37b24d', '#2f9e44', '#2b8a3e',
  '#fff9db', '#fff3bf', '#ffec99', '#ffe066', '#ffd43b', '#fcc419', '#fab005', '#f59f00', '#f08c00', '#e67700',
  '#f3f0ff', '#e5dbff', '#d0bfff', '#b197fc', '#9775fa', '#845ef7', '#7950f2', '#7048e8', '#6741d9', '#5f3dc4',
];

// Teal ramp for scroll task
export const TEAL_RAMP_SWATCHES = [
  '#f0fdfa', '#ccfbf1', '#99f6e4', '#5eead4', '#2dd4bf', '#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a',
  '#e6fffa', '#b2f5ea', '#81e6d9', '#4fd1c5', '#38b2ac', '#319795', '#2c7a7a', '#285e61', '#234e52', '#1d4044',
  '#e0f2f1', '#b2dfdb', '#80cbc4', '#4db6ac', '#26a69a', '#009688', '#00897b', '#00796b', '#00695c', '#004d40',
  '#defdf3', '#b9f8e6', '#94f2d8', '#6eedc9', '#49e7bb', '#24e1ad', '#1dc9a0', '#19b192', '#159985', '#128177',
  '#d0f5ed', '#a1ece0', '#72e2d4', '#43d9c7', '#2ecfbb', '#29c5ad', '#24bb9f', '#1fb191', '#1aa783', '#159c75',
];

// Grayscale for match reference tasks
export const GRAYSCALE_SWATCHES = [
  '#ffffff', '#fbfbfc', '#f8f9fa', '#f6f6f7', '#f1f3f5', '#eceef0', '#e9ecef', '#e5e7ea',
  '#dee2e6', '#d9dde1', '#d3d7dc', '#ced4da', '#c8ced4', '#c2c8ce', '#bdc3c9', '#b7bdc3',
  '#b2b8be', '#adb5bd', '#a0a7af', '#949ba3', '#868e96', '#707982', '#5c6670', '#495057',
  '#3f464e', '#343a40', '#2a2f34', '#212529',
];

// Blues preset for chart tasks
export const BLUES_SWATCHES = [
  { color: '#e6f4ff', name: 'Light Blue 1' },
  { color: '#bae0ff', name: 'Light Blue 2' },
  { color: '#91caff', name: 'Blue 3' },
  { color: '#69b1ff', name: 'Blue 4' },
  { color: '#4096ff', name: 'Blue 5' },
  { color: '#1677ff', name: 'Ant Blue' },
  { color: '#0958d9', name: 'Blue 7' },
  { color: '#003eb3', name: 'Blue 8' },
  { color: '#002c8c', name: 'Blue 9' },
  { color: '#001d66', name: 'Dark Blue' },
  { color: '#2f54eb', name: 'Geek Blue' },
  { color: '#1d39c4', name: 'Navy' },
  { color: '#10239e', name: 'Dark Navy' },
];

/**
 * Normalize a hex color to lowercase 6-digit format
 */
export function normalizeHex(color: string | null | undefined): string {
  if (!color) return '';
  let hex = color.toLowerCase().replace('#', '');
  
  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  
  // Handle 8-digit hex (with alpha)
  if (hex.length === 8) {
    hex = hex.slice(0, 6);
  }
  
  return '#' + hex;
}

/**
 * Check if two hex colors match (case-insensitive)
 */
export function hexMatches(color1: string | null | undefined, color2: string): boolean {
  return normalizeHex(color1) === normalizeHex(color2);
}
