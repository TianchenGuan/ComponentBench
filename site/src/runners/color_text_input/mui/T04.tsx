'use client';

/**
 * color_text_input-mui-T04: Fix an invalid hex value in a MUI color field
 *
 * Layout: form_section titled 'Tag styling' with a few unrelated TextFields
 * (tag name, tag description) above the color field.
 *
 * Component: the target is a MUI TextField labeled 'Tag background color (hex)' with inline validation.
 * It shows an error state and helper text when invalid.
 *
 * Initial state: the color field is prefilled with an invalid string '##12GG00'
 * and the field is marked invalid (aria-invalid=true).
 *
 * Feedback: when a valid HEX is entered, the error state clears and the preview square updates.
 *
 * Success: Tag background color parses to RGBA(18, 204, 0, 1.0) and the field is valid.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, TextField, Typography, Box, InputAdornment, Stack } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { isColorWithinTolerance, isValidHex6, hexToRgba } from '../types';

const TARGET_RGBA = { r: 18, g: 204, b: 0, a: 1 };

export default function T04({ onSuccess }: TaskComponentProps) {
  const [tagName, setTagName] = useState('Important');
  const [tagDescription, setTagDescription] = useState('High priority items');
  const [tagColor, setTagColor] = useState('##12GG00'); // Invalid initial value
  const [hasCompleted, setHasCompleted] = useState(false);

  const isValid = isValidHex6(tagColor);
  const parsedColor = hexToRgba(tagColor);

  const checkSuccess = useCallback(() => {
    if (hasCompleted) return;
    
    if (isValid && parsedColor && isColorWithinTolerance(parsedColor, TARGET_RGBA, 0, 0)) {
      setHasCompleted(true);
      onSuccess();
    }
  }, [isValid, parsedColor, hasCompleted, onSuccess]);

  useEffect(() => {
    checkSuccess();
  }, [checkSuccess]);

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Tag styling
        </Typography>
        
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Tag name"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            size="small"
          />
          
          <TextField
            fullWidth
            label="Tag description"
            value={tagDescription}
            onChange={(e) => setTagDescription(e.target.value)}
            size="small"
            multiline
            rows={2}
          />
          
          <TextField
            fullWidth
            label="Tag background color (hex)"
            value={tagColor}
            onChange={(e) => setTagColor(e.target.value)}
            error={!isValid}
            helperText={!isValid ? 'Enter a valid 6-digit HEX color (e.g., #12cc00)' : ' '}
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        backgroundColor: isValid ? tagColor : '#e0e0e0',
                        borderRadius: 0.5,
                        border: '1px solid #ccc',
                      }}
                    />
                  </InputAdornment>
                ),
              },
              htmlInput: {
                'data-testid': 'tag-background-color-input',
                'aria-invalid': !isValid,
              },
            }}
            data-testid="tag-background-color-field"
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
