'use client';

/**
 * tree_grid-mui-T03: Quick filter then select Invoicing
 *
 * Layout: isolated card centered.
 * Component: MUI composite tree table with a TextField for quick filter.
 * Initial state: no quick filter text; all nodes collapsed; no selection.
 * Interaction: type in the filter field; expand Finance if needed; click Invoicing.
 * Feedback: filtered rows shown; selected row highlights.
 *
 * Success: The grid quick filter text equals "invoice" and the selected row path equals Finance → Invoicing.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Card, CardContent, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Paper, TextField, InputAdornment
} from '@mui/material';
import { KeyboardArrowRight, KeyboardArrowDown, Search } from '@mui/icons-material';
import type { TaskComponentProps, TreeGridRow } from '../types';
import { SERVICE_CATALOG_DATA, getRowPath, pathEquals } from '../types';

function rowMatchesSearch(row: TreeGridRow, search: string): boolean {
  const s = search.toLowerCase();
  if (row.service.toLowerCase().includes(s)) return true;
  if (row.children) return row.children.some(c => rowMatchesSearch(c, s));
  return false;
}

interface TreeTableRowProps {
  row: TreeGridRow;
  depth: number;
  expandedKeys: Set<string>;
  selectedKey: string | null;
  searchQuery: string;
  onToggleExpand: (key: string) => void;
  onSelect: (key: string) => void;
}

function TreeTableRowComponent({ row, depth, expandedKeys, selectedKey, searchQuery, onToggleExpand, onSelect }: TreeTableRowProps) {
  if (searchQuery && !rowMatchesSearch(row, searchQuery)) return null;

  const isExpanded = expandedKeys.has(row.key);
  const isSelected = selectedKey === row.key;
  const hasChildren = row.children && row.children.length > 0;

  return (
    <>
      <TableRow
        hover
        selected={isSelected}
        onClick={() => onSelect(row.key)}
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
          onToggleExpand={onToggleExpand}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

export default function T03({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const successFired = useRef(false);

  const selectedPath = selectedKey ? getRowPath(SERVICE_CATALOG_DATA, selectedKey) : [];

  useEffect(() => {
    const normalizedFilter = searchQuery.toLowerCase().trim();
    if (
      !successFired.current &&
      normalizedFilter.includes('invoic') &&
      pathEquals(selectedPath, ['Finance', 'Invoicing'])
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [searchQuery, selectedPath, onSuccess]);

  const toggleExpand = (key: string) => {
    setExpandedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <Card sx={{ width: 700 }} data-testid="tree-grid-card">
      <CardContent>
        <Typography variant="h6" gutterBottom>Service Catalog</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Quick search "invoic", then select "Finance → Invoicing".
        </Typography>
        
        <TextField
          size="small"
          placeholder="Quick filter..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2, width: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        {selectedKey && (
          <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
            Selected: {selectedPath.join(' → ')}
          </Typography>
        )}
        
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
                  selectedKey={selectedKey}
                  searchQuery={searchQuery}
                  onToggleExpand={toggleExpand}
                  onSelect={setSelectedKey}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
