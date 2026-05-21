'use client';

/**
 * color_text_input-mui-T03: Clear a MUI color text field with a clear adornment
 *
 * Layout: isolated_card centered with one MUI TextField labeled 'Border color (hex)'.
 * Component: TextField has a start preview square and a right-side clear IconButton (×)
 * that appears when the field has a value. Helper text indicates whether the current value is valid.
 *
 * Initial state: Border color contains #bdbdbd.
 * Feedback: when cleared, the input value becomes an empty string, the preview square shows
 * a neutral placeholder pattern, and the helper text changes to 'No color set'.
 *
 * Success: Border color field is cleared/unset (empty string).
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, TextField, Typography, Box, InputAdornment, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import type { TaskComponentProps } from '../types';
import { isValidHex6 } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('#bdbdbd');
  const [hasCompleted, setHasCompleted] = useState(false);

  const isValid = value === '' || isValidHex6(value);
  const isCleared = value === '';

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (isCleared) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [isCleared, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  const handleClear = () => {
    setValue('');
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Border Settings
        </Typography>
        
        <TextField
          fullWidth
          label="Border color (hex)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          error={!isValid}
          helperText={isCleared ? 'No color set' : (!isValid ? 'Invalid HEX color' : ' ')}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: isCleared ? 'transparent' : (isValidHex6(value) ? value : '#e0e0e0'),
                      borderRadius: 0.5,
                      border: '1px solid #ccc',
                      backgroundImage: isCleared
                        ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                        : 'none',
                      backgroundSize: '8px 8px',
                      backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                    }}
                  />
                </InputAdornment>
              ),
              endAdornment: value && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleClear}
                    data-testid="border-color-clear"
                    aria-label="clear"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            },
            htmlInput: {
              'data-testid': 'border-color-input',
            },
          }}
          data-testid="border-color-field"
        />
      </CardContent>
    </Card>
  );
}
