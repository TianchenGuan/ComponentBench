'use client';

/**
 * alpha_slider-mui-v2-T09: Selection mask among three dashboard sliders
 *
 * Dark dashboard: Selection mask 27%; Grid & Focus unchanged; Apply masks.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Slider, Button, Stack, Paper } from '@mui/material';
import type { TaskComponentProps } from '../../types';
import { isAlphaWithinTolerance } from '../../types';

const INITIAL_GRID = 55;
const INITIAL_SELECTION = 80;
const INITIAL_FOCUS = 40;

export default function T09({ onSuccess }: TaskComponentProps) {
  const [dGrid, setDGrid] = useState(INITIAL_GRID);
  const [dSel, setDSel] = useState(INITIAL_SELECTION);
  const [dFocus, setDFocus] = useState(INITIAL_FOCUS);
  const [cGrid, setCGrid] = useState(INITIAL_GRID);
  const [cSel, setCSel] = useState(INITIAL_SELECTION);
  const [cFocus, setCFocus] = useState(INITIAL_FOCUS);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const a = cSel / 100;
    if (
      isAlphaWithinTolerance(a, 0.27, 0.01) &&
      cGrid === INITIAL_GRID &&
      cFocus === INITIAL_FOCUS
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [cGrid, cSel, cFocus, onSuccess]);

  const apply = () => {
    setCGrid(dGrid);
    setCSel(dSel);
    setCFocus(dFocus);
  };

  const row = (label: string, value: number, onChange: (v: number) => void) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2">{label}</Typography>
      <Box
        sx={{
          mt: 1,
          height: 40,
          borderRadius: 1,
          position: 'relative',
          backgroundImage: `
            linear-gradient(45deg, #444 25%, transparent 25%),
            linear-gradient(-45deg, #444 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #444 75%),
            linear-gradient(-45deg, transparent 75%, #444 75%)
          `,
          backgroundSize: '10px 10px',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: 1,
            backgroundColor: `rgba(100, 181, 246, ${value / 100})`,
          }}
        />
      </Box>
      <Slider
        value={value}
        min={0}
        max={100}
        onChange={(_, v) => onChange(v as number)}
        valueLabelDisplay="auto"
        valueLabelFormat={(x) => `${x}%`}
        size="small"
      />
    </Box>
  );

  return (
    <Box sx={{ p: 1, maxWidth: 520 }}>
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
        {[1, 2, 3, 4].map((i) => (
          <Paper key={i} sx={{ p: 1, minWidth: 72, bgcolor: 'grey.800' }}>
            <Typography variant="caption" color="grey.400">
              M{i}
            </Typography>
            <Typography variant="h6" color="common.white">
              {12 + i * 7}%
            </Typography>
          </Paper>
        ))}
      </Stack>
      <Paper sx={{ p: 2, bgcolor: 'grey.900' }}>
        <Typography variant="h6" color="common.white" gutterBottom>
          Mask panel
        </Typography>
        {row('Grid mask', dGrid, setDGrid)}
        {row('Selection mask', dSel, setDSel)}
        {row('Focus mask', dFocus, setDFocus)}
        <Button variant="contained" color="primary" onClick={apply} fullWidth>
          Apply masks
        </Button>
      </Paper>
    </Box>
  );
}
