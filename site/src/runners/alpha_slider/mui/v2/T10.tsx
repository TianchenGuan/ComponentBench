'use client';

/**
 * alpha_slider-mui-v2-T10: Gateway row panel scrim in compact table
 *
 * Gateway Panel scrim 0.52 ±0.01; Billing unchanged; Apply in Gateway row. confirm_control: apply-gateway-row
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Slider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';
import { isAlphaWithinTolerance } from '../../types';

const INITIAL_GATEWAY = 30;
const INITIAL_BILLING = 70;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [dG, setDG] = useState(INITIAL_GATEWAY);
  const [dB, setDB] = useState(INITIAL_BILLING);
  const [cG, setCG] = useState(INITIAL_GATEWAY);
  const [cB, setCB] = useState(INITIAL_BILLING);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const g = cG / 100;
    if (isAlphaWithinTolerance(g, 0.52, 0.01) && cB === INITIAL_BILLING) {
      successFired.current = true;
      onSuccess();
    }
  }, [cG, cB, onSuccess]);

  const scrimRow = (
    label: string,
    value: number,
    setValue: (v: number) => void,
    onApply: () => void,
    testId?: string
  ) => (
    <TableRow>
      <TableCell sx={{ color: 'common.white', fontWeight: 600 }}>{label}</TableCell>
      <TableCell>
        <Box sx={{ minWidth: 160 }}>
          <Slider
            value={value}
            min={0}
            max={100}
            onChange={(_, v) => setValue(v as number)}
            valueLabelDisplay="auto"
            valueLabelFormat={(x) => `${x}%`}
            size="small"
            aria-label={`${label} panel scrim opacity`}
          />
        </Box>
      </TableCell>
      <TableCell>
        <Button variant="contained" size="small" onClick={onApply} data-testid={testId}>
          Apply
        </Button>
      </TableCell>
    </TableRow>
  );

  return (
    <Box sx={{ p: 1, maxWidth: 560 }}>
      <TableContainer component={Paper} sx={{ bgcolor: 'grey.900' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'grey.400' }}>Row</TableCell>
              <TableCell sx={{ color: 'grey.400' }}>Panel scrim opacity</TableCell>
              <TableCell sx={{ color: 'grey.400' }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {scrimRow('Gateway', dG, setDG, () => setCG(dG), 'apply-gateway-row')}
            {scrimRow('Billing', dB, setDB, () => setCB(dB), 'apply-billing-row')}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
