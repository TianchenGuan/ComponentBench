'use client';

/**
 * slider_single-mui-T04: Open Audio settings drawer and set Mic gain to 40
 * 
 * Layout: drawer_flow. The main settings page is visible with several navigation items and a button labeled "Open audio settings".
 * The target slider is inside a right-side Drawer (overlay) that is closed by default.
 * Clicking "Open audio settings" slides in the Drawer; inside the Drawer is one Material UI Slider labeled "Mic gain".
 * Slider configuration: range 0–100, step=1, valueLabelDisplay='auto' (value label appears while dragging).
 * Initial state when the drawer opens: Mic gain is set to 55.
 * Clutter inside the drawer is low: a header, a short description paragraph, and a Close (X) icon; no other sliders.
 * Changes apply immediately; there is no Apply/Cancel step.
 * 
 * Success: The 'Mic gain' slider value equals 40.
 */

import React, { useState, useEffect } from 'react';
import { Box, Button, Drawer, Typography, Slider, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [value, setValue] = useState(55);

  useEffect(() => {
    if (value === 40) {
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  const handleOpen = () => {
    setValue(55);
    setDrawerOpen(true);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Configure your audio and video preferences.
      </Typography>
      <Button
        variant="contained"
        onClick={handleOpen}
        data-testid="btn-open-audio-drawer"
      >
        Open audio settings
      </Button>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 350 },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Audio Settings</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 3 }} />
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Adjust your microphone input level for optimal audio quality.
          </Typography>

          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Mic gain
          </Typography>
          <Box sx={{ px: 1 }}>
            <Slider
              value={value}
              onChange={handleChange}
              min={0}
              max={100}
              step={1}
              valueLabelDisplay="auto"
              data-testid="slider-mic-gain"
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Current: {value}
          </Typography>
        </Box>
      </Drawer>
    </Box>
  );
}
