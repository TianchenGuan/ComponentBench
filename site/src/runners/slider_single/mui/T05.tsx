'use client';

/**
 * slider_single-mui-T05: Drag Opacity to 0.65
 * 
 * Layout: isolated card centered in the viewport.
 * The card contains one Material UI Slider labeled "Opacity".
 * Configuration: min=0.00, max=1.00, step=0.05. No marks are displayed to force reliance on the value label.
 * The slider uses valueLabelDisplay='auto' so a value bubble appears while dragging and shows two decimals.
 * Initial state: Opacity starts at 0.30.
 * Feedback: below the slider, a small text readout shows "Current opacity: 0.xx" after release.
 * No Apply/Cancel; changes are immediate.
 * 
 * Success: The 'Opacity' slider value equals 0.65 (step=0.05).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Slider, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(0.30);

  useEffect(() => {
    if (Math.abs(value - 0.65) < 0.001) {
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Opacity
        </Typography>
        <Box sx={{ px: 1 }}>
          <Slider
            value={value}
            onChange={handleChange}
            min={0}
            max={1}
            step={0.05}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => v.toFixed(2)}
            data-testid="slider-opacity"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Current opacity: {value.toFixed(2)}
        </Typography>
      </CardContent>
    </Card>
  );
}
