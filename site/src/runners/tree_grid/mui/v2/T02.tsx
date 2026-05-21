'use client';

/**
 * tree_grid-mui-v2-T02: Quota edit with confirm-save dialog on the selected row
 *
 * MUI tree grid. Expand Platform, select API Gateway, double-click Quota cell to edit to "2,048",
 * commit edit triggers confirm dialog ("Save" / "Discard"). Click Save.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Card, CardContent, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Paper, Button,
  Dialog, DialogTitle, DialogActions, TextField, Stack
} from '@mui/material';
import { KeyboardArrowRight, KeyboardArrowDown } from '@mui/icons-material';
import type { TaskComponentProps } from '../../types';
import { pathEquals, formatGroupedNumber } from '../../types';

interface CatalogRow {
  key: string; service: string; status: string; quota: number; owner: string;
  children?: CatalogRow[];
}

const DATA: CatalogRow[] = [
  { key: 'platform', service: 'Platform', status: 'Active', quota: 10000, owner: 'Alice',
    children: [
      { key: 'platform/api-gateway', service: 'API Gateway', status: 'Active', quota: 1024, owner: 'Bob' },
      { key: 'platform/auth-service', service: 'Auth Service', status: 'Active', quota: 512, owner: 'Carol' },
    ],
  },
  { key: 'finance', service: 'Finance', status: 'Active', quota: 5000, owner: 'Eve',
    children: [
      { key: 'finance/billing', service: 'Billing', status: 'Active', quota: 2000, owner: 'Frank' },
    ],
  },
];

function getPath(rows: CatalogRow[], key: string): string[] {
  for (const r of rows) {
    if (r.key === key) return [r.service];
    if (r.children) { const p = getPath(r.children, key); if (p.length) return [r.service, ...p]; }
  }
  return [];
}

function updateQuota(rows: CatalogRow[], key: string, quota: number): CatalogRow[] {
  return rows.map(r => {
    if (r.key === key) return { ...r, quota };
    if (r.children) return { ...r, children: updateQuota(r.children, key, quota) };
    return r;
  });
}

export default function T02({ onSuccess }: TaskComponentProps) {
  const [data, setData] = useState(DATA);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingEdit, setPendingEdit] = useState<{ key: string; value: number } | null>(null);
  const successFired = useRef(false);

  const toggle = (k: string) => setExpanded(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n; });

  const commitEdit = useCallback(() => {
    if (!editingKey) return;
    const parsed = parseInt(editValue.replace(/,/g, ''), 10);
    if (!isNaN(parsed)) {
      setPendingEdit({ key: editingKey, value: parsed });
      setDialogOpen(true);
    }
    setEditingKey(null);
    setEditValue('');
  }, [editingKey, editValue]);

  const handleSave = () => {
    if (pendingEdit) {
      setData(prev => updateQuota(prev, pendingEdit.key, pendingEdit.value));
    }
    setDialogOpen(false);
    setPendingEdit(null);
  };

  const handleDiscard = () => {
    setDialogOpen(false);
    setPendingEdit(null);
  };

  useEffect(() => {
    if (successFired.current) return;
    const node = data.flatMap(r => r.children || []).find(r => r.key === 'platform/api-gateway');
    const selPath = selectedKey ? getPath(data, selectedKey) : [];
    if (node && node.quota === 2048 && pathEquals(selPath, ['Platform', 'API Gateway']) && !dialogOpen) {
      successFired.current = true;
      onSuccess();
    }
  }, [data, selectedKey, dialogOpen, onSuccess]);

  function renderRow(row: CatalogRow, depth: number) {
    const isExp = expanded.has(row.key);
    const isSel = selectedKey === row.key;
    const hasKids = !!row.children?.length;
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
              <Typography variant="body2">{row.service}</Typography>
            </Box>
          </TableCell>
          <TableCell><Typography variant="body2">{row.status}</Typography></TableCell>
          <TableCell onDoubleClick={() => { setEditingKey(row.key); setEditValue(formatGroupedNumber(row.quota)); }}>
            {editingKey === row.key ? (
              <TextField size="small" autoFocus value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={commitEdit} onKeyDown={e => { e.stopPropagation(); if (e.key === 'Enter') commitEdit(); }} onKeyUp={e => e.stopPropagation()} sx={{ width: 100 }} />
            ) : (
              <Typography variant="body2">{formatGroupedNumber(row.quota)}</Typography>
            )}
          </TableCell>
          <TableCell><Typography variant="body2">{row.owner}</Typography></TableCell>
        </TableRow>
        {hasKids && isExp && row.children!.map(c => renderRow(c, depth + 1))}
      </React.Fragment>
    );
  }

  return (
    <>
      <Card sx={{ width: 650 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Service Catalog</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Double-click a Quota cell to edit.</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 200 }}>Service</TableCell>
                  <TableCell sx={{ width: 100 }}>Status</TableCell>
                  <TableCell sx={{ width: 120 }}>Quota</TableCell>
                  <TableCell sx={{ width: 120 }}>Owner</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{data.map(r => renderRow(r, 0))}</TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      <Dialog open={dialogOpen} onClose={handleDiscard}>
        <DialogTitle>Save row changes?</DialogTitle>
        <DialogActions>
          <Button onClick={handleDiscard}>Discard</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
