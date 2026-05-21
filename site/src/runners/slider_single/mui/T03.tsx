'use client';

/**
 * slider_single-mui-T03: Reset Playback speed to default (1.0x)
 * 
 * Layout: isolated card centered in the viewport titled "Player".
 * The card contains one Material UI Slider labeled "Playback speed".
 * Configuration: range 0.5–2.0 with step=0.1 and marks at 0.5x, 1.0x, 1.5x, 2.0x.
 * A small "Reset to default" button (text button) sits on the same row as the label.
 * Initial state: the slider is set to 1.6x.
 * Feedback: a persistent label to the right reads "Speed: 1.6x" and updates immediately when the slider or reset button changes the value.
 * No modal/popover; no Apply/Cancel exists.
 * 
 * Success: The 'Playback speed' slider value equals 1.0.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Slider, Box, Stack, Button } from '@mui/material';
import type { TaskComponentProps } from '../types';

const marks = [
  { value: 0.5, label: '0.5x' },
  { value: 1.0, label: '1.0x' },
  { value: 1.5, label: '1.5x' },
  { value: 2.0, label: '2.0x' },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(1.6);

  useEffect(() => {
    if (value === 1.0) {
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  const handleReset = () => {
    setValue(1.0);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Player
        </Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="subtitle2">Playback speed</Typography>
          <Button
            size="small"
            onClick={handleReset}
            data-testid="btn-reset-playback-speed"
          >
            Reset to default
          </Button>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box sx={{ flex: 1, px: 1 }}>
            <Slider
              value={value}
              onChange={handleChange}
              min={0.5}
              max={2.0}
              step={0.1}
              marks={marks}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => `${v.toFixed(1)}x`}
              data-testid="slider-playback-speed"
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 70 }}>
            Speed: {value.toFixed(1)}x
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
