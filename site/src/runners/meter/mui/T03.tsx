'use client';

/**
 * meter-mui-T03: Enable Auto (indeterminate) mode on Network Load meter (MUI)
 *
 * Setup Description:
 * A centered isolated card contains one meter labeled "Network Load".
 * - Layout: isolated_card, placement center.
 * - Component: MUI LinearProgress with a harness-controlled variant.
 * - Spacing/scale: comfortable, default size.
 * - Instances: 1.
 * - Sub-controls: an "Auto" pill inside the meter header toggles the meter from determinate (shows a fixed 
 *   percent) to indeterminate (animated) by switching the LinearProgress variant.
 * - Initial state: determinate at 40%.
 * - Target state: Auto ON → indeterminate mode, and the header shows "Auto".
 * - Distractors: none.
 * - Feedback: immediate, no Apply.
 *
 * Success: Network Load meter is in indeterminate (Auto) mode.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, LinearProgress, Chip } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [isAuto, setIsAuto] = useState(false);
  const [value] = useState(40);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (isAuto && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [isAuto, onSuccess]);

  const handleToggleAuto = () => {
    setIsAuto(!isAuto);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, width: 450 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">
          Network Load
        </Typography>
        <Chip
          label="Auto"
          color={isAuto ? 'primary' : 'default'}
          onClick={handleToggleAuto}
          sx={{ cursor: 'pointer' }}
          data-testid="mui-meter-network-auto-toggle"
        />
      </Box>
      
      <Box
        data-testid="mui-meter-network"
        data-meter-mode={isAuto ? 'indeterminate' : 'determinate'}
        data-meter-value={isAuto ? undefined : value}
        role="meter"
        aria-valuenow={isAuto ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Network Load"
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            {isAuto ? (
              <LinearProgress variant="indeterminate" />
            ) : (
              <LinearProgress variant="determinate" value={value} />
            )}
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
            {isAuto ? 'Auto' : `${value}%`}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
