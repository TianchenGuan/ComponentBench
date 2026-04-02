'use client';

/**
 * meter-mui-T08: Set small Signal Strength meter to 67% (MUI)
 *
 * Setup Description:
 * A small compact meter card is placed near the bottom-left corner of the viewport.
 * - Layout: isolated_card; placement bottom_left.
 * - Spacing/scale: compact spacing; scale small.
 * - Component: MUI LinearProgress determinate meter.
 * - Instances: 1 labeled "Signal Strength".
 * - Observability: no numeric label is printed; only the filled bar is visible.
 * - Interaction: clicking on the bar sets value; when the bar is focused, Left/Right arrow keys nudge 
 *   the value by 1%.
 * - Verification: hovering the bar shows a tooltip with the exact percent.
 * - Initial state: 50%.
 * - Distractors: none.
 * - Feedback: immediate fill update and tooltip reflects the current value.
 *
 * Success: Signal Strength meter value is 67% (±1 percentage point).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, LinearProgress, Tooltip } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState(50);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (Math.abs(value - 67) <= 1 && !successFiredRef.current) {
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setValue(prev => Math.max(0, prev - 1));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setValue(prev => Math.min(100, prev + 1));
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 1.5, width: 200 }}>
      <Typography variant="caption" fontWeight={500} sx={{ display: 'block', mb: 0.5 }}>
        Signal Strength
      </Typography>
      <Tooltip title={`${value}%`}>
        <Box
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          sx={{ cursor: 'pointer', outline: 'none', '&:focus': { outline: '2px solid #1976d2' } }}
          data-testid="mui-meter-signal"
          data-meter-value={value}
          role="meter"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Signal Strength"
        >
          <LinearProgress 
            variant="determinate" 
            value={value}
            sx={{ height: 6 }}
          />
        </Box>
      </Tooltip>
    </Paper>
  );
}
