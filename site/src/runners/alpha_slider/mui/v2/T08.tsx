'use client';

/**
 * alpha_slider-mui-v2-T08: Scroll to Heatmap opacity and match target chip
 *
 * Overlays section: Heatmap opacity matches target (±0.02 alpha). Blur slider unchanged. Reference: heatmap-target-chip.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Slider, Stack, Divider } from '@mui/material';
import type { TaskComponentProps } from '../../types';
import { isAlphaWithinTolerance } from '../../types';

const HEATMAP_RGB = { r: 255, g: 87, b: 34 };
const TARGET_ALPHA = 0.52;
const INITIAL_BLUR = 38;

function chipRgba(alpha: number) {
  return `rgba(${HEATMAP_RGB.r}, ${HEATMAP_RGB.g}, ${HEATMAP_RGB.b}, ${alpha})`;
}

function HeatmapChip({ alpha, label, testId }: { alpha: number; label: string; testId?: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Box
        data-testid={testId}
        sx={{
          mt: 0.5,
          width: 56,
          height: 56,
          borderRadius: 1,
          position: 'relative',
          backgroundImage: `
            linear-gradient(45deg, #ccc 25%, transparent 25%),
            linear-gradient(-45deg, #ccc 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #ccc 75%),
            linear-gradient(-45deg, transparent 75%, #ccc 75%)
          `,
          backgroundSize: '10px 10px',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: 1,
            backgroundColor: chipRgba(alpha),
          }}
        />
      </Box>
    </Box>
  );
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [heatmapPct, setHeatmapPct] = useState(100);
  const [blur, setBlur] = useState(INITIAL_BLUR);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const a = heatmapPct / 100;
    if (
      isAlphaWithinTolerance(a, TARGET_ALPHA, 0.02) &&
      blur === INITIAL_BLUR
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [heatmapPct, blur, onSuccess]);

  return (
    <Box
      sx={{
        p: 1,
        maxWidth: 400,
        maxHeight: 280,
        overflow: 'auto',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    >
      <Typography variant="subtitle2">General</Typography>
      <Typography variant="caption" color="text.secondary">
        Unrelated settings filler
      </Typography>
      <Box sx={{ height: 200 }} />
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle2">Typography</Typography>
      <Box sx={{ height: 160 }} />
      <Divider sx={{ my: 2 }} />
      <Typography variant="subtitle2" id="overlays-section">
        Overlays
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mt: 2, alignItems: 'flex-end' }}>
        <HeatmapChip alpha={heatmapPct / 100} label="Current" />
        <HeatmapChip alpha={TARGET_ALPHA} label="Target" testId="heatmap-target-chip" />
      </Stack>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Heatmap opacity
      </Typography>
      <Slider
        value={heatmapPct}
        min={0}
        max={100}
        onChange={(_, v) => setHeatmapPct(v as number)}
        valueLabelDisplay="auto"
        valueLabelFormat={(v) => `${v}%`}
        aria-label="Heatmap opacity"
      />
      <Typography variant="body2" sx={{ mt: 2 }}>
        Blur
      </Typography>
      <Slider
        value={blur}
        min={0}
        max={100}
        onChange={(_, v) => setBlur(v as number)}
        valueLabelDisplay="off"
        aria-label="Blur"
      />
    </Box>
  );
}
