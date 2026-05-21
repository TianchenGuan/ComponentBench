'use client';

/**
 * slider_range-mui-T05: Set range while respecting minimum distance (no swap)
 * 
 * Layout: isolated_card centered in the viewport.
 * The card is titled "Comfort zone". It contains a single MUI range Slider labeled "Comfort zone (C)".
 * - Slider configuration: min=0, max=100, step=1, range via value array, valueLabelDisplay='auto'.
 * - Behavior: a minimum distance of 10 is enforced in the onChange handler, and disableSwap is enabled so the active thumb will not swap when thumbs get close.
 * - Initial state: 20-37, shown as "Selected: 20 - 37". A helper line reads "Minimum gap: 10".
 * No Apply button; changes are immediate.
 * 
 * Success: Target range is set to 25-40 C (both thumbs).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Slider, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

const MIN_DISTANCE = 10;

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number[]>([20, 37]);

  useEffect(() => {
    if (value[0] === 25 && value[1] === 40) {
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleChange = (
    _event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) return;

    if (activeThumb === 0) {
      setValue([Math.min(newValue[0], value[1] - MIN_DISTANCE), value[1]]);
    } else {
      setValue([value[0], Math.max(newValue[1], value[0] + MIN_DISTANCE)]);
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Comfort zone
        </Typography>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Comfort zone (C)
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          Minimum gap: 10
        </Typography>
        <Box sx={{ px: 1 }}>
          <Slider
            value={value}
            onChange={handleChange}
            min={0}
            max={100}
            step={1}
            valueLabelDisplay="auto"
            disableSwap
            data-testid="comfort-zone-range"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Selected: {value[0]} - {value[1]}
        </Typography>
      </CardContent>
    </Card>
  );
}
