'use client';

/**
 * tree_grid-mui-T06: Match reference and select Onboarding row
 *
 * Layout: isolated card anchored near the top-left of the viewport.
 * Component: MUI composite tree table.
 * Guidance: a reference box above the grid shows the target path.
 * Initial state: People node collapsed; no selection.
 * Interaction: expand People, then expand HR, then click the Onboarding row.
 * Feedback: selected row highlight; a 'Selected' breadcrumb line below the reference updates.
 *
 * Success: The selected row path equals People → HR → Onboarding.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Paper, Stack
} from '@mui/material';
import { KeyboardArrowRight, KeyboardArrowDown, Folder, Description } from '@mui/icons-material';
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

export default function T06({ onSuccess }: TaskComponentProps) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const successFired = useRef(false);

  const selectedPath = selectedKey ? getRowPath(SERVICE_CATALOG_DATA, selectedKey) : [];

  useEffect(() => {
    if (!successFired.current && pathEquals(selectedPath, ['People', 'HR', 'Onboarding'])) {
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
    <Stack spacing={2}>
      {/* Reference Panel */}
      <Paper sx={{ p: 2, maxWidth: 600 }} data-reference-id="ref-path-hr-onboarding">
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Reference Preview
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Target path: <strong>People / HR / Onboarding</strong>
        </Typography>
        <Box sx={{ p: 1, bgcolor: '#fffde7', border: '1px solid #ffc107', borderRadius: 1, fontSize: 12 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Folder fontSize="small" />
            <Typography variant="caption">People</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pl: 2 }}>
            <Folder fontSize="small" />
            <Typography variant="caption">HR</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pl: 4, bgcolor: '#fff59d', px: 1, py: 0.5, borderRadius: 0.5 }}>
            <Description fontSize="small" />
            <Typography variant="caption" fontWeight="bold">Onboarding ←</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Main Grid */}
      <Card sx={{ width: 600 }} data-testid="tree-grid-card">
        <CardContent>
          <Typography variant="h6" gutterBottom>Service Catalog</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Reference target: select People → HR → Onboarding.
          </Typography>
          
          {selectedKey && (
            <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
              Selected: {selectedPath.join(' → ')}
            </Typography>
          )}
          
          <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 350 }}>
            <Table size="small" stickyHeader data-testid="tree-grid">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 200 }}>Service</TableCell>
                  <TableCell sx={{ width: 130 }}>Owner</TableCell>
                  <TableCell sx={{ width: 80 }}>Status</TableCell>
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
    </Stack>
  );
}
