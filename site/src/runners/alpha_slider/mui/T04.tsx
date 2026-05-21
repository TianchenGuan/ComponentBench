'use client';

/**
 * alpha_slider-mui-T04: Reset opacity to 100% with a reset control
 *
 * A centered card titled "Overlay Controls" contains two stacked controls:
 * - Target: a MUI Slider labeled "Opacity" (0–100) controlling the overlay alpha.
 * - Distractor: a MUI Slider labeled "Blur" controlling a visual blur amount (not checked for success).
 * To the right of the Opacity row, there is a small text button labeled "Reset opacity".
 * Initial state:
 * - Opacity starts at 35%.
 * - Blur starts at 8 (arbitrary).
 * Feedback:
 * - Clicking "Reset opacity" immediately sets Opacity back to 100% and updates the preview and the slider thumb.
 *
 * Success: The Opacity slider state is restored to alpha=1.00 (100%). Alpha must be within ±0.005 of the target value.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Slider, Box, Button } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { isAlphaWithinTolerance } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [opacity, setOpacity] = useState(35);
  const [blur, setBlur] = useState(8);

  useEffect(() => {
    const alpha = opacity / 100;
    if (isAlphaWithinTolerance(alpha, 1.0, 0.005)) {
      onSuccess();
    }
  }, [opacity, onSuccess]);

  const handleOpacityChange = (_event: Event, newValue: number | number[]) => {
    setOpacity(newValue as number);
  };

  const handleBlurChange = (_event: Event, newValue: number | number[]) => {
    setBlur(newValue as number);
  };

  const handleReset = () => {
    setOpacity(100);
  };

  return (
    <Card sx={{ width: 420 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Overlay Controls
        </Typography>

        {/* Preview */}
        <Box
          sx={{
            width: '100%',
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
              backgroundColor: `rgba(156, 39, 176, ${opacity / 100})`,
              borderRadius: 2,
              filter: `blur(${blur}px)`,
            }}
          />
        </Box>

        {/* Opacity row with reset */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Opacity
            </Typography>
            <Slider
              value={opacity}
              onChange={handleOpacityChange}
              min={0}
              max={100}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => `${v}%`}
              aria-label="Opacity"
              data-testid="opacity-slider"
            />
          </Box>
          <Button 
            size="small" 
            onClick={handleReset}
            data-testid="reset-opacity"
            sx={{ textTransform: 'none' }}
          >
            Reset opacity
          </Button>
        </Box>

        {/* Blur row (distractor) */}
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Blur
          </Typography>
          <Slider
            value={blur}
            onChange={handleBlurChange}
            min={0}
            max={20}
            valueLabelDisplay="auto"
            aria-label="Blur"
            data-testid="blur-slider"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Opacity: {opacity}% | Blur: {blur}px
        </Typography>
      </CardContent>
    </Card>
  );
}
