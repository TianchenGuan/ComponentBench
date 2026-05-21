'use client';

/**
 * slider_range-mui-T08: Set vertical threshold range in a dark drawer and Save
 * 
 * Layout: drawer_flow. The main page shows a button labeled "Advanced thresholds".
 * Clicking it opens a right-side drawer titled "Advanced thresholds" (overlay panel).
 * The drawer uses a dark theme (dark surface, light text) and contains one VERTICAL MUI range Slider labeled "Anomaly threshold".
 * - Slider configuration: min=0, max=1, step=0.01, orientation='vertical', range via value array, valueLabelDisplay='auto'.
 * - Initial state: 0.10-0.90 with an always-visible text readout "Selected: 0.10 - 0.90".
 * The drawer footer contains "Close" and primary "Save". Slider changes are considered pending until "Save" is clicked; Save commits and closes the drawer.
 * 
 * Success: Target range is set to 0.25-0.75 ratio (both thumbs), tolerance +/-0.01, require_confirm: true with Save.
 */

import React, { useState, useEffect } from 'react';
import { Box, Button, Drawer, Typography, Slider, ThemeProvider, createTheme } from '@mui/material';
import type { TaskComponentProps } from '../types';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function T08({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pendingValue, setPendingValue] = useState<number[]>([0.10, 0.90]);
  const [appliedValue, setAppliedValue] = useState<number[]>([0.10, 0.90]);

  useEffect(() => {
    // Target: 0.25-0.75 with tolerance +/-0.01
    if (
      appliedValue[0] >= 0.24 && appliedValue[0] <= 0.26 &&
      appliedValue[1] >= 0.74 && appliedValue[1] <= 0.76
    ) {
      onSuccess();
    }
  }, [appliedValue, onSuccess]);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    setPendingValue(newValue as number[]);
  };

  const handleSave = () => {
    setAppliedValue(pendingValue);
    setDrawerOpen(false);
  };

  const handleClose = () => {
    setPendingValue(appliedValue);
    setDrawerOpen(false);
  };

  const handleOpen = () => {
    setPendingValue([0.10, 0.90]);
    setDrawerOpen(true);
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Applied: {appliedValue[0].toFixed(2)} - {appliedValue[1].toFixed(2)}
      </Typography>
      <Button variant="contained" onClick={handleOpen}>
        Advanced thresholds
      </Button>

      <ThemeProvider theme={darkTheme}>
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={handleClose}
          PaperProps={{
            sx: { width: 300, bgcolor: 'background.paper' },
          }}
        >
          <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Advanced thresholds
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Anomaly threshold
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1, py: 2 }}>
              <Slider
                orientation="vertical"
                value={pendingValue}
                onChange={handleChange}
                min={0}
                max={1}
                step={0.01}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => v.toFixed(2)}
                data-testid="anomaly-threshold-range"
                sx={{ height: 250 }}
              />
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
              Selected: {pendingValue[0].toFixed(2)} - {pendingValue[1].toFixed(2)}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button variant="outlined" fullWidth onClick={handleClose}>
                Close
              </Button>
              <Button variant="contained" fullWidth onClick={handleSave}>
                Save
              </Button>
            </Box>
          </Box>
        </Drawer>
      </ThemeProvider>
    </Box>
  );
}
