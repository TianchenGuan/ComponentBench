'use client';

/**
 * alpha_slider-mui-T02: Drag snap-to-marks opacity to 25%
 *
 * A centered card titled "Snap-to-marks Opacity" uses a discrete MUI Slider:
 * - Slider label: "Opacity"
 * - The slider shows marks at 0%, 25%, 50%, 75%, and 100%.
 * - The slider is restricted to the marked values (step is disabled so it can only land on a mark).
 * - A small checkerboard preview updates live and a text line shows the selected percent.
 * Initial state:
 * - Opacity starts at 100% (on the 100% mark).
 *
 * Success: The opacity slider is set exactly to the 25% mark (alpha=0.25). Because the slider snaps to marks, equality is required (no tolerance needed).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Slider, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

const marks = [
  { value: 0, label: '0%' },
  { value: 25, label: '25%' },
  { value: 50, label: '50%' },
  { value: 75, label: '75%' },
  { value: 100, label: '100%' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [opacity, setOpacity] = useState(100);

  useEffect(() => {
    if (opacity === 25) {
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
          Snap-to-marks Opacity
        </Typography>

        {/* Checkerboard preview */}
        <Box
          sx={{
            width: 80,
            height: 80,
            mb: 3,
            backgroundImage: `
              linear-gradient(45deg, #ccc 25%, transparent 25%),
              linear-gradient(-45deg, #ccc 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #ccc 75%),
              linear-gradient(-45deg, transparent 75%, #ccc 75%)
            `,
            backgroundSize: '16px 16px',
            backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
            borderRadius: 2,
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundColor: `rgba(33, 150, 243, ${opacity / 100})`,
              borderRadius: 2,
            }}
          />
        </Box>

        {/* Discrete slider */}
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Opacity
        </Typography>
        <Box sx={{ px: 1 }}>
          <Slider
            value={opacity}
            onChange={handleChange}
            min={0}
            max={100}
            step={null}
            marks={marks}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `${v}%`}
            aria-label="Opacity"
            data-testid="opacity-slider"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          Selected: {opacity}%
        </Typography>
      </CardContent>
    </Card>
  );
}
