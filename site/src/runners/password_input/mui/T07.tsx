'use client';

/**
 * password_input-mui-T07: Match the password shown in the Target badge (visual guidance, corner placement)
 * 
 * The card is positioned in the bottom-left of the viewport. It contains a prominent badge
 * labeled "Target password" that displays an unmasked token (e.g., "RIVER-FOX-77").
 * Below the badge is a single MUI TextField labeled "Device password" configured as a password
 * input. The field starts empty. No Save button is present.
 * The intended interaction is to copy the exact token from the badge into the password field.
 * 
 * Success: The "Device password" field equals exactly the value displayed in the "Target password" badge.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Typography, Chip, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

const REFERENCE_PASSWORD = 'RIVER-FOX-77';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === REFERENCE_PASSWORD) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 380 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Device setup
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
            Target password
          </Typography>
          <Chip
            label={REFERENCE_PASSWORD}
            color="primary"
            variant="filled"
            data-testid="target-password-badge"
          />
        </Box>
        <TextField
          label="Device password"
          type="password"
          variant="outlined"
          fullWidth
          value={value}
          onChange={(e) => setValue(e.target.value)}
          inputProps={{ 'data-testid': 'device-password-input' }}
        />
      </CardContent>
    </Card>
  );
}
