'use client';

/**
 * slider_single-mui-v2-T17: Dialog monitors — set Secondary brightness and apply
 *
 * “Adjust monitors” opens a Dialog with Main (80) and Secondary (50) brightness sliders.
 * Value labels while dragging; Apply commits. Display summary + profile chips sit behind the dialog.
 *
 * Success: After Apply, Secondary committed 65, Main remains 80.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

export default function T17({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [draftMain, setDraftMain] = useState(80);
  const [draftSecondary, setDraftSecondary] = useState(50);
  const [committedMain, setCommittedMain] = useState(80);
  const [committedSecondary, setCommittedSecondary] = useState(50);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committedMain === 80 && committedSecondary === 65) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedMain, committedSecondary, onSuccess]);

  const handleOpen = () => {
    setDraftMain(committedMain);
    setDraftSecondary(committedSecondary);
    setOpen(true);
  };

  const handleApply = () => {
    setCommittedMain(draftMain);
    setCommittedSecondary(draftSecondary);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 520 }}>
      <Card variant="outlined" sx={{ mb: 2, opacity: 0.92 }}>
        <CardContent sx={{ py: 1.5 }}>
          <Typography variant="caption" color="text.secondary">
            Display summary
          </Typography>
          <Typography variant="body2">
            Main {committedMain}% · Secondary {committedSecondary}% · Night mode off
          </Typography>
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
            <Chip size="small" label="sRGB" variant="outlined" />
            <Chip size="small" label="Display P3" variant="outlined" />
            <Chip size="small" label="HDR off" variant="outlined" />
          </Stack>
        </CardContent>
      </Card>

      <Button variant="contained" onClick={handleOpen} data-testid="adjust-monitors-open">
        Adjust monitors
      </Button>

      <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Monitor brightness</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>
            Main monitor brightness
          </Typography>
          <Box sx={{ px: 1 }}>
            <Slider
              value={draftMain}
              onChange={(_e, v) => setDraftMain(v as number)}
              min={0}
              max={100}
              valueLabelDisplay="auto"
              aria-label="Main monitor brightness"
              data-testid="slider-main-monitor-brightness"
            />
          </Box>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Secondary monitor brightness
          </Typography>
          <Box sx={{ px: 1 }}>
            <Slider
              value={draftSecondary}
              onChange={(_e, v) => setDraftSecondary(v as number)}
              min={0}
              max={100}
              valueLabelDisplay="auto"
              aria-label="Secondary monitor brightness"
              data-testid="slider-secondary-monitor-brightness"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button variant="contained" onClick={handleApply} data-testid="monitor-dialog-apply">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
