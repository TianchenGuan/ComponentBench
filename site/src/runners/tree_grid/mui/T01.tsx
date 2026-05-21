'use client';

/**
 * tree_grid-mui-T01: Select API Gateway row (MUI DataGridPro)
 *
 * Layout: isolated card centered.
 * Component: MUI composite tree table using Table with custom expand/collapse.
 * Columns: Service, Owner, Status, Last updated.
 * Initial state: all top-level nodes collapsed; no row selected.
 * Interaction: expand Platform using the chevron; select a row by clicking anywhere on the row.
 * Feedback: selected row is highlighted and the status line above the grid shows "Selected: <path>".
 *
 * Success: The selected row path equals Platform → API Gateway.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Paper
} from '@mui/material';
import { KeyboardArrowRight, KeyboardArrowDown } from '@mui/icons-material';
import type { TaskComponentProps, TreeGridRow } from '../types';
import { SERVICE_CATALOG_DATA, getRowPath, pathEquals } from '../types';

interface TreeTableRowProps {
  row: TreeGridRow;
  depth: number;
  expandedKeys: Set<string>;
  selectedKey: string | null;
  onToggleExpand: (key: string) => void;
  onSelect: (key: string) => void;
}

function TreeTableRowComponent({ row, depth, expandedKeys, selectedKey, onToggleExpand, onSelect }: TreeTableRowProps) {
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
        data-row-path={getRowPath(SERVICE_CATALOG_DATA, row.key).join('/')}
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
      {hasChildren && isExpanded && row.children!.map(child => (
        <TreeTableRowComponent
          key={child.key}
          row={child}
          depth={depth + 1}
          expandedKeys={expandedKeys}
          selectedKey={selectedKey}
          onToggleExpand={onToggleExpand}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

export default function T01({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const successFired = useRef(false);

  const selectedPath = selectedKey ? getRowPath(SERVICE_CATALOG_DATA, selectedKey) : [];

  useEffect(() => {
    if (!successFired.current && pathEquals(selectedPath, ['Platform', 'API Gateway'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [selectedPath, onSuccess]);

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
          Select "API Gateway" (under Platform) in the Service Catalog grid.
        </Typography>
        
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
