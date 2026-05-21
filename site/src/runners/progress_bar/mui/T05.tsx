'use client';

/**
 * progress_bar-mui-T05: Pause download near 70%
 *
 * Layout: isolated_card centered, titled "Download".
 *
 * Target component: one MUI LinearProgress (determinate) labeled "Download progress" 
 * with a visible percent number to the right. Initial value: 0%.
 *
 * Controls:
 * - "Start download": begins steadily increasing the value.
 * - "Pause": stops the value where it is; button toggles to "Resume" when paused.
 * - "Reset": returns to 0% (distractor).
 *
 * Success: "Download progress" LinearProgress value is within ±3% of 70% and stable for 1 second.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, LinearProgress, Button, Stack } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stabilityRef = useRef<NodeJS.Timeout | null>(null);
  const successFiredRef = useRef(false);

  // Check for success: within ±3% of 70% and stable for 1 second
  useEffect(() => {
    if (stabilityRef.current) {
      clearTimeout(stabilityRef.current);
      stabilityRef.current = null;
    }

    if (!isRunning && progress >= 67 && progress <= 73 && !successFiredRef.current) {
      stabilityRef.current = setTimeout(() => {
        if (!successFiredRef.current) {
          successFiredRef.current = true;
          onSuccess();
        }
      }, 1000);
    }

    return () => {
      if (stabilityRef.current) {
        clearTimeout(stabilityRef.current);
      }
    };
  }, [progress, isRunning, onSuccess]);

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

  const handleResume = () => {
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
        Download
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Download progress
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              aria-label="Download progress"
              data-testid="download-progress"
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
          disabled={isRunning || progress > 0}
        >
          Start download
        </Button>
        {isRunning ? (
          <Button variant="outlined" onClick={handlePause}>
            Pause
          </Button>
        ) : (
          <Button
            variant="outlined"
            onClick={handleResume}
            disabled={progress === 0 || progress >= 100}
          >
            Resume
          </Button>
        )}
        <Button variant="outlined" onClick={handleReset}>
          Reset
        </Button>
      </Stack>
    </Paper>
  );
}
