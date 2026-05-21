'use client';

/**
 * slider_range-mui-v2-T31: Gateway row retry band in Service windows table
 *
 * Each row: Retry band range slider, readout, row-local Save. Toolbar clutter.
 * Success: Gateway committed 20–60, Billing 15–45, Gateway Save used.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Slider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import type { TaskComponentProps } from '../../types';

export default function T31({ onSuccess }: TaskComponentProps) {
  const [gwDraft, setGwDraft] = useState<number[]>([10, 50]);
  const [billDraft, setBillDraft] = useState<number[]>([15, 45]);
  const [gwCommitted, setGwCommitted] = useState<number[]>([10, 50]);
  const [billCommitted, setBillCommitted] = useState<number[]>([15, 45]);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      gwCommitted[0] === 20 &&
      gwCommitted[1] === 60 &&
      billCommitted[0] === 15 &&
      billCommitted[1] === 45
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [gwCommitted, billCommitted, onSuccess]);

  return (
    <Box sx={{ width: '100%', maxWidth: 640 }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        Edge routing
      </Typography>
      <Toolbar
        variant="dense"
        sx={{
          minHeight: 40,
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          mb: 1,
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        <Chip size="small" label="Prod" color="primary" variant="outlined" />
        <Chip size="small" label="v2" variant="outlined" />
        <Chip size="small" label="Latency SLO" variant="outlined" />
      </Toolbar>
      <TableContainer
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          maxWidth: '100%',
        }}
        data-testid="service-windows-table"
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Service</TableCell>
              <TableCell sx={{ minWidth: 200 }}>Retry band</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="body2" fontWeight={600}>
                  Gateway
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ px: 0.5 }}>
                  <Slider
                    size="small"
                    value={gwDraft}
                    onChange={(_e, v) => setGwDraft(v as number[])}
                    min={0}
                    max={100}
                    step={1}
                    valueLabelDisplay="auto"
                    data-testid="gateway-retry-band"
                  />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                  Selected: {gwDraft[0]} – {gwDraft[1]} s
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="center">
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => setGwCommitted([...gwDraft])}
                    data-testid="save-gateway-retry-band"
                  >
                    Save
                  </Button>
                  <IconButton size="small" aria-label="row menu">
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="body2" fontWeight={600}>
                  Billing
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ px: 0.5 }}>
                  <Slider
                    size="small"
                    value={billDraft}
                    onChange={(_e, v) => setBillDraft(v as number[])}
                    min={0}
                    max={100}
                    step={1}
                    valueLabelDisplay="auto"
                    data-testid="billing-retry-band"
                  />
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                  Selected: {billDraft[0]} – {billDraft[1]} s
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="center">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setBillCommitted([...billDraft])}
                    data-testid="save-billing-retry-band"
                  >
                    Save
                  </Button>
                  <IconButton size="small" aria-label="row menu">
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        Saved · Gateway: {gwCommitted[0]}–{gwCommitted[1]} s · Billing: {billCommitted[0]}–{billCommitted[1]} s
      </Typography>
    </Box>
  );
}
