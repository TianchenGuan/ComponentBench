'use client';

/**
 * progress_bar-mui-T02: Switch progress bar to indeterminate mode
 *
 * Layout: isolated_card centered, titled "Loading indicator".
 *
 * Target component: one MUI LinearProgress. It starts in determinate mode at 30% (a static filled bar).
 *
 * Sub-control:
 * - A switch labeled "Indeterminate mode".
 *   - OFF: LinearProgress uses variant='determinate' with value=30.
 *   - ON: LinearProgress switches to variant='indeterminate' (no meaningful progress value; animated bar).
 *
 * Distractors:
 * - A "Reset" button that sets determinate value back to 0% (not needed).
 *
 * Success: LinearProgress variant is set to "indeterminate".
 */

import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, LinearProgress, Button, Switch, FormControlLabel } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [isIndeterminate, setIsIndeterminate] = useState(false);
  const successFiredRef = React.useRef(false);

  useEffect(() => {
    if (isIndeterminate && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [isIndeterminate, onSuccess]);

  return (
    <Paper elevation={2} sx={{ p: 3, width: 400 }}>
      <Typography variant="h6" gutterBottom>
        Loading indicator
      </Typography>
      <Box sx={{ mb: 2 }}>
        <LinearProgress
          variant={isIndeterminate ? 'indeterminate' : 'determinate'}
          value={isIndeterminate ? undefined : 30}
          aria-label="Loading progress"
          data-testid="loading-progress"
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={isIndeterminate}
              onChange={(e) => setIsIndeterminate(e.target.checked)}
            />
          }
          label="Indeterminate mode"
        />
      </Box>
      <Button variant="outlined" disabled>
        Reset
      </Button>
    </Paper>
  );
}
