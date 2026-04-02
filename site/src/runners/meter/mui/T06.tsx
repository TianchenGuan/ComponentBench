'use client';

/**
 * meter-mui-T06: Open Latency meter tooltip (MUI)
 *
 * Setup Description:
 * An isolated card is anchored near the top-right of the viewport.
 * - Layout: isolated_card; placement top_right.
 * - Component: MUI LinearProgress determinate meter with an attached tooltip.
 * - Spacing/scale: comfortable, default.
 * - Instances: 1 labeled "Latency".
 * - Sub-controls: hovering the meter bar (or focusing it) shows a tooltip that contains the exact numeric 
 *   value, e.g., "Latency: 42%".
 * - Initial state: tooltip closed; meter at 42%.
 * - Distractors: a static "Info" caption under the bar that is not interactive.
 * - Feedback: tooltip appears on hover/focus and stays visible while the pointer is over the bar.
 *
 * Success: The Latency meter tooltip is visible.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, LinearProgress, Tooltip } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [value] = useState(42);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (isTooltipOpen && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [isTooltipOpen, onSuccess]);

  return (
    <Paper elevation={2} sx={{ p: 3, width: 400 }}>
      <Typography variant="h6" gutterBottom>
        Latency
      </Typography>
      
      <Tooltip 
        title={`Latency: ${value}%`}
        open={isTooltipOpen}
        onOpen={() => setIsTooltipOpen(true)}
        onClose={() => setIsTooltipOpen(false)}
        data-testid="meter-latency-tooltip"
      >
        <Box
          sx={{ cursor: 'pointer' }}
          data-testid="meter-latency"
          data-meter-value={value}
          data-tooltip-open={isTooltipOpen}
          role="meter"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Latency"
          tabIndex={0}
        >
          <LinearProgress variant="determinate" value={value} />
        </Box>
      </Tooltip>
      
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Info: This meter displays current latency metrics.
      </Typography>
    </Paper>
  );
}
