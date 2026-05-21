'use client';

/**
 * slider_single-mui-T02: Set Zoom to 75%
 * 
 * Layout: isolated card centered in the viewport titled "Viewer".
 * The card contains one Material UI Slider labeled "Zoom".
 * Configuration: min=50, max=150, step=5. Marks are shown at 50%, 75%, 100%, 125%, 150% with visible labels under the track.
 * Initial state: Zoom starts at 100%.
 * Feedback: the value label appears while dragging and a persistent text "Zoom: 100%" updates live next to the label.
 * No Apply/Cancel buttons exist and there are no other sliders.
 * 
 * Success: The 'Zoom' slider value equals 75.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Slider, Box, Stack } from '@mui/material';
import type { TaskComponentProps } from '../types';

const marks = [
  { value: 50, label: '50%' },
  { value: 75, label: '75%' },
  { value: 100, label: '100%' },
  { value: 125, label: '125%' },
  { value: 150, label: '150%' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(100);

  useEffect(() => {
    if (value === 75) {
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Viewer
        </Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Zoom</Typography>
          <Typography variant="body2" color="text.secondary">
            Zoom: {value}%
          </Typography>
        </Stack>
        <Box sx={{ px: 1 }}>
          <Slider
            value={value}
            onChange={handleChange}
            min={50}
            max={150}
            step={5}
            marks={marks}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `${v}%`}
            data-testid="slider-zoom"
          />
        </Box>
      </CardContent>
    </Card>
  );
}
