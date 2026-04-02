'use client';

/**
 * tree_grid-mui-T05: Filter Status to Blocked using filter panel
 *
 * Layout: settings_panel.
 * Component: MUI composite tree table with a Select dropdown for status filter.
 * Initial state: no filters; nodes collapsed; no selection.
 * Interaction: select "Blocked" from the status filter dropdown.
 * Feedback: filtered rows shown.
 *
 * Success: The grid filter model contains exactly one filter: Status equals Blocked.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Paper,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { KeyboardArrowRight, KeyboardArrowDown } from '@mui/icons-material';
import type { TaskComponentProps, TreeGridRow } from '../types';
import { SERVICE_CATALOG_DATA } from '../types';

interface TreeTableRowProps {
  row: TreeGridRow;
  depth: number;
  expandedKeys: Set<string>;
  statusFilter: string;
  onToggleExpand: (key: string) => void;
}

function matchesFilter(row: TreeGridRow, statusFilter: string): boolean {
  if (!statusFilter) return true;
  if (row.status === statusFilter) return true;
  if (row.children) return row.children.some(c => matchesFilter(c, statusFilter));
  return false;
}

function TreeTableRowComponent({ row, depth, expandedKeys, statusFilter, onToggleExpand }: TreeTableRowProps) {
  if (statusFilter && !matchesFilter(row, statusFilter)) return null;

  const isExpanded = expandedKeys.has(row.key);
  const hasChildren = row.children && row.children.length > 0;
  const showRow = !statusFilter || row.status === statusFilter || hasChildren;

  if (!showRow && !hasChildren) return null;

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ pl: depth * 3 + 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {hasChildren ? (
              <IconButton size="small" onClick={() => onToggleExpand(row.key)}>
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
      {hasChildren && isExpanded && row.children!.map(child => (
        <TreeTableRowComponent
          key={child.key}
          row={child}
          depth={depth + 1}
          expandedKeys={expandedKeys}
          statusFilter={statusFilter}
          onToggleExpand={onToggleExpand}
        />
      ))}
    </>
  );
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState('');
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && statusFilter === 'Blocked') {
      successFired.current = true;
      onSuccess();
    }
  }, [statusFilter, onSuccess]);

  const toggleExpand = (key: string) => {
    setExpandedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 800 }}>
      <Typography variant="h6" gutterBottom>Settings</Typography>
      <Card data-testid="tree-grid-card">
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>Service Catalog</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Apply filter: Status = Blocked.
          </Typography>
          
          <FormControl size="small" sx={{ mb: 2, minWidth: 150 }}>
            <InputLabel>Status Filter</InputLabel>
            <Select
              value={statusFilter}
              label="Status Filter"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Paused">Paused</MenuItem>
              <MenuItem value="Blocked">Blocked</MenuItem>
            </Select>
          </FormControl>
          
          <TableContainer component={Paper} variant="outlined">
            <Table size="small" data-testid="tree-grid">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 220 }}>Service</TableCell>
                  <TableCell sx={{ width: 150 }}>Owner</TableCell>
                  <TableCell sx={{ width: 100 }}>Status</TableCell>
                  <TableCell sx={{ width: 120 }}>Last updated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {SERVICE_CATALOG_DATA.map(row => (
                  <TreeTableRowComponent
                    key={row.key}
                    row={row}
                    depth={0}
                    expandedKeys={expandedKeys}
                    statusFilter={statusFilter}
                    onToggleExpand={toggleExpand}
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
