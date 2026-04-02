'use client';

/**
 * color_text_input-mui-T09: Enter a CSS color keyword into a MUI color field
 *
 * Layout: isolated_card centered with a single MUI TextField labeled 'Highlight color (CSS)'.
 * Component: the field accepts any valid CSS color string (e.g., hex, rgb(), or named colors).
 * A preview square shows the parsed color; helper text shows an error if the string cannot be parsed.
 *
 * Initial state: value is 'black'.
 * Feedback: when a valid CSS color name is entered, the preview updates and the helper text
 * indicates the parsed canonical value (shown as a small read-only caption like '#663399').
 *
 * Success: Highlight color parses to RGBA(102, 51, 153, 1.0) (the CSS named color 'rebeccapurple').
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, TextField, Typography, Box, InputAdornment } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { isColorWithinTolerance, parseColorString, RGBA } from '../types';

const TARGET_RGBA = { r: 102, g: 51, b: 153, a: 1 };

// Extended CSS color keywords
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
  cyan: { r: 0, g: 255, b: 255, a: 1 },
  magenta: { r: 255, g: 0, b: 255, a: 1 },
  navy: { r: 0, g: 0, b: 128, a: 1 },
  teal: { r: 0, g: 128, b: 128, a: 1 },
  olive: { r: 128, g: 128, b: 0, a: 1 },
  maroon: { r: 128, g: 0, b: 0, a: 1 },
  silver: { r: 192, g: 192, b: 192, a: 1 },
  lime: { r: 0, g: 255, b: 0, a: 1 },
  aqua: { r: 0, g: 255, b: 255, a: 1 },
  fuchsia: { r: 255, g: 0, b: 255, a: 1 },
};

function parseExtendedColor(str: string): RGBA | null {
  const trimmed = str.trim().toLowerCase();
  if (CSS_COLORS[trimmed]) {
    return CSS_COLORS[trimmed];
  }
  return parseColorString(str);
}

function rgbaToHex(rgba: RGBA): string {
  const r = rgba.r.toString(16).padStart(2, '0');
  const g = rgba.g.toString(16).padStart(2, '0');
  const b = rgba.b.toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('black');
  const [hasCompleted, setHasCompleted] = useState(false);

  const parsedColor = parseExtendedColor(value);
  const isValid = parsedColor !== null;

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (parsedColor && isColorWithinTolerance(parsedColor, TARGET_RGBA, 0, 0)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [parsedColor, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  const getPreviewColor = (): string => {
    if (!parsedColor) return '#e0e0e0';
    return `rgb(${parsedColor.r}, ${parsedColor.g}, ${parsedColor.b})`;
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Highlight Settings
        </Typography>
        
        <TextField
          fullWidth
          label="Highlight color (CSS)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          error={!isValid && value.length > 0}
          helperText={
            !isValid && value.length > 0
              ? 'Unrecognized color'
              : isValid && parsedColor
              ? `Parsed: ${rgbaToHex(parsedColor)}`
              : ' '
          }
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: getPreviewColor(),
                      borderRadius: 0.5,
                      border: '1px solid #ccc',
                    }}
                  />
                </InputAdornment>
              ),
            },
            htmlInput: {
              'data-testid': 'highlight-color-input',
            },
          }}
          data-testid="highlight-color-field"
        />
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Accepts hex, rgb(), or CSS color names (e.g., rebeccapurple)
        </Typography>
      </CardContent>
    </Card>
  );
}
