'use client';

/**
 * slider_single-mui-T08: Set Secondary monitor brightness to 65 and Apply (dialog)
 * 
 * Layout: modal_flow with a centered "Display" card.
 * The main page shows a small "Display" card with a button labeled "Adjust monitors" that opens a Material UI Dialog (centered).
 * Inside the dialog are two Material UI Sliders:
 *   - "Main monitor brightness" (0–100, step=1)
 *   - "Secondary monitor brightness" (0–100, step=1)
 * The dialog uses default spacing and sizing, but the two sliders are adjacent and easy to confuse.
 * Initial state: Main=80, Secondary=50.
 * Feedback: value labels appear only while dragging (valueLabelDisplay='auto'); after release there is no persistent number inside the dialog.
 * The dialog footer has "Apply" and "Cancel". Changes are only committed to the main page summary when Apply is clicked.
 * 
 * Success: The 'Secondary monitor brightness' slider value equals 65. The dialog 'Apply' button must be clicked to commit the value. The correct instance is required: only the Secondary monitor slider counts.
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Slider,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mainBrightness, setMainBrightness] = useState(80);
  const [secondaryBrightness, setSecondaryBrightness] = useState(50);
  const [appliedMain, setAppliedMain] = useState(80);
  const [appliedSecondary, setAppliedSecondary] = useState(50);

  useEffect(() => {
    if (appliedSecondary === 65) {
      onSuccess();
    }
  }, [appliedSecondary, onSuccess]);

  const handleOpen = () => {
    setMainBrightness(80);
    setSecondaryBrightness(50);
    setDialogOpen(true);
  };

  const handleApply = () => {
    setAppliedMain(mainBrightness);
    setAppliedSecondary(secondaryBrightness);
    setDialogOpen(false);
  };

  const handleCancel = () => {
    setMainBrightness(appliedMain);
    setSecondaryBrightness(appliedSecondary);
    setDialogOpen(false);
  };

  return (
    <>
      <Card sx={{ width: 350 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Display
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Main: {appliedMain}% | Secondary: {appliedSecondary}%
          </Typography>
          <Button variant="contained" onClick={handleOpen} data-testid="btn-adjust-monitors">
            Adjust monitors
          </Button>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Adjust monitors</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Main monitor brightness
            </Typography>
            <Slider
              value={mainBrightness}
              onChange={(_, v) => setMainBrightness(v as number)}
              min={0}
              max={100}
              step={1}
              valueLabelDisplay="auto"
              data-testid="slider-brightness-main"
            />
          </Box>
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Secondary monitor brightness
            </Typography>
            <Slider
              value={secondaryBrightness}
              onChange={(_, v) => setSecondaryBrightness(v as number)}
              min={0}
              max={100}
              step={1}
              valueLabelDisplay="auto"
              data-testid="slider-brightness-secondary"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button variant="contained" onClick={handleApply} data-testid="btn-apply-brightness">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
