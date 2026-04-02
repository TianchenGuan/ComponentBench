'use client';

/**
 * slider_range-mui-T03: Reset working-hours window
 * 
 * Layout: isolated_card centered in the viewport.
 * The card title is "Schedule". It contains one MUI range Slider labeled "Working hours (h)".
 * - Slider configuration: min=0, max=24, step=1, range via value array.
 * - Default range is displayed as helper text: "Default: 9 - 17".
 * - Initial state: Selected is 10-18 (not default) and shown as "Selected: 10 - 18".
 * A single button labeled "Reset" is placed under the slider; clicking it immediately sets the slider back to 9-17.
 * No Apply step.
 * 
 * Success: Target range is set to 9-17 h (both thumbs).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Slider, Box, Button } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number[]>([10, 18]);

  useEffect(() => {
    if (value[0] === 9 && value[1] === 17) {
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  const handleReset = () => {
    setValue([9, 17]);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Schedule
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 2 }}>
          <Typography variant="subtitle2">
            Working hours (h)
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Default: 9 - 17
          </Typography>
        </Box>
        <Box sx={{ px: 1 }}>
          <Slider
            value={value}
            onChange={handleChange}
            min={0}
            max={24}
            step={1}
            valueLabelDisplay="auto"
            data-testid="working-hours-range"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 2 }}>
          Selected: {value[0]} - {value[1]}
        </Typography>
        <Button variant="outlined" onClick={handleReset}>
          Reset
        </Button>
      </CardContent>
    </Card>
  );
}
