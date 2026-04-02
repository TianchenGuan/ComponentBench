import type { TaskSpec } from '@/types';

/**
 * Common props for all task-specific color text input components
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
 * Parse a HEX color string to RGBA
 * Supports 3, 4, 6, or 8 character hex (with or without #)
 */
export function hexToRgba(hex: string): RGBA | null {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  let r: number, g: number, b: number, a: number = 1;
  
  if (hex.length === 3) {
    // #RGB -> #RRGGBB
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 4) {
    // #RGBA -> #RRGGBBAA
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
    a = parseInt(hex[3] + hex[3], 16) / 255;
  } else if (hex.length === 6) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  } else if (hex.length === 8) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
    a = parseInt(hex.slice(6, 8), 16) / 255;
  } else {
    return null;
  }
  
  if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) {
    return null;
  }
  
  return { r, g, b, a };
}

/**
 * Parse rgb() or rgba() color string to RGBA
 */
export function parseRgbString(str: string): RGBA | null {
  const rgbaMatch = str.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/i);
  if (rgbaMatch) {
    return {
      r: parseInt(rgbaMatch[1], 10),
      g: parseInt(rgbaMatch[2], 10),
      b: parseInt(rgbaMatch[3], 10),
      a: rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1,
    };
  }
  return null;
}

/**
 * Parse hsb() string to RGBA
 * HSB is the same as HSV
 */
export function parseHsbString(str: string): RGBA | null {
  const hsbMatch = str.match(/hsb\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)/i);
  if (hsbMatch) {
    const h = parseInt(hsbMatch[1], 10);
    const s = parseInt(hsbMatch[2], 10) / 100;
    const b = parseInt(hsbMatch[3], 10) / 100;
    return hsbToRgba(h, s, b, 1);
  }
  return null;
}

/**
 * Parse hsl() or hsla() color string to RGBA
 */
export function parseHslString(str: string): RGBA | null {
  const hslaMatch = str.match(/hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?(?:\s*,\s*([\d.]+))?\s*\)/i);
  if (hslaMatch) {
    const h = parseInt(hslaMatch[1], 10);
    const s = parseInt(hslaMatch[2], 10) / 100;
    const l = parseInt(hslaMatch[3], 10) / 100;
    const a = hslaMatch[4] !== undefined ? parseFloat(hslaMatch[4]) : 1;
    return hslToRgba(h, s, l, a);
  }
  return null;
}

/**
 * Convert HSB (HSV) to RGBA
 */
export function hsbToRgba(h: number, s: number, v: number, a: number): RGBA {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  
  let r = 0, g = 0, b = 0;
  
  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }
  
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
    a,
  };
}

/**
 * Convert HSL to RGBA
 */
export function hslToRgba(h: number, s: number, l: number, a: number): RGBA {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  
  let r = 0, g = 0, b = 0;
  
  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }
  
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
    a,
  };
}

/**
 * Parse CSS color keyword to RGBA
 */
const CSS_COLORS: Record<string, RGBA> = {
  rebeccapurple: { r: 102, g: 51, b: 153, a: 1 },
  black: { r: 0, g: 0, b: 0, a: 1 },
  white: { r: 255, g: 255, b: 255, a: 1 },
  red: { r: 255, g: 0, b: 0, a: 1 },
  green: { r: 0, g: 128, b: 0, a: 1 },
  blue: { r: 0, g: 0, b: 255, a: 1 },
  yellow: { r: 255, g: 255, b: 0, a: 1 },
  purple: { r: 128, g: 0, b: 128, a: 1 },
  orange: { r: 255, g: 165, b: 0, a: 1 },
  pink: { r: 255, g: 192, b: 203, a: 1 },
  gray: { r: 128, g: 128, b: 128, a: 1 },
  grey: { r: 128, g: 128, b: 128, a: 1 },
};

/**
 * Parse any color string to RGBA
 */
export function parseColorString(str: string): RGBA | null {
  const trimmed = str.trim().toLowerCase();
  
  // Check CSS keywords first
  if (CSS_COLORS[trimmed]) {
    return CSS_COLORS[trimmed];
  }
  
  // Try hex
  if (trimmed.startsWith('#') || /^[0-9a-f]{3,8}$/i.test(trimmed)) {
    return hexToRgba(trimmed);
  }
  
  // Try rgb/rgba
  if (trimmed.startsWith('rgb')) {
    return parseRgbString(trimmed);
  }
  
  // Try hsl/hsla
  if (trimmed.startsWith('hsl')) {
    return parseHslString(trimmed);
  }
  
  // Try hsb
  if (trimmed.startsWith('hsb')) {
    return parseHsbString(trimmed);
  }
  
  return null;
}

/**
 * Check if two RGBA colors are within tolerance
 */
export function isColorWithinTolerance(
  current: RGBA | null,
  target: RGBA,
  rgbTolerance: number = 0,
  alphaTolerance: number = 0
): boolean {
  if (!current) return false;
  
  return (
    Math.abs(current.r - target.r) <= rgbTolerance &&
    Math.abs(current.g - target.g) <= rgbTolerance &&
    Math.abs(current.b - target.b) <= rgbTolerance &&
    Math.abs(current.a - target.a) <= alphaTolerance
  );
}

/**
 * Validate a hex color string (6 digits)
 */
export function isValidHex6(str: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(str);
}

/**
 * Validate a hex color string (8 digits with alpha)
 */
export function isValidHex8(str: string): boolean {
  return /^#[0-9a-fA-F]{8}$/.test(str);
}

/**
 * Validate an RGB string
 */
export function isValidRgbString(str: string): boolean {
  const rgba = parseRgbString(str);
  if (!rgba) return false;
  return rgba.r >= 0 && rgba.r <= 255 &&
         rgba.g >= 0 && rgba.g <= 255 &&
         rgba.b >= 0 && rgba.b <= 255;
}

/**
 * Validate an RGBA string
 */
export function isValidRgbaString(str: string): boolean {
  const rgba = parseRgbString(str);
  if (!rgba) return false;
  return rgba.r >= 0 && rgba.r <= 255 &&
         rgba.g >= 0 && rgba.g <= 255 &&
         rgba.b >= 0 && rgba.b <= 255 &&
         rgba.a >= 0 && rgba.a <= 1;
}
