'use client';

/**
 * slider_single-mui-v2-T18: Advanced smoothing below the fold in dark settings
 *
 * Nested scroll: inner panel with Sharpening (6), Contrast (5), then Advanced + Smoothing (→7).
 * Integer 0–10 sliders with row readouts; immediate apply.
 *
 * Success: Smoothing 7; Sharpening 6; Contrast 5.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

export default function T18({ onSuccess }: TaskComponentProps) {
  const [sharpening, setSharpening] = useState(6);
  const [contrast, setContrast] = useState(5);
  const [smoothing, setSmoothing] = useState(4);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (smoothing === 7 && sharpening === 6 && contrast === 5) {
      successFired.current = true;
      onSuccess();
    }
  }, [smoothing, sharpening, contrast, onSuccess]);

  const row = (
    label: string,
    value: number,
    setValue: (n: number) => void,
    testId: string,
  ) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      <Box sx={{ px: 1 }}>
        <Slider
          value={value}
          onChange={(_e, v) => setValue(v as number)}
          min={0}
          max={10}
          step={1}
          marks
          valueLabelDisplay="auto"
          aria-label={label}
          data-testid={testId}
        />
      </Box>
      <Typography variant="caption" color="text.secondary">
        Current: {value}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ width: '100%', maxWidth: 440 }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        Image pipeline
      </Typography>
      <Box
        sx={{
          maxHeight: 320,
          overflow: 'auto',
          border: (t) => `1px solid ${t.palette.divider}`,
          borderRadius: 1,
          p: 1.5,
        }}
        data-testid="settings-inner-scroll"
      >
        <Card variant="outlined" sx={{ mb: 2, bgcolor: 'action.hover' }}>
          <CardContent sx={{ py: 1 }}>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
              <Chip size="small" label="GPU" />
              <Chip size="small" label="Denoise" />
              <Chip size="small" label="LUT: Cine" />
            </Stack>
          </CardContent>
        </Card>
        {row('Sharpening', sharpening, setSharpening, 'slider-sharpening')}
        {row('Contrast', contrast, setContrast, 'slider-contrast')}
        <Divider sx={{ my: 2 }} />
        <Typography variant="overline" color="text.secondary">
          Advanced
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 1 }}>
          Fine-grain controls for edge reconstruction. Scroll to reach Smoothing if needed.
        </Typography>
        <Box sx={{ height: 120 }} />
        {row('Smoothing', smoothing, setSmoothing, 'slider-smoothing')}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
          Tip: temporal smoothing reduces shimmer on thin lines without blurring large regions.
        </Typography>
      </Box>
    </Box>
  );
}
