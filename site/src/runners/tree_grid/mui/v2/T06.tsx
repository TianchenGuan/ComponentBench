'use client';

/**
 * tree_grid-mui-v2-T06: Visual reference in compact lower-left grid – exact deep asset path and apply
 *
 * Reference panel shows "Operations / Data Centers / US-West / Rack 21 / Cooling Unit".
 * MUI tree grid with fixed-height body. Select that row and click "Apply selection".
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Card, CardContent, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Paper, Button, Chip, Stack
} from '@mui/material';
import { KeyboardArrowRight, KeyboardArrowDown } from '@mui/icons-material';
import type { TaskComponentProps, TreeGridRow } from '../../types';
import { SERVICE_CATALOG_DATA, getRowPath, pathEquals } from '../../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  const toggle = (k: string) => setExpanded(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n; });

  const selectedPath = selectedKey ? getRowPath(SERVICE_CATALOG_DATA, selectedKey) : [];

  useEffect(() => {
    if (successFired.current || !saved) return;
    if (pathEquals(selectedPath, ['Operations', 'Data Centers', 'US-West', 'Rack 21', 'Cooling Unit'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, selectedPath, onSuccess]);

  function renderRow(row: TreeGridRow, depth: number) {
    const isExp = expanded.has(row.key);
    const isSel = selectedKey === row.key;
    const hasKids = !!row.children?.length;
    return (
      <React.Fragment key={row.key}>
        <TableRow hover selected={isSel} onClick={() => setSelectedKey(row.key)} sx={{ cursor: 'pointer' }}>
          <TableCell sx={{ pl: depth * 3 + 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {hasKids ? (
                <IconButton size="small" onClick={e => { e.stopPropagation(); toggle(row.key); }}>
                  {isExp ? <KeyboardArrowDown fontSize="small" /> : <KeyboardArrowRight fontSize="small" />}
                </IconButton>
              ) : <Box sx={{ width: 28 }} />}
              <Typography variant="body2">{row.service}</Typography>
            </Box>
          </TableCell>
          <TableCell><Typography variant="body2">{row.owner}</Typography></TableCell>
          <TableCell><Typography variant="body2">{row.status}</Typography></TableCell>
        </TableRow>
        {hasKids && isExp && row.children!.map(c => renderRow(c, depth + 1))}
      </React.Fragment>
    );
  }

  return (
    <Stack spacing={1.5} sx={{ width: 520 }}>
      <Paper variant="outlined" sx={{ p: 1.5 }}>
        <Typography variant="caption" color="text.secondary">Reference path:</Typography>
        <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mt: 0.5 }}>
          {['Operations', 'Data Centers', 'US-West', 'Rack 21', 'Cooling Unit'].map((s, i) => (
            <Chip key={i} label={s} size="small" color="primary" variant="outlined" />
          ))}
        </Stack>
      </Paper>
      <Card>
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>Service Catalog</Typography>
          <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 320, overflow: 'auto' }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 220 }}>Service</TableCell>
                  <TableCell sx={{ width: 120 }}>Owner</TableCell>
                  <TableCell sx={{ width: 80 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{SERVICE_CATALOG_DATA.map(r => renderRow(r, 0))}</TableBody>
            </Table>
          </TableContainer>
          <Button variant="contained" size="small" fullWidth sx={{ mt: 1 }} onClick={() => setSaved(true)}>Apply selection</Button>
        </CardContent>
      </Card>
    </Stack>
  );
}
