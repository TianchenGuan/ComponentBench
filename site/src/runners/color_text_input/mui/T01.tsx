'use client';

/**
 * color_text_input-mui-T01: Set Primary brand color in MUI hex TextField
 *
 * Layout: isolated_card centered with one MUI TextField labeled 'Primary brand color (hex)'.
 * Component: a standard MUI TextField configured for color entry. It has a small preview square
 * in the start adornment and helper text that shows an error if the value is not a valid 6-digit HEX color.
 *
 * Initial state: the field contains #000000.
 * Feedback: when the input parses as valid HEX, the preview square updates immediately
 * and the error helper text disappears.
 *
 * Success: Primary brand color parses to RGBA(25, 118, 210, 1.0).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, TextField, Typography, Box, InputAdornment } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { isColorWithinTolerance, isValidHex6, hexToRgba } from '../types';

const TARGET_RGBA = { r: 25, g: 118, b: 210, a: 1 };

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('#000000');
  const [hasCompleted, setHasCompleted] = useState(false);

  const isValid = isValidHex6(value);
  const parsedColor = hexToRgba(value);

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

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Theme Colors
        </Typography>
        
        <TextField
          fullWidth
          label="Primary brand color (hex)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          error={!isValid && value.length > 0}
          helperText={!isValid && value.length > 0 ? 'Enter a valid 6-digit HEX color (e.g., #1976d2)' : ' '}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: isValid ? value : '#e0e0e0',
                      borderRadius: 0.5,
                      border: '1px solid #ccc',
                    }}
                  />
                </InputAdornment>
              ),
            },
            htmlInput: {
              'data-testid': 'primary-brand-color-input',
            },
          }}
          data-testid="primary-brand-color-field"
        />
      </CardContent>
    </Card>
  );
}
