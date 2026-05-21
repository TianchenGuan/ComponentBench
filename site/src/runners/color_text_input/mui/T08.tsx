'use client';

/**
 * color_text_input-mui-T08: Set Error color among three small, compact MUI fields
 *
 * Layout: dashboard card titled 'Status colors' with compact spacing.
 * Instances: 3 small-sized MUI TextFields labeled 'Success (hex)', 'Warning (hex)', and 'Error (hex)'.
 * Inputs are narrow and use the small size variant; each includes a tiny preview square.
 *
 * Initial state: Success=#2e7d32, Warning=#ed6c02, Error=#c62828.
 * Clutter: the card also shows a non-interactive preview row of three colored chips under the fields.
 *
 * Feedback: validation errors are shown inline; the Error chip updates when the Error field becomes valid.
 *
 * Success: The Error (hex) field parses to RGBA(211, 47, 47, 1.0).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, TextField, Typography, Box, Chip, Stack, InputAdornment } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { isColorWithinTolerance, isValidHex6, hexToRgba } from '../types';

const TARGET_RGBA = { r: 211, g: 47, b: 47, a: 1 };

export default function T08({ onSuccess }: TaskComponentProps) {
  const [successColor, setSuccessColor] = useState('#2e7d32');
  const [warningColor, setWarningColor] = useState('#ed6c02');
  const [errorColor, setErrorColor] = useState('#c62828');
  const [hasCompleted, setHasCompleted] = useState(false);

  const isSuccessValid = isValidHex6(successColor);
  const isWarningValid = isValidHex6(warningColor);
  const isErrorValid = isValidHex6(errorColor);
  const errorParsed = hexToRgba(errorColor);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (errorParsed && isColorWithinTolerance(errorParsed, TARGET_RGBA, 0, 0)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [errorParsed, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  return (
    <Card sx={{ width: 380 }}>
      <CardContent sx={{ p: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Status colors
        </Typography>
        
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
              Success (hex)
            </Typography>
            <TextField
              size="small"
              value={successColor}
              onChange={(e) => setSuccessColor(e.target.value)}
              error={!isSuccessValid}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          backgroundColor: isSuccessValid ? successColor : '#e0e0e0',
                          borderRadius: 0.5,
                          border: '1px solid #ccc',
                        }}
                      />
                    </InputAdornment>
                  ),
                  sx: { fontSize: 12 },
                },
                htmlInput: {
                  'data-testid': 'success-color-input',
                },
              }}
            />
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
              Warning (hex)
            </Typography>
            <TextField
              size="small"
              value={warningColor}
              onChange={(e) => setWarningColor(e.target.value)}
              error={!isWarningValid}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          backgroundColor: isWarningValid ? warningColor : '#e0e0e0',
                          borderRadius: 0.5,
                          border: '1px solid #ccc',
                        }}
                      />
                    </InputAdornment>
                  ),
                  sx: { fontSize: 12 },
                },
                htmlInput: {
                  'data-testid': 'warning-color-input',
                },
              }}
            />
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
              Error (hex)
            </Typography>
            <TextField
              size="small"
              value={errorColor}
              onChange={(e) => setErrorColor(e.target.value)}
              error={!isErrorValid}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          backgroundColor: isErrorValid ? errorColor : '#e0e0e0',
                          borderRadius: 0.5,
                          border: '1px solid #ccc',
                        }}
                      />
                    </InputAdornment>
                  ),
                  sx: { fontSize: 12 },
                },
                htmlInput: {
                  'data-testid': 'error-color-input',
                },
              }}
            />
          </Box>
        </Stack>
        
        {/* Preview chips */}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Preview
        </Typography>
        <Stack direction="row" spacing={1}>
          <Chip
            label="Done"
            size="small"
            sx={{ backgroundColor: isSuccessValid ? successColor : '#e0e0e0', color: '#fff' }}
          />
          <Chip
            label="Pending"
            size="small"
            sx={{ backgroundColor: isWarningValid ? warningColor : '#e0e0e0', color: '#fff' }}
          />
          <Chip
            label="Failed"
            size="small"
            sx={{ backgroundColor: isErrorValid ? errorColor : '#e0e0e0', color: '#fff' }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
