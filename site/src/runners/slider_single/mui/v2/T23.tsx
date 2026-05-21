'use client';

/**
 * slider_single-mui-v2-T23: EU tax row in a compact table
 *
 * Regional tax rates: US=7, EU=12, APAC=10. Row-local Save commits that row only.
 * Toolbar clutter: search, chips, pagination stub.
 *
 * Success: EU committed 18; US 7; APAC 10 (via EU row Save).
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Pagination,
  Slider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { TaskComponentProps } from '../../types';

type RowKey = 'us' | 'eu' | 'apac';

export default function T23({ onSuccess }: TaskComponentProps) {
  const initial = { us: 7, eu: 12, apac: 10 };
  const [draft, setDraft] = useState(initial);
  const [committed, setCommitted] = useState(initial);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (committed.eu === 18 && committed.us === 7 && committed.apac === 10) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  const saveRow = (key: RowKey) => {
    setCommitted((c) => ({ ...c, [key]: draft[key] }));
  };

  const rowSlider = (key: RowKey, region: string) => (
    <TableRow>
      <TableCell sx={{ fontWeight: 600 }}>{region}</TableCell>
      <TableCell>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
          Tax rate
        </Typography>
        <Box sx={{ width: 200, px: 1 }}>
          <Slider
            size="small"
            value={draft[key]}
            onChange={(_e, v) => setDraft((d) => ({ ...d, [key]: v as number }))}
            min={0}
            max={25}
            step={1}
            valueLabelDisplay="auto"
            aria-label={`${region} / Tax rate`}
            data-testid={`slider-tax-${key}`}
          />
        </Box>
        <Typography variant="caption" fontFamily="monospace">
          {draft[key]}%
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Button
          size="small"
          variant="outlined"
          onClick={() => saveRow(key)}
          data-testid={key === 'eu' ? 'save-eu-tax-rate' : `save-${key}-tax-rate`}
        >
          Save
        </Button>
      </TableCell>
    </TableRow>
  );

  return (
    <Box sx={{ width: '100%', maxWidth: 720 }}>
      <Typography variant="subtitle1" gutterBottom>
        Regional tax rates
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
        <TextField size="small" placeholder="Search regions" sx={{ minWidth: 160 }} />
        <Chip size="small" label="FY26" />
        <Chip size="small" label="Standard" variant="outlined" />
        <Box sx={{ flex: 1 }} />
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconButton size="small" disabled>
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
          <Typography variant="caption">1 / 4</Typography>
          <IconButton size="small" disabled>
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Region</TableCell>
            <TableCell>Rate</TableCell>
            <TableCell align="right">Row actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rowSlider('us', 'US')}
          {rowSlider('eu', 'EU')}
          {rowSlider('apac', 'APAC')}
        </TableBody>
      </Table>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination count={4} page={1} size="small" disabled />
      </Box>
    </Box>
  );
}
