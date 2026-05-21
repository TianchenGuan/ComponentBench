'use client';

/**
 * alpha_slider-mui-T07: Set small corner toast opacity to 15%
 *
 * A small card is anchored in the bottom-right corner of the viewport:
 * - Title: "Toast Opacity"
 * - A compact MUI Slider (size="small") labeled "Opacity" controls the alpha of a toast preview.
 * - The slider thumb and track are smaller than default; spacing is still comfortable, but the overall card is narrower.
 * - A text line under the slider shows "Current opacity: XX%".
 * Initial state:
 * - Opacity starts at 50%.
 * No overlay or extra controls.
 *
 * Success: The toast opacity alpha is set to 0.15 (15%). Alpha must be within ±0.015 of the target value.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Slider, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { isAlphaWithinTolerance } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [opacity, setOpacity] = useState(50);

  useEffect(() => {
    const alpha = opacity / 100;
    if (isAlphaWithinTolerance(alpha, 0.15, 0.015)) {
      onSuccess();
    }
  }, [opacity, onSuccess]);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    setOpacity(newValue as number);
  };

  return (
    <Card sx={{ width: 280 }}>
      <CardContent sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Toast Opacity
        </Typography>

        {/* Toast preview */}
        <Box
          sx={{
            display: 'inline-block',
            px: 2,
            py: 1,
            mb: 2,
            backgroundColor: `rgba(50, 50, 50, ${opacity / 100})`,
            color: '#fff',
            borderRadius: 1,
            fontSize: 12,
          }}
        >
          Toast message
        </Box>

        {/* Small slider */}
        <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
          Opacity
        </Typography>
        <Slider
          value={opacity}
          onChange={handleChange}
          min={0}
          max={100}
          size="small"
          valueLabelDisplay="auto"
          valueLabelFormat={(v) => `${v}%`}
          aria-label="Opacity"
          data-testid="opacity-slider"
        />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Current opacity: {opacity}%
        </Typography>
      </CardContent>
    </Card>
  );
}
