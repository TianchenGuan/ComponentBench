'use client';

/**
 * alpha_slider-mui-v2-T07: Reversed vertical slider in tokens drawer
 *
 * Mask tokens drawer: Overlay opacity 0.35 ±0.03 (reversed vertical slider); Shadow unchanged; Save tokens.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Drawer,
  Typography,
  Slider,
  Box,
  Stack,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';
import { isAlphaWithinTolerance } from '../../types';

function CheckerPreview({ overlayA, shadowA }: { overlayA: number; shadowA: number }) {
  return (
    <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
      <Box>
        <Typography variant="caption" color="text.secondary">
          Overlay
        </Typography>
        <Box
          sx={{
            width: 72,
            height: 72,
            mt: 0.5,
            borderRadius: 1,
            position: 'relative',
            backgroundImage: `
              linear-gradient(45deg, #ccc 25%, transparent 25%),
              linear-gradient(-45deg, #ccc 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #ccc 75%),
              linear-gradient(-45deg, transparent 75%, #ccc 75%)
            `,
            backgroundSize: '12px 12px',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              borderRadius: 1,
              backgroundColor: `rgba(156, 39, 176, ${overlayA})`,
            }}
          />
        </Box>
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary">
          Shadow
        </Typography>
        <Box
          sx={{
            width: 72,
            height: 72,
            mt: 0.5,
            borderRadius: 1,
            position: 'relative',
            backgroundImage: `
              linear-gradient(45deg, #ccc 25%, transparent 25%),
              linear-gradient(-45deg, #ccc 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #ccc 75%),
              linear-gradient(-45deg, transparent 75%, #ccc 75%)
            `,
            backgroundSize: '12px 12px',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              borderRadius: 1,
              backgroundColor: `rgba(33, 33, 33, ${shadowA})`,
            }}
          />
        </Box>
      </Box>
    </Stack>
  );
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const initialShadow = 60;
  const [open, setOpen] = useState(false);
  const [draftOverlay, setDraftOverlay] = useState(100);
  const [draftShadow, setDraftShadow] = useState(initialShadow);
  const [committedOverlay, setCommittedOverlay] = useState(100);
  const [committedShadow, setCommittedShadow] = useState(initialShadow);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const o = committedOverlay / 100;
    if (
      isAlphaWithinTolerance(o, 0.35, 0.03) &&
      committedShadow === initialShadow
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedOverlay, committedShadow, initialShadow, onSuccess]);

  const save = () => {
    setCommittedOverlay(draftOverlay);
    setCommittedShadow(draftShadow);
  };

  const reversedOverlayValue = 100 - draftOverlay;

  return (
    <Box sx={{ p: 1 }}>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Mask tokens
      </Button>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: 360, p: 2 } }}>
        <Typography variant="h6" gutterBottom>
          Mask tokens
        </Typography>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <Box>
            <Typography variant="subtitle2">Overlay opacity</Typography>
            <Typography variant="caption" color="text.secondary">
              Vertical track: lower opacity toward the top
            </Typography>
            <CheckerPreview overlayA={draftOverlay / 100} shadowA={draftShadow / 100} />
            <Box sx={{ height: 160, display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Slider
                orientation="vertical"
                min={0}
                max={100}
                value={reversedOverlayValue}
                onChange={(_, v) => setDraftOverlay(100 - (v as number))}
                valueLabelDisplay="off"
                aria-label="Overlay opacity"
                sx={{ height: 140 }}
              />
            </Box>
          </Box>
          <Box>
            <Typography variant="subtitle2">Shadow opacity</Typography>
            <CheckerPreview overlayA={draftOverlay / 100} shadowA={draftShadow / 100} />
            <Box sx={{ height: 160, display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Slider
                orientation="vertical"
                min={0}
                max={100}
                value={draftShadow}
                onChange={(_, v) => setDraftShadow(v as number)}
                valueLabelDisplay="off"
                aria-label="Shadow opacity"
                sx={{ height: 140 }}
              />
            </Box>
          </Box>
        </Stack>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={save}>
            Save tokens
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}
