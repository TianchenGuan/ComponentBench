'use client';

/**
 * progress_bar-mui-T07: Navigate to Downloads tab and reach 30%
 *
 * Layout: form_section. The page resembles a media app settings area with tabs at the top:
 * "Overview", "Downloads", and "History".
 *
 * Target component: one MUI LinearProgress labeled "Episode download" located inside the 
 * "Downloads" tab panel (not visible on initial load because "Overview" tab is selected).
 *
 * Initial state:
 * - On page load: "Overview" tab is active; the progress bar is hidden.
 * - In "Downloads" tab: the progress bar starts at 0% and is idle.
 *
 * Controls in the Downloads tab:
 * - "Start download" button: begins incrementing the progress and auto-pauses at exactly 30%.
 * - "Reset" button: returns to 0% (distractor).
 *
 * Success: "Episode download" LinearProgress value is within ±1% of 30% and stable for 0.8 seconds.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Button,
  Stack,
  Tabs,
  Tab,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const [tabValue, setTabValue] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stabilityRef = useRef<NodeJS.Timeout | null>(null);
  const successFiredRef = useRef(false);

  // Check for success: within ±1% of 30% and stable for 0.8 seconds
  useEffect(() => {
    if (stabilityRef.current) {
      clearTimeout(stabilityRef.current);
      stabilityRef.current = null;
    }

    if (!isRunning && progress >= 29 && progress <= 31 && !successFiredRef.current) {
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

  const handleStart = () => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 30) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          return 30;
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
    <Paper elevation={2} sx={{ p: 3, width: 500 }}>
      <Typography variant="h6" gutterBottom>
        Media Settings
      </Typography>

      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
        <Tab label="Overview" />
        <Tab label="Downloads" />
        <Tab label="History" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Typography variant="body1">
          Welcome to Media Settings. Navigate to the Downloads tab to manage downloads.
        </Typography>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Episode download
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                aria-label="Episode download"
                data-testid="episode-download-progress"
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {progress}%
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Button
            variant="contained"
            onClick={handleStart}
            disabled={isRunning || progress >= 30}
          >
            Start download
          </Button>
          <Button variant="outlined" onClick={handleReset}>
            Reset
          </Button>
        </Stack>

        <FormControlLabel control={<Checkbox />} label="Wi‑Fi only" />
        <FormControlLabel control={<Checkbox />} label="Notify on completion" />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="body1">No download history available.</Typography>
      </TabPanel>
    </Paper>
  );
}
