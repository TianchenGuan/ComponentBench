'use client';

/**
 * switch-mui-T01: Enable sound effects
 *
 * Layout: isolated_card centered in the viewport titled "Sound".
 * A single MUI Switch is presented with a left-side label using FormControlLabel: "Sound effects".
 * Initial state: the switch is OFF (unchecked).
 * The switch is medium size (default) and is not disabled.
 * Feedback: the thumb position and track color update immediately when the switch is toggled; there are no dialogs or snackbars.
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, FormControlLabel, Switch } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
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
          Sound
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={checked}
              onChange={handleChange}
              data-testid="sound-effects-switch"
              inputProps={{ 'aria-checked': checked }}
            />
          }
          label="Sound effects"
        />
      </CardContent>
    </Card>
  );
}
