'use client';

/**
 * tree_grid-mui-T04: Select Billing, Payments, and Invoicing (checkboxes)
 *
 * Layout: isolated card centered.
 * Component: MUI composite tree table with checkbox selection.
 * Hierarchy: Finance contains multiple child rows including Billing, Payments, and Invoicing.
 * Initial state: all nodes collapsed; no rows selected.
 * Interaction: expand Finance, then click the checkboxes for the required rows.
 * Feedback: selected count appears; selected rows show checked boxes.
 *
 * Success: Selected row set equals exactly {Finance/Billing, Finance/Payments, Finance/Invoicing}.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Card, CardContent, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Paper, Checkbox, Chip
} from '@mui/material';
import { KeyboardArrowRight, KeyboardArrowDown } from '@mui/icons-material';
import type { TaskComponentProps, TreeGridRow } from '../types';
import { SERVICE_CATALOG_DATA, getRowPath, pathSetsEqual } from '../types';

interface TreeTableRowProps {
  row: TreeGridRow;
  depth: number;
  expandedKeys: Set<string>;
  selectedKeys: Set<string>;
  onToggleExpand: (key: string) => void;
  onToggleSelect: (key: string) => void;
}

function TreeTableRowComponent({ row, depth, expandedKeys, selectedKeys, onToggleExpand, onToggleSelect }: TreeTableRowProps) {
  const isExpanded = expandedKeys.has(row.key);
  const isSelected = selectedKeys.has(row.key);
  const hasChildren = row.children && row.children.length > 0;

  return (
    <>
      <TableRow hover>
        <TableCell padding="checkbox">
          <Checkbox
            checked={isSelected}
            onChange={() => onToggleSelect(row.key)}
            size="small"
          />
        </TableCell>
        <TableCell sx={{ pl: depth * 3 }}>
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
          selectedKeys={selectedKeys}
          onToggleExpand={onToggleExpand}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </>
  );
}

const TARGET_PATHS = [
  ['Finance', 'Billing'],
  ['Finance', 'Payments'],
  ['Finance', 'Invoicing'],
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const successFired = useRef(false);

  const selectedPaths = useMemo(() => {
    return Array.from(selectedKeys).map(key => getRowPath(SERVICE_CATALOG_DATA, key)).filter(p => p.length > 0);
  }, [selectedKeys]);

  useEffect(() => {
    if (!successFired.current && pathSetsEqual(selectedPaths, TARGET_PATHS)) {
      successFired.current = true;
      onSuccess();
    }
  }, [selectedPaths, onSuccess]);

  const toggleExpand = (key: string) => {
    setExpandedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleSelect = (key: string) => {
    setSelectedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <Card sx={{ width: 750 }} data-testid="tree-grid-card">
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Service Catalog</Typography>
          {selectedKeys.size > 0 && (
            <Chip label={`Selected: ${selectedKeys.size}`} size="small" />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Select Finance → Billing, Payments, and Invoicing (exactly these three).
        </Typography>
        
        <TableContainer component={Paper} variant="outlined">
          <Table size="small" data-testid="tree-grid">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" />
                <TableCell sx={{ width: 200 }}>Service</TableCell>
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
                  selectedKeys={selectedKeys}
                  onToggleExpand={toggleExpand}
                  onToggleSelect={toggleSelect}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
