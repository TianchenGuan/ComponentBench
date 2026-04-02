'use client';

/**
 * tree_grid-mui-T07: Scroll to find Rack 21 and select Cooling Unit (compact)
 *
 * Layout: isolated card centered.
 * Density: compact spacing mode.
 * Component: MUI composite tree table with fixed-height scrollable container.
 * Hierarchy: Operations → Data Centers → US-West contains many racks.
 * Initial state: top-level nodes collapsed; no selection.
 * Interaction: expand Operations → Data Centers → US-West; scroll to find Rack 21; expand and select Cooling Unit.
 * Feedback: row highlight and breadcrumb line.
 *
 * Success: Selected row path equals Operations → Data Centers → US-West → Rack 21 → Cooling Unit.
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
        sx={{ cursor: 'pointer', '& td': { py: 0.5 } }}
      >
        <TableCell sx={{ pl: depth * 2 + 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
            {hasChildren ? (
              <IconButton
                size="small"
                sx={{ p: 0.25 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleExpand(row.key);
                }}
              >
                {isExpanded ? <KeyboardArrowDown sx={{ fontSize: 16 }} /> : <KeyboardArrowRight sx={{ fontSize: 16 }} />}
              </IconButton>
            ) : (
              <Box sx={{ width: 20 }} />
            )}
            <Typography variant="caption">{row.service}</Typography>
          </Box>
        </TableCell>
        <TableCell><Typography variant="caption">{row.owner}</Typography></TableCell>
        <TableCell><Typography variant="caption">{row.status}</Typography></TableCell>
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

export default function T07({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const successFired = useRef(false);

  const selectedPath = selectedKey ? getRowPath(SERVICE_CATALOG_DATA, selectedKey) : [];

  useEffect(() => {
    if (
      !successFired.current &&
      pathEquals(selectedPath, ['Operations', 'Data Centers', 'US-West', 'Rack 21', 'Cooling Unit'])
    ) {
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
    <Card sx={{ width: 500 }} data-testid="tree-grid-card">
      <CardContent sx={{ p: 1.5 }}>
        <Typography variant="subtitle1" gutterBottom>Service Catalog</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          Select Operations → Data Centers → US-West → Rack 21 → Cooling Unit.
        </Typography>
        
        {selectedKey && (
          <Typography variant="caption" fontWeight="bold" sx={{ mb: 1, display: 'block' }}>
            Selected: {selectedPath.join(' → ')}
          </Typography>
        )}
        
        <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 350 }}>
          <Table size="small" stickyHeader data-testid="tree-grid">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 180, py: 0.5 }}>Service</TableCell>
                <TableCell sx={{ width: 100, py: 0.5 }}>Owner</TableCell>
                <TableCell sx={{ width: 70, py: 0.5 }}>Status</TableCell>
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
