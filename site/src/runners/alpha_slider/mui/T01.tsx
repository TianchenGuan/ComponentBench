'use client';

/**
 * alpha_slider-mui-T01: Set highlight opacity to 60%
 *
 * A centered card titled "Highlight Opacity" contains a simple MUI composite opacity control:
 * - A checkerboard preview square labeled "Highlight preview" that updates live.
 * - A single MUI Slider labeled "Opacity" (min 0, max 100) with the current value shown as a value label and as text "Opacity: XX%".
 * Initial state:
 * - Opacity starts at 100%.
 * No overlay, no extra controls, and only one slider instance on the page.
 *
 * Success: The opacity slider value corresponds to alpha=0.60 (60%). Alpha must be within ±0.02 of the target value.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Slider, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { isAlphaWithinTolerance } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [opacity, setOpacity] = useState(100);

  useEffect(() => {
    const alpha = opacity / 100;
    if (isAlphaWithinTolerance(alpha, 0.6, 0.02)) {
      onSuccess();
    }
  }, [opacity, onSuccess]);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    setOpacity(newValue as number);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Highlight Opacity
        </Typography>

        {/* Checkerboard preview */}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Highlight preview
        </Typography>
        <Box
          sx={{
            width: '100%',
            height: 100,
            mb: 3,
            backgroundImage: `
              linear-gradient(45deg, #ccc 25%, transparent 25%),
              linear-gradient(-45deg, #ccc 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #ccc 75%),
              linear-gradient(-45deg, transparent 75%, #ccc 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            borderRadius: 2,
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundColor: `rgba(255, 235, 59, ${opacity / 100})`,
              borderRadius: 2,
            }}
          />
        </Box>

        {/* Opacity slider */}
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Opacity
        </Typography>
        <Box sx={{ px: 1 }}>
          <Slider
            value={opacity}
            onChange={handleChange}
            min={0}
            max={100}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `${v}%`}
            aria-label="Opacity"
            data-testid="opacity-slider"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Opacity: {opacity}%
        </Typography>
      </CardContent>
    </Card>
  );
}
