'use client';

/**
 * tree_grid-mui-T08: Production grid: select two Platform services (instances=2)
 *
 * Layout: dashboard with two equal-width panels.
 * Left panel: "Staging Environment" tree grid. Right panel: "Production Environment" tree grid.
 * Instances: 2 grids with identical hierarchy; each has its own selection model.
 * Interaction: checkboxSelection is enabled in both grids.
 * Initial state: Staging has one row pre-selected ("Finance → Billing").
 * Production has no selection; all nodes collapsed.
 * Clutter: medium—KPI strip above and notifications card below.
 * Feedback: each grid shows its own selected count.
 *
 * Success: In the Production Environment grid, the selected row set equals exactly
 * {Platform/API Gateway, Platform/Auth Service}.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Card, CardContent, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Paper, Grid, Checkbox, Chip, Stack
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
      <TableRow hover sx={{ '& td': { py: 0.5 } }}>
        <TableCell padding="checkbox">
          <Checkbox checked={isSelected} onChange={() => onToggleSelect(row.key)} size="small" />
        </TableCell>
        <TableCell sx={{ pl: depth * 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
            {hasChildren ? (
              <IconButton size="small" sx={{ p: 0.25 }} onClick={() => onToggleExpand(row.key)}>
                {isExpanded ? <KeyboardArrowDown sx={{ fontSize: 16 }} /> : <KeyboardArrowRight sx={{ fontSize: 16 }} />}
              </IconButton>
            ) : (
              <Box sx={{ width: 20 }} />
            )}
            <Typography variant="caption">{row.service}</Typography>
          </Box>
        </TableCell>
        <TableCell><Typography variant="caption">{row.status}</Typography></TableCell>
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
  ['Platform', 'API Gateway'],
  ['Platform', 'Auth Service'],
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [stagingExpanded, setStagingExpanded] = useState<Set<string>>(new Set(['finance']));
  const [stagingSelected, setStagingSelected] = useState<Set<string>>(new Set(['finance/billing']));
  const [productionExpanded, setProductionExpanded] = useState<Set<string>>(new Set());
  const [productionSelected, setProductionSelected] = useState<Set<string>>(new Set());
  const successFired = useRef(false);

  const productionPaths = useMemo(() => {
    return Array.from(productionSelected).map(key => getRowPath(SERVICE_CATALOG_DATA, key)).filter(p => p.length > 0);
  }, [productionSelected]);

  useEffect(() => {
    if (!successFired.current && pathSetsEqual(productionPaths, TARGET_PATHS)) {
      successFired.current = true;
      onSuccess();
    }
  }, [productionPaths, onSuccess]);

  const createToggle = (setter: React.Dispatch<React.SetStateAction<Set<string>>>) => (key: string) => {
    setter(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={3}>
          <Box>
            <Typography variant="caption" color="text.secondary">Active Services</Typography>
            <Typography variant="h6">42</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">Deployments Today</Typography>
            <Typography variant="h6">7</Typography>
          </Box>
          <Chip label="2 Warning" size="small" color="warning" />
        </Stack>
      </Paper>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Production Environment: select Platform → API Gateway and Platform → Auth Service (exactly two).
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Card data-instance="Staging Environment">
            <CardContent sx={{ p: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2">Staging Environment</Typography>
                <Chip label={stagingSelected.size} size="small" />
              </Box>
              <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 280 }}>
                <Table size="small" stickyHeader data-testid="staging-tree-grid">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox" />
                      <TableCell sx={{ py: 0.5 }}>Service</TableCell>
                      <TableCell sx={{ py: 0.5 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {SERVICE_CATALOG_DATA.map(row => (
                      <TreeTableRowComponent
                        key={row.key}
                        row={row}
                        depth={0}
                        expandedKeys={stagingExpanded}
                        selectedKeys={stagingSelected}
                        onToggleExpand={createToggle(setStagingExpanded)}
                        onToggleSelect={createToggle(setStagingSelected)}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6}>
          <Card data-instance="Production Environment">
            <CardContent sx={{ p: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2">Production Environment</Typography>
                <Chip label={productionSelected.size} size="small" />
              </Box>
              <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 280 }}>
                <Table size="small" stickyHeader data-testid="production-tree-grid">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox" />
                      <TableCell sx={{ py: 0.5 }}>Service</TableCell>
                      <TableCell sx={{ py: 0.5 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {SERVICE_CATALOG_DATA.map(row => (
                      <TreeTableRowComponent
                        key={row.key}
                        row={row}
                        depth={0}
                        expandedKeys={productionExpanded}
                        selectedKeys={productionSelected}
                        onToggleExpand={createToggle(setProductionExpanded)}
                        onToggleSelect={createToggle(setProductionSelected)}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="subtitle2">Recent Notifications</Typography>
        <Typography variant="body2" color="text.secondary">No new notifications.</Typography>
      </Paper>
    </Box>
  );
}
