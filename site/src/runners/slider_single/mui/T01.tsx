'use client';

/**
 * slider_single-mui-T01: Set Temperature to 70 (discrete marks)
 * 
 * Layout: isolated card centered in the viewport.
 * The card contains a single Material UI Slider with visible marks and an aria-label "Temperature".
 * Configuration: min=10, max=110, step=10, marks=true. The slider shows a value label while dragging (valueLabelDisplay='auto').
 * Initial state: Temperature starts at 30.
 * Feedback: a small text readout under the slider shows "Current: XX" and updates immediately.
 * No other controls are present; no Apply/Cancel is required.
 * 
 * Success: The 'Temperature' slider value equals 70.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Slider, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

const marks = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 30, label: '30' },
  { value: 40, label: '40' },
  { value: 50, label: '50' },
  { value: 60, label: '60' },
  { value: 70, label: '70' },
  { value: 80, label: '80' },
  { value: 90, label: '90' },
  { value: 100, label: '100' },
  { value: 110, label: '110' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(30);

  useEffect(() => {
    if (value === 70) {
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
          Temperature
        </Typography>
        <Box sx={{ px: 1 }}>
          <Slider
            value={value}
            onChange={handleChange}
            min={10}
            max={110}
            step={10}
            marks={marks}
            valueLabelDisplay="auto"
            aria-label="Temperature"
            data-testid="slider-temperature"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          Current: {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
