import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific color picker 2d components
 */
export interface TaskComponentProps {
  task: TaskSpec;
  onSuccess: () => void;
}

/**
 * RGBA color representation
 */
export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Helper to check if a color is within tolerance of a target
 */
export function isColorWithinTolerance(
  current: RGBA,
  target: RGBA,
  rgbaTolerance: number,
  alphaTolerance: number
): boolean {
  const rDiff = Math.abs(current.r - target.r);
  const gDiff = Math.abs(current.g - target.g);
  const bDiff = Math.abs(current.b - target.b);
  const aDiff = Math.abs(current.a - target.a);

  return rDiff <= rgbaTolerance && 
         gDiff <= rgbaTolerance && 
         bDiff <= rgbaTolerance && 
         aDiff <= alphaTolerance;
}

/**
 * Helper to check if a color exactly matches a target
 */
export function isColorEqual(current: RGBA, target: RGBA): boolean {
  return current.r === target.r &&
         current.g === target.g &&
         current.b === target.b &&
         current.a === target.a;
}

/**
 * Parse hex color to RGBA
 */
export function hexToRgba(hex: string): RGBA | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
  if (!result) return null;
  
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    a: result[4] ? parseInt(result[4], 16) / 255 : 1,
  };
}

/**
 * Parse rgba string to RGBA object
 */
export function parseRgba(str: string): RGBA | null {
  const match = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/);
  if (!match) return null;
  
  return {
    r: parseInt(match[1], 10),
    g: parseInt(match[2], 10),
    b: parseInt(match[3], 10),
    a: match[4] ? parseFloat(match[4]) : 1,
  };
}

/**
 * Get computed background color of an element as RGBA
 */
export function getComputedColorRgba(element: HTMLElement): RGBA | null {
  const style = window.getComputedStyle(element);
  const bgColor = style.backgroundColor;
  return parseRgba(bgColor);
}

/**
 * Common preset swatch colors
 */
export const COMMON_SWATCHES = [
  '#2e2e2e', '#868e96', '#fa5252', '#e64980', '#be4bdb',
  '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886',
  '#40c057', '#82c91e', '#fab005', '#fd7e14',
];

/**
 * Brand palette presets for AntD
 */
export const ANTD_BRAND_PALETTE = [
  { color: '#1677FF', label: 'Ocean Blue' },
  { color: '#F5222D', label: 'Error Red' },
  { color: '#FAAD14', label: 'Warning Gold' },
  { color: '#52C41A', label: 'Success Green' },
  { color: '#13C2C2', label: 'Cyan' },
  { color: '#722ED1', label: 'Purple' },
  { color: '#EB2F96', label: 'Magenta' },
];

/**
 * Status colors presets for AntD
 */
export const ANTD_STATUS_COLORS = [
  { color: '#FAAD14', label: 'Warning Gold' },
  { color: '#F5222D', label: 'Error Red' },
  { color: '#52C41A', label: 'Success Green' },
  { color: '#13C2C2', label: 'Info Cyan' },
];
