'use client';

/**
 * tree_grid-mui-v2-T04: Server-side tree data drawer – expand lazy branch and attach Contract 2027
 *
 * "Attach record" opens drawer. Tree grid: Customers → Enterprise (lazy-loads children).
 * Wait for lazy load, select Contract 2027, click "Attach record" in drawer footer.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Paper, Button,
  Drawer, CircularProgress, Stack
} from '@mui/material';
import { KeyboardArrowRight, KeyboardArrowDown } from '@mui/icons-material';
import type { TaskComponentProps } from '../../types';
import { pathEquals } from '../../types';

interface TreeNode {
  key: string; name: string; children?: TreeNode[];
  loading?: boolean;
}

const ENTERPRISE_CHILDREN: TreeNode[] = [
  { key: 'customers/enterprise/contract-2026', name: 'Contract 2026' },
  { key: 'customers/enterprise/contract-2027', name: 'Contract 2027' },
  { key: 'customers/enterprise/notes', name: 'Notes' },
];

function makeInitialData(): TreeNode[] {
  return [{
    key: 'customers', name: 'Customers',
    children: [
      { key: 'customers/enterprise', name: 'Enterprise', children: [] },
      { key: 'customers/smb', name: 'SMB' },
    ],
  }];
}

function getPath(rows: TreeNode[], key: string): string[] {
  for (const r of rows) {
    if (r.key === key) return [r.name];
    if (r.children) { const p = getPath(r.children, key); if (p.length) return [r.name, ...p]; }
  }
  return [];
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [data, setData] = useState(makeInitialData);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  const toggle = (k: string) => {
    if (expanded.has(k)) {
      setExpanded(prev => { const n = new Set(prev); n.delete(k); return n; });
      return;
    }
    setExpanded(prev => { const n = new Set(prev); n.add(k); return n; });
    if (k === 'customers/enterprise') {
      const node = data[0]?.children?.find(c => c.key === k);
      if (node && (!node.children || node.children.length === 0)) {
        setLoading(prev => new Set(prev).add(k));
        setTimeout(() => {
          setData(prev => prev.map(root => ({
            ...root,
            children: root.children?.map(c =>
              c.key === k ? { ...c, children: ENTERPRISE_CHILDREN } : c
            ),
          })));
          setLoading(prev => { const n = new Set(prev); n.delete(k); return n; });
        }, 800);
      }
    }
  };

  const selectedPath = selectedKey ? getPath(data, selectedKey) : [];

  useEffect(() => {
    if (successFired.current || !saved) return;
    if (pathEquals(selectedPath, ['Customers', 'Enterprise', 'Contract 2027'])) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, selectedPath, onSuccess]);

  function renderRow(row: TreeNode, depth: number) {
    const isExp = expanded.has(row.key);
    const isLoading = loading.has(row.key);
    const isSel = selectedKey === row.key;
    const hasKids = row.children !== undefined;
    return (
      <React.Fragment key={row.key}>
        <TableRow hover selected={isSel} onClick={() => setSelectedKey(row.key)} sx={{ cursor: 'pointer' }}>
          <TableCell sx={{ pl: depth * 3 + 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {hasKids ? (
                <IconButton size="small" onClick={e => { e.stopPropagation(); toggle(row.key); }}>
                  {isExp ? <KeyboardArrowDown fontSize="small" /> : <KeyboardArrowRight fontSize="small" />}
                </IconButton>
              ) : <Box sx={{ width: 28 }} />}
              <Typography variant="body2">{row.name}</Typography>
              {isLoading && <CircularProgress size={14} sx={{ ml: 1 }} />}
            </Box>
          </TableCell>
        </TableRow>
        {hasKids && isExp && row.children!.map(c => renderRow(c, depth + 1))}
      </React.Fragment>
    );
  }

  return (
    <>
      <Card sx={{ width: 420 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>CRM Dashboard</Typography>
          <Stack spacing={1}>
            <Paper variant="outlined" sx={{ p: 1 }}><Typography variant="body2" color="text.secondary">Total accounts: 24</Typography></Paper>
            <Paper variant="outlined" sx={{ p: 1 }}><Typography variant="body2" color="text.secondary">Active contracts: 18</Typography></Paper>
          </Stack>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => setDrawerOpen(true)}>Attach record</Button>
        </CardContent>
      </Card>
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 400, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6">Attach record</Typography>
          </Box>
          <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead><TableRow><TableCell>Record</TableCell></TableRow></TableHead>
                <TableBody>{data.map(r => renderRow(r, 0))}</TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button variant="contained" fullWidth onClick={() => setSaved(true)}>Attach record</Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
