'use client';

/**
 * progress_bar-mui-T03: Reset determinate progress to 0%
 *
 * Layout: isolated_card centered, titled "Upload".
 *
 * Target component: one determinate MUI LinearProgress labeled "Upload progress". 
 * It starts at 80% (static).
 *
 * Controls:
 * - "Reset" button: sets LinearProgress value to 0% immediately.
 * - "Start upload" button: would run the progress forward again (distractor).
 *
 * Success: LinearProgress value equals 0% and remains determinate.
 */

import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, LinearProgress, Button, Stack } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [progress, setProgress] = useState(80);
  const successFiredRef = React.useRef(false);

  useEffect(() => {
    if (progress === 0 && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [progress, onSuccess]);

  const handleReset = () => {
    setProgress(0);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, width: 400 }}>
      <Typography variant="h6" gutterBottom>
        Upload
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Upload progress
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              aria-label="Upload progress"
              data-testid="upload-progress"
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {progress}%
          </Typography>
        </Box>
      </Box>
      <Stack direction="row" spacing={1}>
        <Button variant="outlined">
          Start upload
        </Button>
        <Button variant="contained" onClick={handleReset}>
          Reset
        </Button>
      </Stack>
    </Paper>
  );
}
