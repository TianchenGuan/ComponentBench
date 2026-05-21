'use client';

/**
 * slider_range-mui-v2-T26: Vertical anomaly band in dark thresholds drawer
 *
 * Drawer with vertical range Slider 0.00–1.00, step 0.01. Readout after change commit.
 * Save commits; success when committed band is 0.25–0.75.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Drawer,
  Slider,
  Stack,
  Typography,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import type { TaskComponentProps } from '../../types';

export default function T26({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<number[]>([0.1, 0.9]);
  const [readout, setReadout] = useState<number[]>([0.1, 0.9]);
  const [committed, setCommitted] = useState<number[] | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      committed &&
      Math.abs(committed[0] - 0.25) < 0.0001 &&
      Math.abs(committed[1] - 0.75) < 0.0001
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  const handleSave = () => {
    setCommitted([...draft]);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 520 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Monitoring · thresholds
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<TuneIcon />}
          onClick={() => setOpen(true)}
          data-testid="advanced-thresholds-open"
        >
          Advanced thresholds
        </Button>
        <FormControlLabel control={<Switch defaultChecked size="small" />} label="Alerts" sx={{ ml: 'auto' }} />
      </Stack>
      <Typography variant="caption" color="text.secondary">
        Tune detector sensitivity from the drawer. Unsaved edits are not active.
      </Typography>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { width: 280, p: 2 } }}
        data-testid="thresholds-drawer"
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          Advanced thresholds
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Adjust the vertical band, then save. Noise floor and spike caps are read-only here.
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack direction="row" spacing={2} alignItems="stretch" sx={{ minHeight: 220 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <Typography variant="caption" sx={{ mb: 1, fontWeight: 600 }}>
              Anomaly band
            </Typography>
            <Slider
              orientation="vertical"
              value={draft}
              onChange={(_e, v) => setDraft(v as number[])}
              onChangeCommitted={(_e, v) => setReadout(v as number[])}
              min={0}
              max={1}
              step={0.01}
              valueLabelDisplay="auto"
              sx={{ height: 180 }}
              data-testid="anomaly-band-vertical"
            />
          </Box>
          <Box sx={{ flex: 1, pt: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Last settled range
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 0.5 }}>
              {readout[0].toFixed(2)} – {readout[1].toFixed(2)}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
              Hint: both thumbs must reach 0.25 and 0.75 before Save.
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 3 }}>
          <Button size="small" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button size="small" variant="contained" onClick={handleSave} data-testid="thresholds-save">
            Save
          </Button>
        </Stack>
      </Drawer>
    </Box>
  );
}
