'use client';

/**
 * tree_grid-mui-T02: Expand Finance only (MUI tree data)
 *
 * Layout: isolated card centered.
 * Component: MUI composite tree table.
 * Interaction: each parent node has an expand/collapse chevron.
 * Initial state: all top-level nodes collapsed; no selection; no filters.
 * Feedback: when Finance is expanded, its child rows appear indented beneath it.
 *
 * Success: Expanded node set is exactly {Finance} at the top level.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Paper
} from '@mui/material';
import { KeyboardArrowRight, KeyboardArrowDown } from '@mui/icons-material';
import type { TaskComponentProps, TreeGridRow } from '../types';
import { SERVICE_CATALOG_DATA, setsEqual } from '../types';

interface TreeTableRowProps {
  row: TreeGridRow;
  depth: number;
  expandedKeys: Set<string>;
  onToggleExpand: (key: string) => void;
}

function TreeTableRowComponent({ row, depth, expandedKeys, onToggleExpand }: TreeTableRowProps) {
  const isExpanded = expandedKeys.has(row.key);
  const hasChildren = row.children && row.children.length > 0;

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
          onToggleExpand={onToggleExpand}
        />
      ))}
    </>
  );
}

const TOP_LEVEL_KEYS = ['platform', 'finance', 'marketing', 'operations', 'people'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const successFired = useRef(false);

  const expandedTopLevel = Array.from(expandedKeys).filter(k => TOP_LEVEL_KEYS.includes(k));

  useEffect(() => {
    if (!successFired.current && setsEqual(expandedTopLevel, ['finance'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [expandedTopLevel, onSuccess]);

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
          Expand Finance only in the Service Catalog grid.
        </Typography>
        
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
                  onToggleExpand={toggleExpand}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
