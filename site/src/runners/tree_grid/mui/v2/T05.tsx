'use client';

/**
 * tree_grid-mui-v2-T05: Full view reset in grid with quick filter, filters, selection, sort, expansion
 *
 * Initial: quick filter "auth", column filter Status=Active, sort Last updated desc,
 * expanded Platform, selected Platform → Auth Service.
 * Clear all and click "Apply view".
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Card, CardContent, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Paper, Button,
  TextField, Toolbar, Collapse, Stack, FormControl, InputLabel,
  Select, MenuItem, Chip, TableSortLabel
} from '@mui/material';
import { KeyboardArrowRight, KeyboardArrowDown, FilterList, Clear } from '@mui/icons-material';
import type { TaskComponentProps, TreeGridRow } from '../../types';
import { SERVICE_CATALOG_DATA } from '../../types';

function flatRows(rows: TreeGridRow[]): TreeGridRow[] {
  const r: TreeGridRow[] = [];
  for (const row of rows) { r.push(row); if (row.children) r.push(...flatRows(row.children)); }
  return r;
}

function filterTree(rows: TreeGridRow[], text: string, status: string): TreeGridRow[] {
  return rows.reduce<TreeGridRow[]>((acc, row) => {
    const filteredChildren = row.children ? filterTree(row.children, text, status) : undefined;
    const textMatch = !text || row.service.toLowerCase().includes(text.toLowerCase());
    const statusMatch = !status || row.status === status;
    const childMatch = filteredChildren && filteredChildren.length > 0;
    if ((textMatch && statusMatch) || childMatch) {
      acc.push({ ...row, children: filteredChildren });
    }
    return acc;
  }, []);
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const [quickFilter, setQuickFilter] = useState('auth');
  const [statusFilter, setStatusFilter] = useState('Active');
  const [filterOpen, setFilterOpen] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['platform']));
  const [selectedKey, setSelectedKey] = useState<string | null>('platform/auth-service');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [sortActive, setSortActive] = useState(true);
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  const toggle = (k: string) => setExpanded(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n; });

  const displayData = filterTree(SERVICE_CATALOG_DATA, quickFilter, statusFilter);

  useEffect(() => {
    if (successFired.current || !saved) return;
    const clean =
      quickFilter === '' &&
      statusFilter === '' &&
      selectedKey === null &&
      !sortActive &&
      expanded.size === 0;
    if (clean) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, quickFilter, statusFilter, selectedKey, sortActive, expanded, onSuccess]);

  function renderRow(row: TreeGridRow, depth: number) {
    const isExp = expanded.has(row.key);
    const isSel = selectedKey === row.key;
    const hasKids = !!row.children?.length;
    return (
      <React.Fragment key={row.key}>
        <TableRow hover selected={isSel} onClick={() => setSelectedKey(isSel ? null : row.key)} sx={{ cursor: 'pointer' }}>
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
          <TableCell>
            <Typography variant="body2">{row.lastUpdated}</Typography>
          </TableCell>
        </TableRow>
        {hasKids && isExp && row.children!.map(c => renderRow(c, depth + 1))}
      </React.Fragment>
    );
  }

  return (
    <Card sx={{ width: 600 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Service Catalog</Typography>
        <Toolbar variant="dense" disableGutters sx={{ gap: 1, mb: 1, minHeight: 36 }}>
          <TextField
            size="small"
            placeholder="Quick search…"
            value={quickFilter}
            onChange={e => setQuickFilter(e.target.value)}
            InputProps={{
              endAdornment: quickFilter ? (
                <IconButton size="small" onClick={() => setQuickFilter('')}><Clear fontSize="small" /></IconButton>
              ) : null,
            }}
            sx={{ width: 180 }}
          />
          <Button size="small" startIcon={<FilterList />} onClick={() => setFilterOpen(!filterOpen)}>Filters</Button>
        </Toolbar>
        {statusFilter && (
          <Chip label={`Status: ${statusFilter}`} size="small" onDelete={() => setStatusFilter('')} sx={{ mb: 1 }} />
        )}
        <Collapse in={filterOpen}>
          <Paper variant="outlined" sx={{ p: 1.5, mb: 1.5 }}>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={e => setStatusFilter(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Blocked">Blocked</MenuItem>
                <MenuItem value="Paused">Paused</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Collapse>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 220 }}>Service</TableCell>
                <TableCell sx={{ width: 100 }}>Status</TableCell>
                <TableCell sx={{ width: 130 }}>
                  <TableSortLabel
                    active={sortActive}
                    direction={sortDir}
                    onClick={() => {
                      if (sortActive) { setSortActive(false); }
                      else { setSortActive(true); setSortDir('asc'); }
                    }}
                  >
                    Last updated
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{displayData.map(r => renderRow(r, 0))}</TableBody>
          </Table>
        </TableContainer>
        <Button variant="contained" size="small" fullWidth sx={{ mt: 1 }} onClick={() => setSaved(true)}>Apply view</Button>
      </CardContent>
    </Card>
  );
}
