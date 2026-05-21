'use client';

/**
 * alpha_slider-mui-T05: Match heatmap overlay opacity to target preview
 *
 * A form section titled "Map appearance" contains typical form fields (clutter low):
 * - TextField "Layer name" (distractor)
 * - Switch "Show labels" (distractor)
 * - Target control: "Heatmap overlay opacity" row with:
 *   * A checkerboard preview chip labeled "Current"
 *   * A second preview chip labeled "Target" (fixed reference)
 *   * A MUI Slider labeled "Opacity" (0–100) directly beneath the previews
 * Initial state:
 * - Current opacity starts at 80%, clearly darker than the Target.
 * Guidance:
 * - The desired transparency is provided visually by the Target preview chip.
 *
 * Success: The heatmap overlay alpha matches the Target preview (alpha=0.45). Alpha must be within ±0.02 of the target value.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Slider, Box, TextField, Switch, FormControlLabel } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { isAlphaWithinTolerance } from '../types';

const TARGET_ALPHA = 0.45;

export default function T05({ onSuccess }: TaskComponentProps) {
  const [opacity, setOpacity] = useState(80);
  const [layerName, setLayerName] = useState('Traffic density');
  const [showLabels, setShowLabels] = useState(true);

  useEffect(() => {
    const alpha = opacity / 100;
    if (isAlphaWithinTolerance(alpha, TARGET_ALPHA, 0.02)) {
      onSuccess();
    }
  }, [opacity, onSuccess]);

  const handleOpacityChange = (_event: Event, newValue: number | number[]) => {
    setOpacity(newValue as number);
  };

  const checkerboardSx = {
    backgroundImage: `
      linear-gradient(45deg, #ccc 25%, transparent 25%),
      linear-gradient(-45deg, #ccc 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #ccc 75%),
      linear-gradient(-45deg, transparent 75%, #ccc 75%)
    `,
    backgroundSize: '12px 12px',
    backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px',
  };

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Map appearance
        </Typography>

        {/* Layer name (distractor) */}
        <TextField
          label="Layer name"
          value={layerName}
          onChange={(e) => setLayerName(e.target.value)}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        />

        {/* Show labels (distractor) */}
        <FormControlLabel
          control={
            <Switch 
              checked={showLabels} 
              onChange={(e) => setShowLabels(e.target.checked)} 
            />
          }
          label="Show labels"
          sx={{ mb: 3 }}
        />

        {/* Target control section */}
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Heatmap overlay opacity
        </Typography>

        {/* Preview chips */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Current</Typography>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: 1,
                position: 'relative',
                ...checkerboardSx,
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: `rgba(244, 67, 54, ${opacity / 100})`,
                  borderRadius: 1,
                }}
              />
            </Box>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Target</Typography>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: 1,
                position: 'relative',
                ...checkerboardSx,
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: `rgba(244, 67, 54, ${TARGET_ALPHA})`,
                  borderRadius: 1,
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Opacity slider */}
        <Box sx={{ px: 1 }}>
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
      </CardContent>
    </Card>
  );
}
