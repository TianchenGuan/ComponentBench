'use client';

/**
 * time_picker-mui-v2-T37: TimeField keyboard edit in a compact operations row
 *
 * Two rows: Pipeline A (Cutoff 08:30) and Pipeline B (empty). Row Apply commits that row only.
 *
 * Success: B committed 09:07 after Apply; A stays 08:30.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { LocalizationProvider, TimeField } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../../types';

function fmt(d: Dayjs | null): string {
  if (!d || !d.isValid()) return '';
  return d.format('HH:mm');
}

export default function T37({ onSuccess }: TaskComponentProps) {
  const [draftA, setDraftA] = useState<Dayjs | null>(dayjs('08:30', 'HH:mm'));
  const [draftB, setDraftB] = useState<Dayjs | null>(null);
  const [committedA, setCommittedA] = useState<Dayjs | null>(dayjs('08:30', 'HH:mm'));
  const [committedB, setCommittedB] = useState<Dayjs | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    if (fmt(committedA) === '08:30' && fmt(committedB) === '09:07') {
      fired.current = true;
      onSuccess();
    }
  }, [committedA, committedB, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ maxWidth: 520 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Operations
        </Typography>
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Pipeline</TableCell>
                <TableCell>Cutoff time</TableCell>
                <TableCell align="right" width={100}>
                  {' '}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Pipeline A</TableCell>
                <TableCell>
                  <TimeField
                    value={draftA}
                    onChange={(v) => setDraftA(v)}
                    format="HH:mm"
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        inputProps: { 'data-testid': 'cutoff-pipeline-a' },
                      },
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setCommittedA(draftA)}
                    data-testid="apply-pipeline-a"
                  >
                    Apply
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Pipeline B</TableCell>
                <TableCell>
                  <TimeField
                    value={draftB}
                    onChange={(v) => setDraftB(v)}
                    format="HH:mm"
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        inputProps: { 'data-testid': 'cutoff-pipeline-b' },
                      },
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => setCommittedB(draftB)}
                    data-testid="apply-pipeline-b"
                  >
                    Apply
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="caption" color="text.secondary">
          Enter 09:07 in Pipeline B and Apply that row only.
        </Typography>
      </Box>
    </LocalizationProvider>
  );
}
