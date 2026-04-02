'use client';

/**
 * datetime_picker_range-mui-v2-T26: Pipeline B — single TextField typed range + row Apply (Pro SingleInput unavailable; keyboard parse path)
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { TaskComponentProps } from '../../types';

dayjs.extend(customParseFormat);

const PIPELINE_A_LABEL = '2027-04-09 10:00 – 2027-04-09 12:00';

function parseRangeInput(raw: string): { start: dayjs.Dayjs; end: dayjs.Dayjs } | null {
  const trimmed = raw.trim();
  const parts = trimmed.split(/\s*[–—-]\s+/);
  if (parts.length !== 2) return null;
  const fmt = 'MM/DD/YYYY hh:mm A';
  const a = dayjs(parts[0].trim(), fmt, true);
  const b = dayjs(parts[1].trim(), fmt, true);
  if (!a.isValid() || !b.isValid()) return null;
  return { start: a, end: b };
}

export default function T26({ onSuccess }: TaskComponentProps) {
  const [input, setInput] = useState('');
  const [committed, setCommitted] = useState<{ start: dayjs.Dayjs; end: dayjs.Dayjs } | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current || !committed) return;
    const sOk = committed.start.format('YYYY-MM-DD HH:mm') === '2027-04-10 08:15';
    const eOk = committed.end.format('YYYY-MM-DD HH:mm') === '2027-04-10 09:45';
    if (sOk && eOk) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  return (
    <Box sx={{ p: 1, maxWidth: 720 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        Example format: 04/10/2027 08:15 AM – 04/10/2027 09:45 AM
      </Typography>
      <Table size="small" component={Paper} variant="outlined">
        <TableHead>
          <TableRow>
            <TableCell width={120}>Pipeline</TableCell>
            <TableCell>Editing window</TableCell>
            <TableCell width={100} />
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Pipeline A</TableCell>
            <TableCell data-cb-instance="Pipeline A / Editing window">
              <TextField
                size="small"
                fullWidth
                value={PIPELINE_A_LABEL}
                disabled
                inputProps={{ 'data-testid': 'dt-pipeline-a-range' }}
              />
            </TableCell>
            <TableCell />
          </TableRow>
          <TableRow>
            <TableCell>Pipeline B</TableCell>
            <TableCell data-cb-instance="Pipeline B / Editing window">
              <TextField
                size="small"
                fullWidth
                placeholder="MM/DD/YYYY hh:mm A – MM/DD/YYYY hh:mm A"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                inputProps={{ 'data-testid': 'dt-pipeline-b-range' }}
              />
            </TableCell>
            <TableCell>
              <Button
                size="small"
                variant="contained"
                onClick={() => {
                  const p = parseRangeInput(input);
                  if (p) setCommitted(p);
                }}
              >
                Apply
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
}
