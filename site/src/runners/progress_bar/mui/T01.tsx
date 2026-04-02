'use client';

/**
 * progress_bar-mui-T01: Complete file upload to 100% (determinate)
 *
 * Layout: isolated_card centered (Material UI Paper card titled "Upload").
 *
 * Target component: one MUI LinearProgress component configured as determinate. 
 * It is labeled "Upload progress" via aria-label and a nearby text label. Initial value is 0%.
 *
 * Controls:
 * - "Start upload" button: starts incrementing LinearProgress value from 0 to 100.
 * - "Pause" button: stops incrementing (distractor for this task).
 * - "Reset" button: returns to 0% (distractor).
 *
 * Success: LinearProgress value equals 100% and variant remains determinate.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, LinearProgress, Button, Stack } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (progress >= 100 && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [progress, onSuccess]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleStart = () => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          return 100;
        }
        return prev + 1;
      });
    }, 100);
  };

  const handlePause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  const handleReset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setProgress(0);
    successFiredRef.current = false;
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
        <Button
          variant="contained"
          onClick={handleStart}
          disabled={isRunning || progress >= 100}
        >
          Start upload
        </Button>
        <Button variant="outlined" onClick={handlePause} disabled={!isRunning}>
          Pause
        </Button>
        <Button variant="outlined" onClick={handleReset}>
          Reset
        </Button>
      </Stack>
    </Paper>
  );
}
