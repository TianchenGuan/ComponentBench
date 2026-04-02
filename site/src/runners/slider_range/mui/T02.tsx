'use client';

/**
 * slider_range-mui-T02: Set brightness range on discrete marks
 * 
 * Layout: isolated_card centered in the viewport.
 * The card title is "Display". It contains one MUI range Slider labeled "Brightness range (%)".
 * - Slider configuration: min=0, max=100, step=10, marks enabled, valueLabelDisplay='auto' (value labels appear when interacting).
 * - Initial state: the slider starts at 20-80 and the readout shows "Selected: 20 - 80".
 * No Apply/Reset button; updates are immediate.
 * 
 * Success: Target range is set to 30-70 % (both thumbs).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Slider, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

const marks = [
  { value: 0, label: '0%' },
  { value: 10, label: '10%' },
  { value: 20, label: '20%' },
  { value: 30, label: '30%' },
  { value: 40, label: '40%' },
  { value: 50, label: '50%' },
  { value: 60, label: '60%' },
  { value: 70, label: '70%' },
  { value: 80, label: '80%' },
  { value: 90, label: '90%' },
  { value: 100, label: '100%' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number[]>([20, 80]);

  useEffect(() => {
    if (value[0] === 30 && value[1] === 70) {
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Display
        </Typography>
        <Typography variant="subtitle2" sx={{ mb: 3 }}>
          Brightness range (%)
        </Typography>
        <Box sx={{ px: 1 }}>
          <Slider
            value={value}
            onChange={handleChange}
            min={0}
            max={100}
            step={10}
            marks={marks}
            valueLabelDisplay="auto"
            data-testid="brightness-range"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          Selected: {value[0]} - {value[1]}
        </Typography>
      </CardContent>
    </Card>
  );
}
