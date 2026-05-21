'use client';

/**
 * slider_single-mui-T10: Set Max requests to 873 (0–1000)
 * 
 * Layout: isolated card centered in the viewport titled "Rate limiting".
 * The card contains one Material UI Slider labeled "Max requests".
 * Configuration: min=0, max=1000, step=1. Marks are shown only at 0, 250, 500, 750, 1000 (coarse landmarks).
 * The slider uses valueLabelDisplay='auto' so the value label appears while dragging; a small read-only text "Current: XXX" shows after release.
 * Initial state: Max requests starts at 500.
 * There are no other interactive controls and no Apply/Cancel button.
 * Because the range is large, fine control is expected (agent may need keyboard adjustment after an approximate drag).
 * 
 * Success: The 'Max requests' slider value equals 873.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Slider, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

const marks = [
  { value: 0, label: '0' },
  { value: 250, label: '250' },
  { value: 500, label: '500' },
  { value: 750, label: '750' },
  { value: 1000, label: '1000' },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(500);

  useEffect(() => {
    if (value >= 872 && value <= 874) {
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Rate limiting
        </Typography>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Max requests
        </Typography>
        <Box sx={{ px: 1 }}>
          <Slider
            value={value}
            onChange={handleChange}
            min={0}
            max={1000}
            step={1}
            marks={marks}
            valueLabelDisplay="auto"
            data-testid="slider-max-requests"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          Current: {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
