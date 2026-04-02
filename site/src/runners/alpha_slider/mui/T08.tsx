'use client';

/**
 * alpha_slider-mui-T08: Set overlay opacity to 70% in dialog and apply
 *
 * A modal workflow:
 * - Main page shows a preview card and a button "Edit overlay settings".
 * - Clicking the button opens a MUI Dialog titled "Overlay settings".
 * - Inside the dialog is the target MUI Slider labeled "Overlay opacity" (0–100) with a small checkerboard preview.
 * - Dialog actions include "Cancel" and a primary button "Apply changes".
 * Commit behavior:
 * - While the dialog is open, adjustments are treated as draft; the committed preview on the main page updates only after clicking "Apply changes".
 * Initial state:
 * - Committed opacity is 100% before opening the dialog.
 *
 * Success: The committed overlay opacity alpha is 0.70 (70%). Alpha must be within ±0.01 of the target value.
 * The 'Apply changes' button must be clicked to commit.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Slider, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { isAlphaWithinTolerance } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [committedOpacity, setCommittedOpacity] = useState(100);
  const [draftOpacity, setDraftOpacity] = useState(100);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const alpha = committedOpacity / 100;
    if (isAlphaWithinTolerance(alpha, 0.7, 0.01)) {
      onSuccess();
    }
  }, [committedOpacity, onSuccess]);

  const handleOpenDialog = () => {
    setDraftOpacity(committedOpacity);
    setDialogOpen(true);
  };

  const handleApply = () => {
    setCommittedOpacity(draftOpacity);
    setDialogOpen(false);
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  const handleDraftChange = (_event: Event, newValue: number | number[]) => {
    setDraftOpacity(newValue as number);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent sx={{ textAlign: 'center' }}>
        {/* Live preview */}
        <Box
          sx={{
            width: '100%',
            height: 100,
            mb: 3,
            backgroundImage: `
              linear-gradient(45deg, #ccc 25%, transparent 25%),
              linear-gradient(-45deg, #ccc 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #ccc 75%),
              linear-gradient(-45deg, transparent 75%, #ccc 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            borderRadius: 2,
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundColor: `rgba(103, 58, 183, ${committedOpacity / 100})`,
              borderRadius: 2,
            }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Overlay preview (opacity: {committedOpacity}%)
        </Typography>

        <Button 
          variant="contained" 
          onClick={handleOpenDialog}
          data-testid="edit-overlay-settings"
        >
          Edit overlay settings
        </Button>
      </CardContent>

      <Dialog open={dialogOpen} onClose={handleCancel} maxWidth="xs" fullWidth>
        <DialogTitle>Overlay settings</DialogTitle>
        <DialogContent>
          {/* Draft preview */}
          <Box
            sx={{
              width: 80,
              height: 80,
              my: 2,
              backgroundImage: `
                linear-gradient(45deg, #ccc 25%, transparent 25%),
                linear-gradient(-45deg, #ccc 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #ccc 75%),
                linear-gradient(-45deg, transparent 75%, #ccc 75%)
              `,
              backgroundSize: '12px 12px',
              backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0px',
              borderRadius: 1,
              position: 'relative',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                backgroundColor: `rgba(103, 58, 183, ${draftOpacity / 100})`,
                borderRadius: 1,
              }}
            />
          </Box>

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Overlay opacity
          </Typography>
          <Slider
            value={draftOpacity}
            onChange={handleDraftChange}
            min={0}
            max={100}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `${v}%`}
            aria-label="Overlay opacity"
            data-testid="overlay-opacity-slider"
          />
          <Typography variant="body2" color="text.secondary">
            {draftOpacity}%
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button variant="contained" onClick={handleApply} data-testid="apply-changes">
            Apply changes
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
