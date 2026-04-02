'use client';

/**
 * meter-mui-T02: Match Water Tank target meter to reference (MUI)
 *
 * Setup Description:
 * A centered card shows two MUI LinearProgress meters stacked vertically.
 * - Layout: isolated_card, placement center.
 * - Spacing/scale: comfortable, default size.
 * - Instances: 2 meters labeled "Water Tank (Target)" and "Water Tank (Reference)".
 * - Guidance: visual. The reference meter has no numeric label; it is a visual fill length target.
 * - Interaction: the Target bar is clickable to set value; the Reference bar is read-only.
 * - Initial state: Target=10%. Reference corresponds to ~65%.
 * - Distractors: none.
 * - Feedback: Target updates immediately; no Apply/Save.
 *
 * Success: Water Tank (Target) matches Water Tank (Reference) (±3 percentage points).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, LinearProgress } from '@mui/material';
import type { TaskComponentProps } from '../types';

const REFERENCE_VALUE = 65;

export default function T02({ onSuccess }: TaskComponentProps) {
  const [targetValue, setTargetValue] = useState(10);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (Math.abs(targetValue - REFERENCE_VALUE) <= 3 && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [targetValue, onSuccess]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    setTargetValue(Math.max(0, Math.min(100, percent)));
  };

  return (
    <Paper elevation={2} sx={{ p: 3, width: 450 }}>
      <Typography variant="h6" gutterBottom>
        Water Tank
      </Typography>
      
      {/* Reference meter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
          Water Tank (Reference)
        </Typography>
        <Box
          data-testid="mui-meter-water-ref"
          data-meter-value={REFERENCE_VALUE}
          role="meter"
          aria-valuenow={REFERENCE_VALUE}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Water Tank Reference"
          sx={{ pointerEvents: 'none' }}
        >
          <LinearProgress
            variant="determinate"
            value={REFERENCE_VALUE}
          />
        </Box>
      </Box>

      {/* Target meter */}
      <Box>
        <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
          Water Tank (Target)
        </Typography>
        <Box
          onClick={handleClick}
          sx={{ cursor: 'pointer' }}
          data-testid="mui-meter-water-target"
          data-instance-label="Water Tank (Target)"
          data-meter-value={targetValue}
          role="meter"
          aria-valuenow={targetValue}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Water Tank Target"
        >
          <LinearProgress
            variant="determinate"
            value={targetValue}
          />
        </Box>
      </Box>
    </Paper>
  );
}
