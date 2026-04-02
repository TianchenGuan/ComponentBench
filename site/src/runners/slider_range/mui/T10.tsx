'use client';

/**
 * slider_range-mui-T10: Set latency budget using formatted min/max inputs (mixed guidance)
 * 
 * Layout: isolated_card centered in the viewport.
 * The card title is "Network tuning". The widget includes:
 * - A small visual hint above the slider: a thin bar with a highlighted segment labeled "Recommended" (this highlight corresponds to 120-260).
 * - Two compact numeric inputs labeled "Min (ms)" and "Max (ms)".
 * - A MUI range Slider below, synchronized with the inputs (slider value array is the single source of truth).
 * Slider configuration: min=0, max=500, step=1, value labels on interaction.
 * Initial state: Min=80, Max=300, and the readout says "Selected: 80 - 300".
 * Validation: if Min > Max, an inline error appears and the slider snaps back on blur.
 * No Apply/Save; changes commit on Enter or blur in the inputs.
 * 
 * Success: Target range is set to 120-260 ms (both thumbs).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Slider, Box, TextField, Stack } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number[]>([80, 300]);
  const [minInput, setMinInput] = useState('80');
  const [maxInput, setMaxInput] = useState('300');
  const [error, setError] = useState('');

  useEffect(() => {
    if (value[0] === 120 && value[1] === 260) {
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    const val = newValue as number[];
    setValue(val);
    setMinInput(String(val[0]));
    setMaxInput(String(val[1]));
    setError('');
  };

  const handleMinBlur = () => {
    const min = parseInt(minInput, 10);
    if (isNaN(min) || min < 0 || min > value[1]) {
      setError('Invalid min value');
      setMinInput(String(value[0]));
    } else {
      setValue([min, value[1]]);
      setError('');
    }
  };

  const handleMaxBlur = () => {
    const max = parseInt(maxInput, 10);
    if (isNaN(max) || max > 500 || max < value[0]) {
      setError('Invalid max value');
      setMaxInput(String(value[1]));
    } else {
      setValue([value[0], max]);
      setError('');
    }
  };

  const handleMinKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleMinBlur();
  };

  const handleMaxKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleMaxBlur();
  };

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Network tuning
        </Typography>

        {/* Visual reference bar - recommended range 120-260 */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ position: 'relative', height: 20, bgcolor: 'grey.200', borderRadius: 1 }}>
            <Box
              sx={{
                position: 'absolute',
                left: `${(120 / 500) * 100}%`,
                width: `${((260 - 120) / 500) * 100}%`,
                height: '100%',
                bgcolor: 'primary.main',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="caption" sx={{ color: 'white', fontSize: 10 }}>
                Recommended
              </Typography>
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Note: Recommended window shown as a small blue bar above the slider
          </Typography>
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Latency range (ms)
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            label="Min (ms)"
            size="small"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            onBlur={handleMinBlur}
            onKeyDown={handleMinKeyDown}
            sx={{ width: 120 }}
            data-testid="latency-min"
          />
          <TextField
            label="Max (ms)"
            size="small"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            onBlur={handleMaxBlur}
            onKeyDown={handleMaxKeyDown}
            sx={{ width: 120 }}
            data-testid="latency-max"
          />
        </Stack>

        {error && (
          <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ px: 1 }}>
          <Slider
            value={value}
            onChange={handleSliderChange}
            min={0}
            max={500}
            step={1}
            valueLabelDisplay="auto"
            data-testid="latency-range"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Selected: {value[0]} - {value[1]}
        </Typography>
      </CardContent>
    </Card>
  );
}
