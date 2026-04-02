'use client';

/**
 * slider_single-mui-v2-T19: Max requests exact calibration in a rate-limit drawer
 *
 * “Rate-limit controls” opens a drawer: Max requests 0–1000 (marks 0,250,500,750,1000), Burst 0–100.
 * Post-release readout under each slider. Save limits commits.
 *
 * Success: Max requests committed within ±2 of 875; Burst cap 40; Save limits clicked (via commit).
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Drawer,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

const maxMarks = [
  { value: 0, label: '0' },
  { value: 250, label: '250' },
  { value: 500, label: '500' },
  { value: 750, label: '750' },
  { value: 1000, label: '1000' },
];

export default function T19({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [draftMax, setDraftMax] = useState(500);
  const [draftBurst, setDraftBurst] = useState(40);
  const [committedMax, setCommittedMax] = useState(500);
  const [committedBurst, setCommittedBurst] = useState(40);
  const [displayMax, setDisplayMax] = useState(500);
  const [displayBurst, setDisplayBurst] = useState(40);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const maxOk = Math.abs(committedMax - 875) <= 2;
    if (maxOk && committedBurst === 40) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedMax, committedBurst, onSuccess]);

  const handleOpen = () => {
    setDraftMax(committedMax);
    setDraftBurst(committedBurst);
    setDisplayMax(committedMax);
    setDisplayBurst(committedBurst);
    setOpen(true);
  };

  const handleSave = () => {
    setCommittedMax(draftMax);
    setCommittedBurst(draftBurst);
    setDisplayMax(draftMax);
    setDisplayBurst(draftBurst);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 480 }}>
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent sx={{ py: 1.5 }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Typography variant="body2" color="text.secondary">
              API traffic
            </Typography>
            <Chip size="small" label="Zone: prod" variant="outlined" />
            <Chip size="small" label="Tier: enterprise" variant="outlined" />
          </Stack>
        </CardContent>
      </Card>
      <Button variant="outlined" onClick={handleOpen} data-testid="rate-limit-drawer-open">
        Rate-limit controls
      </Button>

      <Drawer anchor="right" open={open} onClose={handleCancel} PaperProps={{ sx: { width: 320, p: 2 } }}>
        <Typography variant="subtitle1" gutterBottom>
          Limits
        </Typography>
        <Typography variant="subtitle2" sx={{ mt: 1, mb: 0.5 }}>
          Max requests
        </Typography>
        <Box sx={{ px: 1 }}>
          <Slider
            value={draftMax}
            onChange={(_e, v) => setDraftMax(v as number)}
            onChangeCommitted={(_e, v) => setDisplayMax(v as number)}
            min={0}
            max={1000}
            step={1}
            marks={maxMarks}
            valueLabelDisplay="auto"
            aria-label="Max requests"
            data-testid="slider-max-requests"
          />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          Current: {displayMax}
        </Typography>

        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          Burst cap
        </Typography>
        <Box sx={{ px: 1 }}>
          <Slider
            value={draftBurst}
            onChange={(_e, v) => setDraftBurst(v as number)}
            onChangeCommitted={(_e, v) => setDisplayBurst(v as number)}
            min={0}
            max={100}
            step={1}
            valueLabelDisplay="auto"
            aria-label="Burst cap"
            data-testid="slider-burst-cap"
          />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          Current: {displayBurst}
        </Typography>

        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 'auto', pt: 2 }}>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} data-testid="save-rate-limits">
            Save limits
          </Button>
        </Stack>
      </Drawer>
    </Box>
  );
}
