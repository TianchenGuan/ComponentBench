'use client';

/**
 * tree_grid-mui-v2-T03: Filter panel plus target leaf in compact lower-corner grid
 *
 * MUI tree grid with toolbar "Filters" button. Open filter panel, set Status = Blocked,
 * select Finance → Invoicing, click "Use row".
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Paper, Button,
  Toolbar, Select, MenuItem, FormControl, InputLabel, Stack, Collapse
} from '@mui/material';
import { KeyboardArrowRight, KeyboardArrowDown, FilterList } from '@mui/icons-material';
import type { TaskComponentProps } from '../../types';
import { pathEquals } from '../../types';

interface CatalogRow {
  key: string; service: string; status: string; owner: string;
  children?: CatalogRow[];
}

const DATA: CatalogRow[] = [
  { key: 'finance', service: 'Finance', status: 'Active', owner: 'Eve',
    children: [
      { key: 'finance/billing', service: 'Billing', status: 'Active', owner: 'Frank' },
      { key: 'finance/invoicing', service: 'Invoicing', status: 'Blocked', owner: 'Grace' },
    ],
  },
  { key: 'platform', service: 'Platform', status: 'Active', owner: 'Alice',
    children: [
      { key: 'platform/api-gateway', service: 'API Gateway', status: 'Active', owner: 'Bob' },
      { key: 'platform/auth-service', service: 'Auth Service', status: 'Blocked', owner: 'Carol' },
    ],
  },
];

function getPath(rows: CatalogRow[], key: string): string[] {
  for (const r of rows) {
    if (r.key === key) return [r.service];
    if (r.children) { const p = getPath(r.children, key); if (p.length) return [r.service, ...p]; }
  }
  return [];
}

function filterTree(rows: CatalogRow[], statusFilter: string): CatalogRow[] {
  if (!statusFilter) return rows;
  const result: CatalogRow[] = [];
  for (const row of rows) {
    if (row.children) {
      const filteredChildren = filterTree(row.children, statusFilter);
      if (filteredChildren.length > 0 || row.status === statusFilter) {
        result.push({ ...row, children: filteredChildren });
      }
    } else if (row.status === statusFilter) {
      result.push(row);
    }
  }
  return result;
}

export default function T03({ onSuccess }: TaskComponentProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  const toggle = (k: string) => setExpanded(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n; });

  const displayData = filterTree(DATA, statusFilter);
  const selectedPath = selectedKey ? getPath(DATA, selectedKey) : [];

  useEffect(() => {
    if (successFired.current || !saved) return;
    if (statusFilter === 'Blocked' && pathEquals(selectedPath, ['Finance', 'Invoicing'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, statusFilter, selectedPath, onSuccess]);

  function renderRow(row: CatalogRow, depth: number) {
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
          <TableCell><Typography variant="body2">{row.status}</Typography></TableCell>
          <TableCell><Typography variant="body2">{row.owner}</Typography></TableCell>
        </TableRow>
        {hasKids && isExp && row.children!.map(c => renderRow(c, depth + 1))}
      </React.Fragment>
    );
  }

  return (
    <Card sx={{ width: 520 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Service Catalog</Typography>
        <Toolbar variant="dense" disableGutters sx={{ mb: 1, minHeight: 36 }}>
          <Button size="small" startIcon={<FilterList />} onClick={() => setFilterOpen(!filterOpen)}>Filters</Button>
        </Toolbar>
        <Collapse in={filterOpen}>
          <Paper variant="outlined" sx={{ p: 1.5, mb: 1.5 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} label="Status" onChange={e => setStatusFilter(e.target.value)}>
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Blocked">Blocked</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Paper>
        </Collapse>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 200 }}>Service</TableCell>
                <TableCell sx={{ width: 100 }}>Status</TableCell>
                <TableCell sx={{ width: 120 }}>Owner</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{displayData.map(r => renderRow(r, 0))}</TableBody>
          </Table>
        </TableContainer>
        <Button variant="contained" size="small" fullWidth sx={{ mt: 1 }} onClick={() => setSaved(true)}>Use row</Button>
      </CardContent>
    </Card>
  );
}
