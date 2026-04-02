'use client';

/**
 * alpha_slider-mui-v2-T11: Dark modal: visual scrim match on compact slider
 *
 * Current vs Target checkerboards; committed after Save scrim. Reference: scrim-target-preview.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Slider,
  Button,
  Modal,
  Stack,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';
import { isAlphaWithinTolerance } from '../../types';

const SCRIM_RGB = { r: 0, g: 0, b: 0 };
const TARGET_ALPHA = 0.44;

function scrimColor(alpha: number) {
  return `rgba(${SCRIM_RGB.r}, ${SCRIM_RGB.g}, ${SCRIM_RGB.b}, ${alpha})`;
}

function ScrimPreview({ alpha, label, testId }: { alpha: number; label: string; testId?: string }) {
  return (
    <Box sx={{ flex: 1 }}>
      <Typography variant="caption" color="grey.400">
        {label}
      </Typography>
      <Box
        data-testid={testId}
        sx={{
          mt: 1,
          height: 120,
          borderRadius: 1,
          position: 'relative',
          backgroundImage: `
            linear-gradient(45deg, #555 25%, transparent 25%),
            linear-gradient(-45deg, #555 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #555 75%),
            linear-gradient(-45deg, transparent 75%, #555 75%)
          `,
          backgroundSize: '16px 16px',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: 1,
            backgroundColor: scrimColor(alpha),
          }}
        />
      </Box>
    </Box>
  );
}

export default function T11({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(75);
  const [committed, setCommitted] = useState(75);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const a = committed / 100;
    if (isAlphaWithinTolerance(a, TARGET_ALPHA, 0.03)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  return (
    <Box sx={{ p: 1 }}>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Edit modal scrim
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 420,
            bgcolor: 'grey.900',
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            outline: 'none',
          }}
        >
          <Typography variant="h6" color="common.white" gutterBottom>
            Edit modal scrim
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <ScrimPreview alpha={draft / 100} label="Current" />
            <ScrimPreview alpha={TARGET_ALPHA} label="Target" testId="scrim-target-preview" />
          </Stack>
          <Typography variant="body2" color="grey.300" sx={{ mt: 2 }}>
            Scrim opacity
          </Typography>
          <Slider
            value={draft}
            min={0}
            max={100}
            onChange={(_, v) => setDraft(v as number)}
            valueLabelDisplay="off"
            size="small"
            sx={{ mt: 1 }}
            aria-label="Scrim opacity"
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={() => setCommitted(draft)}>
              Save scrim
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
