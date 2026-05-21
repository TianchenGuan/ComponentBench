'use client';

/**
 * slider_range-mui-v2-T29: Inverted-track allocation window in dark modal
 *
 * Allocation window: track inverted. Fallback window: normal. Save commits.
 * Success: Allocation 30–70, Fallback 10–40.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Slider,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

export default function T29({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [draftAlloc, setDraftAlloc] = useState<number[]>([20, 80]);
  const [draftFallback, setDraftFallback] = useState<number[]>([10, 40]);
  const [committedAlloc, setCommittedAlloc] = useState<number[]>([20, 80]);
  const [committedFallback, setCommittedFallback] = useState<number[]>([10, 40]);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      committedAlloc[0] === 30 &&
      committedAlloc[1] === 70 &&
      committedFallback[0] === 10 &&
      committedFallback[1] === 40
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedAlloc, committedFallback, onSuccess]);

  const handleSave = () => {
    setCommittedAlloc([...draftAlloc]);
    setCommittedFallback([...draftFallback]);
    setOpen(false);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 520 }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        Cluster capacity
      </Typography>
      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
        <Button variant="outlined" size="small" onClick={() => setOpen(true)} data-testid="open-allocation-modal">
          Advanced allocation
        </Button>
        <FormControlLabel control={<Switch size="small" />} label="Auto-rebalance" />
        <Typography variant="caption" color="text.secondary">
          Live: Alloc {committedAlloc[0]}–{committedAlloc[1]} · Fallback {committedFallback[0]}–{committedFallback[1]}
        </Typography>
      </Stack>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth data-testid="allocation-modal">
        <DialogTitle>Advanced allocation</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Allocation window uses an inverted track for emphasis; use numeric labels, not fill direction.
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Allocation window
          </Typography>
          <Box sx={{ px: 1, mb: 2 }}>
            <Slider
              track="inverted"
              value={draftAlloc}
              onChange={(_e, v) => setDraftAlloc(v as number[])}
              min={0}
              max={100}
              step={1}
              valueLabelDisplay="auto"
              data-testid="allocation-window-range"
            />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Fallback window
          </Typography>
          <Box sx={{ px: 1 }}>
            <Slider
              value={draftFallback}
              onChange={(_e, v) => setDraftFallback(v as number[])}
              min={0}
              max={100}
              step={1}
              valueLabelDisplay="auto"
              data-testid="fallback-window-range"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} data-testid="allocation-modal-save">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
