'use client';

/**
 * slider_single-mui-v2-T21: Vertical detection confidence in a dark drawer
 *
 * “Detection controls” opens a drawer with orientation="vertical" Slider 0.00–1.00 step 0.01.
 * “Selected: 0.xx” updates after release (onChangeCommitted). Save commits.
 *
 * Success: Committed value within ±0.01 of 0.73; Save used to commit.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Drawer, Slider, Stack, Typography } from '@mui/material';
import type { TaskComponentProps } from '../../types';

export default function T21({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(0.5);
  const [released, setReleased] = useState(0.5);
  const [committed, setCommitted] = useState(0.5);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (Math.abs(committed - 0.73) <= 0.01) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  const handleOpen = () => {
    setDraft(committed);
    setReleased(committed);
    setOpen(true);
  };

  const handleSave = () => {
    setCommitted(draft);
    setReleased(draft);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Button variant="outlined" onClick={handleOpen} data-testid="detection-controls-open">
        Detection controls
      </Button>
      <Drawer anchor="right" open={open} onClose={handleClose} PaperProps={{ sx: { width: 280, p: 2 } }}>
        <Typography variant="subtitle1" gutterBottom>
          Detection
        </Typography>
        <Stack direction="row" spacing={2} alignItems="flex-end" sx={{ minHeight: 240, py: 1 }}>
          <Box sx={{ height: 220, display: 'flex', alignItems: 'center', px: 2 }}>
            <Slider
              orientation="vertical"
              value={draft}
              onChange={(_e, v) => setDraft(v as number)}
              onChangeCommitted={(_e, v) => setReleased(v as number)}
              min={0}
              max={1}
              step={0.01}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => v.toFixed(2)}
              aria-label="Detection confidence"
              data-testid="slider-detection-confidence"
            />
          </Box>
          <Typography variant="body2" sx={{ mb: 1, fontFamily: 'monospace' }}>
            Selected: {released.toFixed(2)}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button onClick={handleClose}>Close</Button>
          <Button variant="contained" onClick={handleSave} data-testid="detection-save">
            Save
          </Button>
        </Stack>
      </Drawer>
    </Box>
  );
}
