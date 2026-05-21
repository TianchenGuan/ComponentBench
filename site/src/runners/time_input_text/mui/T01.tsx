'use client';

/**
 * time_input_text-mui-T01: Set a native HTML time field (MUI TextField)
 * 
 * Layout: isolated_card centered, light theme, comfortable spacing.
 * A single MUI core TextField labeled "Lunch time" is rendered with input type='time'.
 * - Configuration: step=60s (minute precision), fullWidth=false.
 * - Initial state: empty.
 * - The browser may show a native time picker UI on focus, but typing '12:00' directly into the field is supported.
 * - No distractors; clutter=none.
 * 
 * Success: The MUI TextField labeled "Lunch time" has value 12:00 (24-hour, minutes).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === '12:00') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Schedule</Typography>
        <Box>
          <Typography component="label" htmlFor="lunch-time" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
            Lunch time
          </Typography>
          <TextField
            id="lunch-time"
            type="time"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            inputProps={{
              step: 60,
              'data-testid': 'lunch-time',
            }}
            sx={{ width: 200 }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
