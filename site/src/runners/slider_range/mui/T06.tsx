'use client';

/**
 * slider_range-mui-T06: Match highlighted luminance band (visual)
 * 
 * Layout: isolated_card centered in the viewport.
 * The card is titled "Luminance range". It contains:
 * - A small sparkline/mini histogram chart at the top with a semi-transparent highlighted window overlay (the target window).
 * - A MUI range Slider underneath (min=0, max=100, step=1, range via value array).
 * Initial state: slider starts at 0-100; the highlighted window in the chart corresponds to a narrower middle segment.
 * The card includes a subtle text readout "Selected: [from] - [to]" that updates live as the slider changes, but the target values are not shown as text.
 * 
 * Success: Target range is set to 42-68 pts (both thumbs), tolerance +/-2.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Slider, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number[]>([0, 100]);

  useEffect(() => {
    // Target: 42-68 with tolerance +/-2
    if (value[0] >= 40 && value[0] <= 44 && value[1] >= 66 && value[1] <= 70) {
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
          Luminance range
        </Typography>

        {/* Visual reference - mini chart with highlighted band */}
        <Box sx={{ mb: 3, position: 'relative' }}>
          {/* Simulated histogram bars */}
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'flex-end', height: 40 }}>
            {[15, 25, 35, 45, 60, 80, 90, 85, 70, 55, 40, 30, 20, 15, 10].map((h, i) => (
              <Box
                key={i}
                sx={{
                  flex: 1,
                  height: `${h}%`,
                  bgcolor: 'grey.300',
                  borderRadius: 0.5,
                }}
              />
            ))}
          </Box>
          {/* Highlighted window overlay at 42%-68% */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '42%',
              width: '26%',
              bgcolor: 'primary.main',
              opacity: 0.3,
              borderRadius: 1,
            }}
          />
        </Box>

        <Box sx={{ px: 1 }}>
          <Slider
            value={value}
            onChange={handleChange}
            min={0}
            max={100}
            step={1}
            valueLabelDisplay="auto"
            data-testid="luminance-range"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Selected: {value[0]} - {value[1]}
        </Typography>
      </CardContent>
    </Card>
  );
}
