'use client';

/**
 * slider_range-mui-v2-T28: Luminance window vs mini-chart band; Apply tuning
 *
 * Histogram highlights target band 42–68 on 0–100. Luminance + Contrast range sliders.
 * Success: committed Luminance within ±2 of 42 and 68 on each end; Contrast stays 20–80.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Slider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';

const TARGET_LO = 42;
const TARGET_HI = 68;
const TOL = 2;

function LuminanceChart() {
  return (
    <Box
      sx={{
        position: 'relative',
        height: 44,
        borderRadius: 1,
        bgcolor: 'action.hover',
        overflow: 'hidden',
        mb: 1,
      }}
      data-testid="luminance-mini-chart"
    >
      {Array.from({ length: 24 }).map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            left: `${(i / 24) * 100}%`,
            bottom: 0,
            width: `${100 / 24}%`,
            height: `${20 + ((i * 17) % 73)}%`,
            bgcolor: 'grey.400',
            opacity: 0.35,
          }}
        />
      ))}
      <Box
        sx={{
          position: 'absolute',
          left: `${TARGET_LO}%`,
          width: `${TARGET_HI - TARGET_LO}%`,
          top: 4,
          bottom: 4,
          bgcolor: 'primary.main',
          opacity: 0.35,
          borderRadius: 0.5,
        }}
      />
    </Box>
  );
}

export default function T28({ onSuccess }: TaskComponentProps) {
  const [draftLum, setDraftLum] = useState<number[]>([0, 100]);
  const [draftContrast, setDraftContrast] = useState<number[]>([20, 80]);
  const [committedLum, setCommittedLum] = useState<number[]>([0, 100]);
  const [committedContrast, setCommittedContrast] = useState<number[]>([20, 80]);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const loOk = committedLum[0] >= TARGET_LO - TOL && committedLum[0] <= TARGET_LO + TOL;
    const hiOk = committedLum[1] >= TARGET_HI - TOL && committedLum[1] <= TARGET_HI + TOL;
    if (
      loOk &&
      hiOk &&
      committedContrast[0] === 20 &&
      committedContrast[1] === 80
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [committedLum, committedContrast, onSuccess]);

  const handleApply = () => {
    setCommittedLum([...draftLum]);
    setCommittedContrast([...draftContrast]);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 640 }}>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
        <Chip size="small" label="GPU: idle" />
        <Chip size="small" label="Color space: sRGB" variant="outlined" />
        <Chip size="small" label="HDR: off" variant="outlined" />
      </Stack>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Rendering controls
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            Match the highlighted band (target center {TARGET_LO}–{TARGET_HI}); Apply tuning commits.
          </Typography>

          <LuminanceChart />

          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            Luminance range
          </Typography>
          <Box sx={{ px: 1, mb: 2 }}>
            <Slider
              value={draftLum}
              onChange={(_e, v) => setDraftLum(v as number[])}
              min={0}
              max={100}
              step={1}
              valueLabelDisplay="auto"
              data-testid="luminance-range"
            />
          </Box>
          <Typography variant="caption" color="text.secondary">
            Selected: {draftLum[0]} – {draftLum[1]} pts
          </Typography>

          <Typography variant="subtitle2" sx={{ mt: 2, mb: 0.5 }}>
            Contrast range
          </Typography>
          <Box sx={{ px: 1, mb: 1 }}>
            <Slider
              value={draftContrast}
              onChange={(_e, v) => setDraftContrast(v as number[])}
              min={0}
              max={100}
              step={1}
              valueLabelDisplay="auto"
              data-testid="contrast-range"
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            Selected: {draftContrast[0]} – {draftContrast[1]} pts
          </Typography>

          <Button size="small" variant="contained" onClick={handleApply} data-testid="apply-tuning">
            Apply tuning
          </Button>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mt: 2 }}>
        <CardContent sx={{ py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Recent frame stats
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Pass</TableCell>
                <TableCell align="right">ms</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Shadow</TableCell>
                <TableCell align="right">2.1</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Post</TableCell>
                <TableCell align="right">4.8</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
}
