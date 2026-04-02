'use client';

/**
 * slider_single-mui-v2-T22: Inverted-track risk appetite with sibling preserved
 *
 * “Policy controls” opens a modal: Throughput bias (55, standard) and Risk appetite (70, track inverted).
 * Numeric readouts below; Save policy commits.
 *
 * Success: Risk appetite committed 30; Throughput bias 55.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

export default function T22({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [draftThroughput, setDraftThroughput] = useState(55);
  const [draftRisk, setDraftRisk] = useState(70);
  const [committedThroughput, setCommittedThroughput] = useState(55);
  const [committedRisk, setCommittedRisk] = useState(70);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committedRisk === 30 && committedThroughput === 55) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedRisk, committedThroughput, onSuccess]);

  const handleOpen = () => {
    setDraftThroughput(committedThroughput);
    setDraftRisk(committedRisk);
    setOpen(true);
  };

  const handleSave = () => {
    setCommittedThroughput(draftThroughput);
    setCommittedRisk(draftRisk);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Box>
      <Button variant="contained" onClick={handleOpen} data-testid="policy-controls-open">
        Policy controls
      </Button>
      <Dialog open={open} onClose={handleCancel} maxWidth="xs" fullWidth>
        <DialogTitle>Policy controls</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" sx={{ mt: 1, mb: 0.5 }}>
            Throughput bias
          </Typography>
          <Box sx={{ px: 1 }}>
            <Slider
              value={draftThroughput}
              onChange={(_e, v) => setDraftThroughput(v as number)}
              min={0}
              max={100}
              step={1}
              valueLabelDisplay="auto"
              aria-label="Throughput bias"
              data-testid="slider-throughput-bias"
            />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {draftThroughput}
          </Typography>

          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Risk appetite
          </Typography>
          <Box sx={{ px: 1 }}>
            <Slider
              track="inverted"
              value={draftRisk}
              onChange={(_e, v) => setDraftRisk(v as number)}
              min={0}
              max={100}
              step={1}
              valueLabelDisplay="auto"
              aria-label="Risk appetite"
              data-testid="slider-risk-appetite"
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {draftRisk}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} data-testid="save-policy">
            Save policy
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
