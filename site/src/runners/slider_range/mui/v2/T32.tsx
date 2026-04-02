'use client';

/**
 * slider_range-mui-v2-T32: Release window with irregular marks on a crowded dashboard
 *
 * Release controls: marks at 5,15,25,35,70,80,90; step null. Starts 5–90. Three other cards with range sliders.
 * No Apply — success when Release is exactly 35–80 and distractors unchanged.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Card, CardContent, Slider, Stack, Typography, Chip } from '@mui/material';
import type { TaskComponentProps } from '../../types';

const RELEASE_MARKS = [
  { value: 5, label: '5' },
  { value: 15, label: '15' },
  { value: 25, label: '25' },
  { value: 35, label: '35' },
  { value: 70, label: '70' },
  { value: 80, label: '80' },
  { value: 90, label: '90' },
];

const DISTRACTOR_A_INIT: number[] = [12, 88];
const DISTRACTOR_B_INIT: number[] = [20, 60];
const DISTRACTOR_C_INIT: number[] = [5, 95];

export default function T32({ onSuccess }: TaskComponentProps) {
  const [release, setRelease] = useState<number[]>([5, 90]);
  const [dA, setDA] = useState<number[]>(DISTRACTOR_A_INIT);
  const [dB, setDB] = useState<number[]>(DISTRACTOR_B_INIT);
  const [dC, setDC] = useState<number[]>(DISTRACTOR_C_INIT);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const same =
      dA[0] === DISTRACTOR_A_INIT[0] &&
      dA[1] === DISTRACTOR_A_INIT[1] &&
      dB[0] === DISTRACTOR_B_INIT[0] &&
      dB[1] === DISTRACTOR_B_INIT[1] &&
      dC[0] === DISTRACTOR_C_INIT[0] &&
      dC[1] === DISTRACTOR_C_INIT[1];
    if (release[0] === 35 && release[1] === 80 && same) {
      successFired.current = true;
      onSuccess();
    }
  }, [release, dA, dB, dC, onSuccess]);

  return (
    <Box sx={{ width: '100%', maxWidth: 900 }}>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
        <Chip size="small" label="Build 4821" />
        <Chip size="small" label="Train: nightly" variant="outlined" />
        <Chip size="small" label="Owner: platform" variant="outlined" />
        <Chip size="small" label="Risk: medium" color="warning" variant="outlined" />
      </Stack>
      <Stack direction="row" flexWrap="wrap" spacing={2} useFlexGap sx={{ alignItems: 'stretch' }}>
        <Box sx={{ flex: '1 1 280px', minWidth: 260 }}>
          <Card variant="outlined" data-testid="release-controls-card" sx={{ height: '100%' }}>
            <CardContent sx={{ py: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                Release controls
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Release window
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Snap to marks only (irregular spacing).
              </Typography>
              <Box sx={{ px: 1 }}>
                <Slider
                  value={release}
                  onChange={(_e, v) => setRelease(v as number[])}
                  min={0}
                  max={100}
                  step={null}
                  marks={RELEASE_MARKS}
                  valueLabelDisplay="auto"
                  data-testid="release-window-range"
                />
              </Box>
              <Typography variant="caption" sx={{ fontFamily: 'monospace', display: 'block', mt: 1 }}>
                Readout: {release[0]} – {release[1]}
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 280px', minWidth: 260 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent sx={{ py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Canary traffic
              </Typography>
              <Box sx={{ px: 1 }}>
                <Slider
                  value={dA}
                  onChange={(_e, v) => setDA(v as number[])}
                  min={0}
                  max={100}
                  step={1}
                  valueLabelDisplay="auto"
                  size="small"
                  data-testid="canary-traffic-range"
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 280px', minWidth: 260 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent sx={{ py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Rollout pacing
              </Typography>
              <Box sx={{ px: 1 }}>
                <Slider
                  value={dB}
                  onChange={(_e, v) => setDB(v as number[])}
                  min={0}
                  max={100}
                  step={1}
                  valueLabelDisplay="auto"
                  size="small"
                  data-testid="rollout-pacing-range"
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 280px', minWidth: 260 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent sx={{ py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Freeze window
              </Typography>
              <Box sx={{ px: 1 }}>
                <Slider
                  value={dC}
                  onChange={(_e, v) => setDC(v as number[])}
                  min={0}
                  max={100}
                  step={1}
                  valueLabelDisplay="auto"
                  size="small"
                  data-testid="freeze-window-range"
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
}
