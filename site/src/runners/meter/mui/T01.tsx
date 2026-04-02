'use client';

/**
 * meter-mui-T01: Set Fuel Level meter to 50% (MUI)
 *
 * Setup Description:
 * A single centered isolated card shows a meter titled "Fuel Level".
 * - Layout: isolated_card, placement center.
 * - Component: MUI LinearProgress rendered in determinate mode (value 0–100).
 * - Spacing/scale: comfortable spacing, default size.
 * - Instances: 1.
 * - Sub-controls: the progress track is clickable; clicking sets the meter value to the nearest whole percent. 
 *   A small text label above the bar shows the current percent (e.g., "Fuel Level: 20%").
 * - Initial state: 20%.
 * - Distractors: none.
 * - Feedback: immediate; no Apply/Save.
 *
 * Success: Fuel Level meter value is 50% (±3 percentage points).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, LinearProgress } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(20);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (Math.abs(value - 50) <= 3 && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    setValue(Math.max(0, Math.min(100, percent)));
  };

  return (
    <Paper elevation={2} sx={{ p: 3, width: 450 }}>
      <Typography variant="h6" gutterBottom>
        Fuel Level
      </Typography>
      <Box sx={{ mb: 1 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Fuel Level: {value}%
        </Typography>
        <Box
          onClick={handleClick}
          sx={{ cursor: 'pointer' }}
          data-testid="mui-meter-fuel"
          data-meter-value={value}
          role="meter"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Fuel Level"
        >
          <LinearProgress
            variant="determinate"
            value={value}
          />
        </Box>
      </Box>
    </Paper>
  );
}
