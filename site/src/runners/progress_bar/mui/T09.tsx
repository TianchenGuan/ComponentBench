'use client';

/**
 * progress_bar-mui-T09: Stop a running job via confirmation dialog
 *
 * Layout: isolated_card centered, titled "Background job".
 *
 * Target component: one MUI LinearProgress labeled "Job progress". It starts running 
 * immediately on page load (value increases steadily).
 *
 * Controls:
 * - "Stop job" button: opens a Material UI Dialog asking for confirmation.
 *   - Dialog actions: "Stop" (destructive) and "Keep running".
 * - "Pause" button: pauses the job without canceling (distractor).
 *
 * Cancellation behavior:
 * - When the user confirms "Stop", the LinearProgress freezes at its current value and its 
 *   styling changes to a disabled/canceled appearance.
 * - A small caption "Canceled" appears next to the bar (status='canceled').
 *
 * Success: The job progress enters the canonical status "canceled" and stable for 1 second.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

type JobStatus = 'running' | 'paused' | 'canceled';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<JobStatus>('running');
  const [dialogOpen, setDialogOpen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stabilityRef = useRef<NodeJS.Timeout | null>(null);
  const successFiredRef = useRef(false);

  // Auto-start the job on mount
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 100;
        }
        return prev + 1;
      });
    }, 150);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Check for success: status is 'canceled' and stable for 1 second
  useEffect(() => {
    if (stabilityRef.current) {
      clearTimeout(stabilityRef.current);
      stabilityRef.current = null;
    }

    if (status === 'canceled' && !successFiredRef.current) {
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
  }, [status, onSuccess]);

  const handlePause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setStatus('paused');
  };

  const handleResume = () => {
    setStatus('running');
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 100;
        }
        return prev + 1;
      });
    }, 150);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleConfirmStop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setStatus('canceled');
    setDialogOpen(false);
  };

  return (
    <>
      <Paper elevation={2} sx={{ p: 3, width: 400 }}>
        <Typography variant="h6" gutterBottom>
          Background job
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="body2">Job progress</Typography>
            {status === 'canceled' && (
              <Chip label="Canceled" size="small" color="error" />
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                color={status === 'canceled' ? 'inherit' : 'primary'}
                aria-label="Job progress"
                data-testid="job-progress"
                data-status={status}
                sx={{
                  opacity: status === 'canceled' ? 0.5 : 1,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: status === 'canceled' ? '#bdbdbd' : undefined,
                  },
                }}
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
            color="error"
            onClick={handleOpenDialog}
            disabled={status === 'canceled'}
          >
            Stop job
          </Button>
          {status === 'running' ? (
            <Button variant="outlined" onClick={handlePause}>
              Pause
            </Button>
          ) : status === 'paused' ? (
            <Button variant="outlined" onClick={handleResume}>
              Resume
            </Button>
          ) : null}
        </Stack>
      </Paper>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Stop job?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to stop this job? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Keep running</Button>
          <Button onClick={handleConfirmStop} color="error" variant="contained">
            Stop
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
