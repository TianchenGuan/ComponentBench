'use client';

/**
 * alpha_slider-mui-T09: Set overlay opacity to 55% (two opacity sliders present)
 *
 * A dashboard card titled "Card Styling" contains two opacity sliders (same canonical type, instances=2):
 * - Slider A (target): labeled "Overlay opacity"
 * - Slider B (distractor): labeled "Shadow opacity"
 * Both are MUI Sliders (0–100) with similar appearance and both update small preview chips next to their labels.
 * Initial state:
 * - Overlay opacity = 30%
 * - Shadow opacity = 70%
 * Clutter:
 * - Additional dashboard elements (mini chart, metrics) appear above the sliders, but they are not interactive for this task.
 *
 * Success: The 'Overlay opacity' instance alpha is set to 0.55 (55%). Alpha must be within ±0.01 of the target value.
 * The correct instance must be modified (Overlay opacity, not Shadow opacity).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Slider, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { isAlphaWithinTolerance } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [overlayOpacity, setOverlayOpacity] = useState(30);
  const [shadowOpacity, setShadowOpacity] = useState(70);

  useEffect(() => {
    const alpha = overlayOpacity / 100;
    if (isAlphaWithinTolerance(alpha, 0.55, 0.01)) {
      onSuccess();
    }
  }, [overlayOpacity, onSuccess]);

  const handleOverlayChange = (_event: Event, newValue: number | number[]) => {
    setOverlayOpacity(newValue as number);
  };

  const handleShadowChange = (_event: Event, newValue: number | number[]) => {
    setShadowOpacity(newValue as number);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Card Styling
        </Typography>

        {/* Dashboard clutter - mini metrics */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Box sx={{ flex: 1, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">Views</Typography>
            <Typography variant="h6">1,234</Typography>
          </Box>
          <Box sx={{ flex: 1, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">Clicks</Typography>
            <Typography variant="h6">567</Typography>
          </Box>
        </Box>

        {/* Overlay opacity - TARGET */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="subtitle2">Overlay opacity</Typography>
            <Box
              sx={{
                width: 24,
                height: 24,
                backgroundImage: `
                  linear-gradient(45deg, #ccc 25%, transparent 25%),
                  linear-gradient(-45deg, #ccc 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #ccc 75%),
                  linear-gradient(-45deg, transparent 75%, #ccc 75%)
                `,
                backgroundSize: '8px 8px',
                backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                borderRadius: 0.5,
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: `rgba(33, 150, 243, ${overlayOpacity / 100})`,
                  borderRadius: 0.5,
                }}
              />
            </Box>
          </Box>
          <Slider
            value={overlayOpacity}
            onChange={handleOverlayChange}
            min={0}
            max={100}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `${v}%`}
            aria-label="Overlay opacity"
            data-testid="overlay-opacity-slider"
          />
        </Box>

        {/* Shadow opacity - DISTRACTOR */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="subtitle2">Shadow opacity</Typography>
            <Box
              sx={{
                width: 24,
                height: 24,
                backgroundImage: `
                  linear-gradient(45deg, #ccc 25%, transparent 25%),
                  linear-gradient(-45deg, #ccc 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #ccc 75%),
                  linear-gradient(-45deg, transparent 75%, #ccc 75%)
                `,
                backgroundSize: '8px 8px',
                backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                borderRadius: 0.5,
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: `rgba(0, 0, 0, ${shadowOpacity / 100})`,
                  borderRadius: 0.5,
                }}
              />
            </Box>
          </Box>
          <Slider
            value={shadowOpacity}
            onChange={handleShadowChange}
            min={0}
            max={100}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `${v}%`}
            aria-label="Shadow opacity"
            data-testid="shadow-opacity-slider"
          />
        </Box>
      </CardContent>
    </Card>
  );
}
