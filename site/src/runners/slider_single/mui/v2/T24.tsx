'use client';

/**
 * slider_single-mui-v2-T24: Irregular-marks backoff mode in a popover
 *
 * “Advanced backoff” opens a Popover: Retry mode and Backoff mode, step=null, marks 0, 26, 37, 100.
 * Initial Retry 26, Backoff 0. Apply commits.
 *
 * Success: Backoff mode committed 37; Retry mode 26.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Popover,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

const irregularMarks = [
  { value: 0, label: '0' },
  { value: 26, label: '26' },
  { value: 37, label: '37' },
  { value: 100, label: '100' },
];

export default function T24({ onSuccess }: TaskComponentProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [draftRetry, setDraftRetry] = useState(26);
  const [draftBackoff, setDraftBackoff] = useState(0);
  const [committedRetry, setCommittedRetry] = useState(26);
  const [committedBackoff, setCommittedBackoff] = useState(0);
  const successFired = useRef(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (successFired.current) return;
    if (committedBackoff === 37 && committedRetry === 26) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedBackoff, committedRetry, onSuccess]);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setDraftRetry(committedRetry);
    setDraftBackoff(committedBackoff);
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleApply = () => {
    setCommittedRetry(draftRetry);
    setCommittedBackoff(draftBackoff);
    setAnchorEl(null);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 480 }}>
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent sx={{ py: 1.5 }}>
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
            <Chip size="small" label="Policy pack: default" />
            <Chip size="small" label="Queue: outbound" variant="outlined" />
          </Stack>
        </CardContent>
      </Card>
      <Button variant="outlined" onClick={handleOpen} data-testid="advanced-backoff-open">
        Advanced backoff
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, width: 320 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Retry mode
          </Typography>
          <Box sx={{ px: 1 }}>
            <Slider
              value={draftRetry}
              onChange={(_e, v) => setDraftRetry(v as number)}
              min={0}
              max={100}
              step={null}
              marks={irregularMarks}
              valueLabelDisplay="auto"
              aria-label="Retry mode"
              data-testid="slider-retry-mode"
            />
          </Box>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
            Backoff mode
          </Typography>
          <Box sx={{ px: 1 }}>
            <Slider
              value={draftBackoff}
              onChange={(_e, v) => setDraftBackoff(v as number)}
              min={0}
              max={100}
              step={null}
              marks={irregularMarks}
              valueLabelDisplay="auto"
              aria-label="Backoff mode"
              data-testid="slider-backoff-mode"
            />
          </Box>
          <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleApply} data-testid="backoff-popover-apply">
              Apply
            </Button>
          </Stack>
        </Box>
      </Popover>
    </Box>
  );
}
