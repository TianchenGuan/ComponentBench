'use client';

/**
 * checkbox-mui-T02: Turn off remember device (dark theme)
 *
 * Layout: isolated card centered in the viewport, rendered in dark theme.
 * The card title is "Sign-in". It contains a single Material UI Checkbox labeled "Remember this device".
 * Initial state: checked. There is no Save/Apply step; toggling the checkbox directly commits the state.
 * Distractors: none.
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, FormControlLabel, Checkbox } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.target.checked;
    setChecked(newChecked);
    if (!newChecked) {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Sign-in
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={handleChange}
              data-testid="cb-remember-this-device"
            />
          }
          label="Remember this device"
        />
      </CardContent>
    </Card>
  );
}
