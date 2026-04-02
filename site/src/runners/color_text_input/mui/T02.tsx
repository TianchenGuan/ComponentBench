'use client';

/**
 * color_text_input-mui-T02: Set Secondary brand color when two MUI color fields exist
 *
 * Layout: isolated_card centered with a small 'Theme colors' grid containing two MUI TextFields.
 * Instances: 2 color text inputs labeled 'Primary brand color (hex)' and 'Secondary brand color (hex)'.
 * Each has a preview square and validation helper text.
 *
 * Initial state: Primary=#1976d2, Secondary=#eeeeee.
 * Distractors: the two fields share the same placeholder and look identical apart from the label.
 * Feedback: each preview updates independently when its field becomes a valid HEX color.
 *
 * Success: Secondary brand color parses to RGBA(156, 39, 176, 1.0).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, TextField, Typography, Box, Grid, InputAdornment } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { isColorWithinTolerance, isValidHex6, hexToRgba } from '../types';

const TARGET_RGBA = { r: 156, g: 39, b: 176, a: 1 };

export default function T02({ onSuccess }: TaskComponentProps) {
  const [primary, setPrimary] = useState('#1976d2');
  const [secondary, setSecondary] = useState('#eeeeee');
  const [hasCompleted, setHasCompleted] = useState(false);

  const isPrimaryValid = isValidHex6(primary);
  const isSecondaryValid = isValidHex6(secondary);
  const secondaryParsed = hexToRgba(secondary);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (secondaryParsed && isColorWithinTolerance(secondaryParsed, TARGET_RGBA, 0, 0)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [secondaryParsed, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Theme colors
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Primary brand color (hex)"
              value={primary}
              onChange={(e) => setPrimary(e.target.value)}
              error={!isPrimaryValid && primary.length > 0}
              helperText={!isPrimaryValid && primary.length > 0 ? 'Invalid HEX' : ' '}
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          backgroundColor: isPrimaryValid ? primary : '#e0e0e0',
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
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Secondary brand color (hex)"
              value={secondary}
              onChange={(e) => setSecondary(e.target.value)}
              error={!isSecondaryValid && secondary.length > 0}
              helperText={!isSecondaryValid && secondary.length > 0 ? 'Invalid HEX' : ' '}
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          backgroundColor: isSecondaryValid ? secondary : '#e0e0e0',
                          borderRadius: 0.5,
                          border: '1px solid #ccc',
                        }}
                      />
                    </InputAdornment>
                  ),
                },
                htmlInput: {
                  'data-testid': 'secondary-brand-color-input',
                },
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
