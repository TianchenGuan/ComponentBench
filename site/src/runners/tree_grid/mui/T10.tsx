'use client';

/**
 * tree_grid-mui-T10: Reset grid state (clear quick filter, filters, selection, collapse all)
 *
 * Layout: settings_panel with the grid in the main pane.
 * Component: MUI composite tree table with quick filter TextField and status filter Select.
 * Initial state (non-default):
 *   - Quick Filter text is set to "auth".
 *   - A status filter is active: Status equals Active.
 *   - Expanded nodes: Platform is expanded.
 *   - Selection: "Platform → Auth Service" is selected (row highlight).
 * Interaction: clear Quick Filter, remove the status filter, unselect the row, collapse Platform.
 * Feedback: filter indicators disappear, quick filter field becomes empty, selection highlight removed.
 *
 * Success: Quick filter text is empty, status filter is empty, no rows selected, no nodes expanded.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Paper, TextField,
  InputAdornment, FormControl, InputLabel, Select, MenuItem, Stack
} from '@mui/material';
import { KeyboardArrowRight, KeyboardArrowDown, Search, Clear } from '@mui/icons-material';
import type { TaskComponentProps, TreeGridRow } from '../types';
import { SERVICE_CATALOG_DATA, getRowPath } from '../types';

function rowMatchesSearch(row: TreeGridRow, search: string): boolean {
  const s = search.toLowerCase();
  if (row.service.toLowerCase().includes(s)) return true;
  if (row.children) return row.children.some(c => rowMatchesSearch(c, s));
  return false;
}

function matchesStatusFilter(row: TreeGridRow, statusFilter: string): boolean {
  if (!statusFilter) return true;
  if (row.status === statusFilter) return true;
  if (row.children) return row.children.some(c => matchesStatusFilter(c, statusFilter));
  return false;
}

interface TreeTableRowProps {
  row: TreeGridRow;
  depth: number;
  expandedKeys: Set<string>;
  selectedKey: string | null;
  searchQuery: string;
  statusFilter: string;
  onToggleExpand: (key: string) => void;
  onSelect: (key: string | null) => void;
}

function TreeTableRowComponent({ row, depth, expandedKeys, selectedKey, searchQuery, statusFilter, onToggleExpand, onSelect }: TreeTableRowProps) {
  if (searchQuery && !rowMatchesSearch(row, searchQuery)) return null;
  if (statusFilter && !matchesStatusFilter(row, statusFilter)) return null;

  const isExpanded = expandedKeys.has(row.key);
  const isSelected = selectedKey === row.key;
  const hasChildren = row.children && row.children.length > 0;

  return (
    <>
      <TableRow
        hover
        selected={isSelected}
        onClick={() => onSelect(isSelected ? null : row.key)}
        sx={{ cursor: 'pointer' }}
      >
        <TableCell sx={{ pl: depth * 3 + 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {hasChildren ? (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand(row.key);
                }}
              >
                {isExpanded ? <KeyboardArrowDown fontSize="small" /> : <KeyboardArrowRight fontSize="small" />}
              </IconButton>
            ) : (
              <Box sx={{ width: 28 }} />
            )}
            <Typography variant="body2">{row.service}</Typography>
          </Box>
        </TableCell>
        <TableCell><Typography variant="body2">{row.owner}</Typography></TableCell>
        <TableCell><Typography variant="body2">{row.status}</Typography></TableCell>
        <TableCell><Typography variant="body2">{row.lastUpdated}</Typography></TableCell>
      </TableRow>
      {hasChildren && (isExpanded || searchQuery) && row.children!.map(child => (
        <TreeTableRowComponent
          key={child.key}
          row={child}
          depth={depth + 1}
          expandedKeys={expandedKeys}
          selectedKey={selectedKey}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onToggleExpand={onToggleExpand}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

export default function T10({ onSuccess }: TaskComponentProps) {
  // Initial non-default state
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set(['platform']));
  const [selectedKey, setSelectedKey] = useState<string | null>('platform/auth-service');
  const [searchQuery, setSearchQuery] = useState('auth');
  const [statusFilter, setStatusFilter] = useState('Active');
  const successFired = useRef(false);

  useEffect(() => {
    const isReset =
      searchQuery.trim() === '' &&
      statusFilter === '' &&
      !selectedKey &&
      expandedKeys.size === 0;

    if (!successFired.current && isReset) {
      successFired.current = true;
      onSuccess();
    }
  }, [searchQuery, statusFilter, selectedKey, expandedKeys, onSuccess]);

  const toggleExpand = (key: string) => {
    setExpandedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        Array.from(next).forEach(k => {
          if (k === key || k.startsWith(key + '/')) next.delete(k);
        });
        if (selectedKey && selectedKey.startsWith(key + '/')) {
          setSelectedKey(null);
        }
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const selectedPath = selectedKey ? getRowPath(SERVICE_CATALOG_DATA, selectedKey) : [];

  return (
    <Paper sx={{ p: 3, maxWidth: 750 }}>
      <Typography variant="h6" gutterBottom>Settings</Typography>
      <Card data-testid="tree-grid-card">
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>Service Catalog</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Reset the Service Catalog grid to default (no filters, no quick search, no selection, all collapsed).
          </Typography>
          
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <TextField
              size="small"
              placeholder="Quick filter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ width: 200 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery('')}>
                      <Clear fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Paused">Paused</MenuItem>
                <MenuItem value="Blocked">Blocked</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {selectedKey && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              Selected: {selectedPath.join(' → ')}
            </Typography>
          )}
          
          <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 350 }}>
            <Table size="small" stickyHeader data-testid="tree-grid">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 200 }}>Service</TableCell>
                  <TableCell sx={{ width: 130 }}>Owner</TableCell>
                  <TableCell sx={{ width: 100 }}>Status</TableCell>
                  <TableCell sx={{ width: 110 }}>Last updated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {SERVICE_CATALOG_DATA.map(row => (
                  <TreeTableRowComponent
                    key={row.key}
                    row={row}
                    depth={0}
                    expandedKeys={expandedKeys}
                    selectedKey={selectedKey}
                    searchQuery={searchQuery}
                    statusFilter={statusFilter}
                    onToggleExpand={toggleExpand}
                    onSelect={setSelectedKey}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Paper>
  );
}
