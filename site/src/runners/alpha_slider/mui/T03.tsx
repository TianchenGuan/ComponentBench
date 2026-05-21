'use client';

/**
 * alpha_slider-mui-T03: Enter opacity as a percentage (85%)
 *
 * A centered card titled "Opacity Input" provides two linked sub-controls for the same alpha value:
 * - A MUI Slider labeled "Opacity" (0–100).
 * - A MUI TextField labeled "Opacity (%)" to the right of the slider. It accepts an integer percent (0–100).
 * Behavior:
 * - Typing a number and pressing Enter commits the value and updates the slider thumb position immediately.
 * - Dragging the slider also updates the TextField.
 * Initial state:
 * - Opacity starts at 50% (TextField shows 50).
 *
 * Success: The opacity value is set to alpha=0.85 (85%). Alpha must be within ±0.01 of the target value.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Slider, Box, TextField } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { isAlphaWithinTolerance } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [opacity, setOpacity] = useState(50);
  const [inputValue, setInputValue] = useState('50');

  useEffect(() => {
    const alpha = opacity / 100;
    if (isAlphaWithinTolerance(alpha, 0.85, 0.01)) {
      onSuccess();
    }
  }, [opacity, onSuccess]);

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    const val = newValue as number;
    setOpacity(val);
    setInputValue(String(val));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputCommit = () => {
    const parsed = parseInt(inputValue, 10);
    if (!isNaN(parsed)) {
      const clamped = Math.max(0, Math.min(100, parsed));
      setOpacity(clamped);
      setInputValue(String(clamped));
    } else {
      setInputValue(String(opacity));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputCommit();
    }
  };

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Opacity Input
        </Typography>

        {/* Checkerboard preview */}
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
              backgroundColor: `rgba(76, 175, 80, ${opacity / 100})`,
              borderRadius: 2,
            }}
          />
        </Box>

        {/* Slider + TextField row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Opacity
            </Typography>
            <Slider
              value={opacity}
              onChange={handleSliderChange}
              min={0}
              max={100}
              valueLabelDisplay="auto"
              aria-label="Opacity"
              data-testid="opacity-slider"
            />
          </Box>
          <TextField
            label="Opacity (%)"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputCommit}
            onKeyDown={handleKeyDown}
            size="small"
            sx={{ width: 100 }}
            inputProps={{ 'data-testid': 'opacity-input' }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
