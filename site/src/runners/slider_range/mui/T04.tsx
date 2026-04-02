'use client';

/**
 * slider_range-mui-T04: Adjust small slider in compact density
 * 
 * Layout: isolated_card centered in the viewport.
 * Spacing mode is compact and the slider uses MUI's small size variant.
 * The card title is "Audio". It contains one MUI range Slider labeled "Volume range".
 * - Slider configuration: min=0, max=100, step=1, range via value array, size='small', valueLabelDisplay='auto'.
 * - Initial state: 30-70 with readout "Selected: 30 - 70".
 * No Apply/Reset controls. The smaller size makes the thumbs and track thinner than default.
 * 
 * Success: Target range is set to 45-65 units (both thumbs).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Slider, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number[]>([30, 70]);

  useEffect(() => {
    if (value[0] === 45 && value[1] === 65) {
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  return (
    <Card sx={{ width: 350 }}>
      <CardContent sx={{ py: 1.5, px: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          Audio
        </Typography>
        <Typography variant="body2" sx={{ mb: 1.5 }}>
          Volume range
        </Typography>
        <Box sx={{ px: 0.5 }}>
          <Slider
            value={value}
            onChange={handleChange}
            min={0}
            max={100}
            step={1}
            size="small"
            valueLabelDisplay="auto"
            data-testid="volume-range"
          />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Selected: {value[0]} - {value[1]}
        </Typography>
      </CardContent>
    </Card>
  );
}
