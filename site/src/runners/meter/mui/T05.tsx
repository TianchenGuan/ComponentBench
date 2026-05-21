'use client';

/**
 * meter-mui-T05: Set Quota Usage meter in drawer and Apply (MUI)
 *
 * Setup Description:
 * A drawer_flow scene begins on a settings page with a button "Open quota settings".
 * - Layout: drawer_flow; the meter is inside a right-side drawer.
 * - Placement: drawer slides in from the right edge.
 * - Component: MUI Drawer containing one MUI LinearProgress meter.
 * - Spacing/scale: comfortable spacing inside drawer; default meter size.
 * - Instances: 1 meter labeled "Quota Usage".
 * - Interaction:
 *   * Click "Open quota settings" to open the drawer.
 *   * Click on the meter bar to set a pending value.
 *   * Click "Apply" in the drawer footer to commit.
 * - Initial state: pending and committed value are both 50%.
 * - Feedback: after Apply, a small inline message "Saved" appears and the Apply button becomes disabled for 1 second.
 *
 * Success: Quota Usage committed value is 85% (±2 percentage points). Apply has been clicked to commit.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, LinearProgress, Button, Drawer, Snackbar, Alert } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [pendingValue, setPendingValue] = useState(50);
  const [committedValue, setCommittedValue] = useState(50);
  const [showSaved, setShowSaved] = useState(false);
  const successFiredRef = useRef(false);

  useEffect(() => {
    if (Math.abs(committedValue - 85) <= 2 && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [committedValue, onSuccess]);

  const handleOpenDrawer = () => {
    setPendingValue(committedValue);
    setIsDrawerOpen(true);
  };

  const handleApply = () => {
    setCommittedValue(pendingValue);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
    setIsDrawerOpen(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.round((x / rect.width) * 100);
    setPendingValue(Math.max(0, Math.min(100, percent)));
  };

  return (
    <>
      <Paper elevation={2} sx={{ p: 3, width: 350, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Quota Settings
        </Typography>
        <Button variant="contained" onClick={handleOpenDrawer} data-testid="open-quota-settings">
          Open quota settings
        </Button>
      </Paper>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <Box sx={{ width: 350, p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" gutterBottom>
            Edit Quota
          </Typography>
          
          <Box sx={{ flex: 1, mt: 2 }}>
            <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
              Quota Usage
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                onClick={handleClick}
                sx={{ flex: 1, cursor: 'pointer' }}
                data-testid="mui-meter-quota"
                data-meter-value={pendingValue}
                role="meter"
                aria-valuenow={pendingValue}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Quota Usage"
              >
                <LinearProgress variant="determinate" value={pendingValue} />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
                {pendingValue}%
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Committed: {committedValue}%
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button variant="outlined" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleApply} data-testid="quota-apply">
              Apply
            </Button>
          </Box>
        </Box>
      </Drawer>

      <Snackbar open={showSaved} autoHideDuration={2000} onClose={() => setShowSaved(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>
          Saved
        </Alert>
      </Snackbar>
    </>
  );
}
