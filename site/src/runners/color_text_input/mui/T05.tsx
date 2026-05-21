'use client';

/**
 * color_text_input-mui-T05: Enter 8-digit HEXA (with alpha) in a MUI color field
 *
 * Layout: isolated_card centered with one field labeled 'Overlay color (hexa)'.
 * Component: MUI TextField configured to validate 8-digit HEXA strings (#RRGGBBAA).
 * Helper text shows the expected format.
 *
 * Initial state: #00000000 (fully transparent).
 * Feedback: when valid, a preview square behind a checker pattern shows the translucent color;
 * when invalid, the field shows an error message.
 *
 * Success: Overlay color parses to approximately RGBA(255, 0, 0, 0.50) - alpha tolerance 0.01.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, TextField, Typography, Box, InputAdornment } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { isColorWithinTolerance, isValidHex8, hexToRgba } from '../types';

const TARGET_RGBA = { r: 255, g: 0, b: 0, a: 0.5019607843137255 };

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('#00000000');
  const [hasCompleted, setHasCompleted] = useState(false);

  const isValid = isValidHex8(value);
  const parsedColor = hexToRgba(value);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (parsedColor && isColorWithinTolerance(parsedColor, TARGET_RGBA, 0, 0.01)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [parsedColor, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  const getOverlayColor = (): string => {
    if (!parsedColor) return 'rgba(0,0,0,0)';
    return `rgba(${parsedColor.r}, ${parsedColor.g}, ${parsedColor.b}, ${parsedColor.a})`;
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Overlay Settings
        </Typography>
        
        {/* Preview with checkerboard */}
        <Box
          sx={{
            width: '100%',
            height: 80,
            mb: 2,
            backgroundImage: `
              linear-gradient(45deg, #ccc 25%, transparent 25%),
              linear-gradient(-45deg, #ccc 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #ccc 75%),
              linear-gradient(-45deg, transparent 75%, #ccc 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            borderRadius: 1,
            position: 'relative',
            border: '1px solid #e0e0e0',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundColor: getOverlayColor(),
              borderRadius: 1,
            }}
          />
        </Box>
        
        <TextField
          fullWidth
          label="Overlay color (hexa)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          error={!isValid && value.length > 0}
          helperText={!isValid && value.length > 0 ? 'Enter 8-digit HEXA (e.g., #ff000080)' : 'Format: #RRGGBBAA'}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundImage: `
                        linear-gradient(45deg, #ccc 25%, transparent 25%),
                        linear-gradient(-45deg, #ccc 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, #ccc 75%),
                        linear-gradient(-45deg, transparent 75%, #ccc 75%)
                      `,
                      backgroundSize: '8px 8px',
                      backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                      borderRadius: 0.5,
                      border: '1px solid #ccc',
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: isValid ? getOverlayColor() : 'transparent',
                        borderRadius: 0.5,
                      }}
                    />
                  </Box>
                </InputAdornment>
              ),
            },
            htmlInput: {
              'data-testid': 'overlay-color-input',
            },
          }}
          data-testid="overlay-color-field"
        />
      </CardContent>
    </Card>
  );
}
