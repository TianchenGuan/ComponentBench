'use client';

/**
 * switch-mui-T05: Dark theme: enable reduced motion
 *
 * Theme: dark (MUI dark palette applied to background and components).
 * Layout: isolated_card centered in the viewport titled "Accessibility".
 * The card contains one MUI Switch labeled "Reduce motion".
 * Initial state: the switch is OFF.
 * Feedback: the switch state updates immediately when toggled; there are no overlays or confirmation steps.
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, FormControlLabel, Switch } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = event.target.checked;
    setChecked(newChecked);
    if (newChecked) {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Accessibility
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={checked}
              onChange={handleChange}
              data-testid="reduce-motion-switch"
              inputProps={{ 'aria-checked': checked }}
            />
          }
          label="Reduce motion"
        />
      </CardContent>
    </Card>
  );
}
