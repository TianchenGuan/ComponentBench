'use client';

/**
 * progress_bar-mui-T06: Match Target buffer progress to Reference (value & buffer)
 *
 * Layout: isolated_card centered, titled "Buffered loading".
 *
 * Target components (instances=2 of MUI LinearProgress):
 * - "Reference" LinearProgress: variant='buffer', fixed at value=40 and valueBuffer=70. Caption "Reference".
 * - "Target" LinearProgress: variant='buffer', starts at value=10 and valueBuffer=20. Caption "Target".
 *
 * Controls (affect ONLY the Target bar):
 * - "+10 Loaded" / "-10 Loaded": adjusts Target value by ±10.
 * - "+10 Buffered" / "-10 Buffered": adjusts Target valueBuffer by ±10.
 *
 * Success: Target value within ±2% of 40% AND Target buffer within ±2% of 70%.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, LinearProgress, Button, Stack } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  // Reference is fixed
  const refValue = 40;
  const refBuffer = 70;

  // Target starts at 10/20
  const [targetValue, setTargetValue] = useState(10);
  const [targetBuffer, setTargetBuffer] = useState(20);
  const successFiredRef = useRef(false);

  useEffect(() => {
    const valueMatch = Math.abs(targetValue - refValue) <= 2;
    const bufferMatch = Math.abs(targetBuffer - refBuffer) <= 2;
    
    if (valueMatch && bufferMatch && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [targetValue, targetBuffer, onSuccess]);

  const adjustValue = (delta: number) => {
    setTargetValue((prev) => Math.max(0, Math.min(100, prev + delta)));
    successFiredRef.current = false;
  };

  const adjustBuffer = (delta: number) => {
    setTargetBuffer((prev) => Math.max(0, Math.min(100, prev + delta)));
    successFiredRef.current = false;
  };

  return (
    <Paper elevation={2} sx={{ p: 3, width: 450 }}>
      <Typography variant="h6" gutterBottom>
        Buffered loading
      </Typography>

      {/* Reference bar */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Reference
        </Typography>
        <LinearProgress
          variant="buffer"
          value={refValue}
          valueBuffer={refBuffer}
          aria-label="Reference progress"
          data-testid="reference-progress"
        />
      </Box>

      {/* Target bar */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Target
        </Typography>
        <LinearProgress
          variant="buffer"
          value={targetValue}
          valueBuffer={targetBuffer}
          aria-label="Target progress"
          data-testid="target-progress"
        />
      </Box>

      {/* Controls for Target */}
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Button size="small" variant="outlined" onClick={() => adjustValue(-10)}>
          -10 Loaded
        </Button>
        <Button size="small" variant="outlined" onClick={() => adjustValue(10)}>
          +10 Loaded
        </Button>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Button size="small" variant="outlined" onClick={() => adjustBuffer(-10)}>
          -10 Buffered
        </Button>
        <Button size="small" variant="outlined" onClick={() => adjustBuffer(10)}>
          +10 Buffered
        </Button>
      </Stack>
    </Paper>
  );
}
