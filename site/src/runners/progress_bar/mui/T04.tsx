'use client';

/**
 * progress_bar-mui-T04: Dialog: start and reach 50% in details view
 *
 * Layout: modal_flow. The main page shows a card titled "Upload" with a button "Open upload details".
 *
 * Target component: one MUI LinearProgress labeled "Upload progress", located inside a 
 * Material UI Dialog (not visible until opened).
 *
 * Overlay behavior:
 * - Clicking "Open upload details" opens a dialog titled "Upload details".
 * - Inside the dialog, the LinearProgress starts at 0% and is idle.
 * - A "Start" button inside the dialog begins filling the bar. The simulation auto-pauses 
 *   exactly at 50%.
 *
 * Distractors inside the dialog:
 * - A "Close" icon button in the top-right.
 * - A "Cancel upload" button (opens a confirm dialog; not needed).
 *
 * Success: Dialog's "Upload progress" LinearProgress value is within ±1% of 50% and stable.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stabilityRef = useRef<NodeJS.Timeout | null>(null);
  const successFiredRef = useRef(false);

  // Check for success: within ±1% of 50% and stable for 0.8 seconds
  useEffect(() => {
    if (stabilityRef.current) {
      clearTimeout(stabilityRef.current);
      stabilityRef.current = null;
    }

    if (!isRunning && progress >= 49 && progress <= 51 && !successFiredRef.current) {
      stabilityRef.current = setTimeout(() => {
        if (!successFiredRef.current) {
          successFiredRef.current = true;
          onSuccess();
        }
      }, 800);
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

  const handleOpen = () => {
    setOpen(true);
    setProgress(0);
    setIsRunning(false);
  };

  const handleClose = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setOpen(false);
  };

  const handleStart = () => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 50) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          return 50;
        }
        return prev + 1;
      });
    }, 100);
  };

  return (
    <>
      <Paper elevation={2} sx={{ p: 3, width: 350 }}>
        <Typography variant="h6" gutterBottom>
          Upload
        </Typography>
        <Button variant="contained" onClick={handleOpen}>
          Open upload details
        </Button>
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Upload details
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStart} disabled={isRunning || progress >= 50}>
            Start
          </Button>
          <Button color="error">
            Cancel upload
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
