'use client';

/**
 * switch-mui-T02: Disable autoplay videos
 *
 * Layout: isolated_card centered in the viewport titled "Playback".
 * The card contains one labeled MUI Switch: "Autoplay videos".
 * Initial state: the switch is ON.
 * There are no other interactive controls in this card; only helper text is shown below the label.
 * Feedback: the switch updates instantly with no confirmation step.
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, FormControlLabel, Switch } from '@mui/material';
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
          Playback
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={checked}
              onChange={handleChange}
              data-testid="autoplay-videos-switch"
              inputProps={{ 'aria-checked': checked }}
            />
          }
          label="Autoplay videos"
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, ml: 4 }}>
          Videos will start playing automatically when visible.
        </Typography>
      </CardContent>
    </Card>
  );
}
