'use client';

/**
 * password_input-mui-T04: Use the suggested formatted password (mixed guidance)
 * 
 * A centered card titled "Create app password" shows a highlighted Chip labeled "Suggested password"
 * displaying "Forest#1290". Beneath it is a MUI TextField labeled "App password" configured as
 * type=password.
 * The TextField starts empty and has helper text: "Use the suggested password exactly".
 * There are no other inputs or confirmation buttons; the chip is purely a visual reference.
 * 
 * Success: The TextField labeled "App password" has value exactly "Forest#1290".
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Typography, Chip, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

const SUGGESTED_PASSWORD = 'Forest#1290';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === SUGGESTED_PASSWORD) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Create app password
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
            Suggested password
          </Typography>
          <Chip
            label={SUGGESTED_PASSWORD}
            color="primary"
            data-testid="suggested-password"
          />
        </Box>
        <TextField
          label="App password"
          type="password"
          variant="outlined"
          fullWidth
          value={value}
          onChange={(e) => setValue(e.target.value)}
          helperText="Use the suggested password exactly."
          inputProps={{ 'data-testid': 'app-password-input' }}
        />
      </CardContent>
    </Card>
  );
}
