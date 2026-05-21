'use client';

/**
 * slider_range-mui-T01: Set temperature range to 15-30C
 * 
 * Layout: isolated_card centered in the viewport.
 * The card is titled "Thermostat". It contains a single MUI range Slider labeled "Temperature range (C)".
 * - Slider configuration: min=0, max=100, step=1, value is an array [from, to] (range mode), value labels show on hover/drag.
 * - Initial state: selected range is 20-37 with a line of text "Selected: 20 - 37".
 * No other controls (no Apply/Reset) and changes update immediately.
 * 
 * Success: Target range is set to 15-30 C (both thumbs).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Slider, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number[]>([20, 37]);

  useEffect(() => {
    if (value[0] === 15 && value[1] === 30) {
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
          Thermostat
        </Typography>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Temperature range (C)
        </Typography>
        <Box sx={{ px: 1 }}>
          <Slider
            value={value}
            onChange={handleChange}
            min={0}
            max={100}
            step={1}
            valueLabelDisplay="auto"
            data-testid="temperature-range"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Selected: {value[0]} - {value[1]}
        </Typography>
      </CardContent>
    </Card>
  );
}
