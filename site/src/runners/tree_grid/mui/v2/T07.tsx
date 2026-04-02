'use client';

/**
 * tree_grid-mui-v2-T07: Selected row plus edited SLA cell on the same service row
 *
 * MUI tree grid. Expand Platform, select API Gateway, edit SLA cell to "99.95%",
 * commit edit, click "Save row changes".
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Card, CardContent, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Paper, Button,
  TextField, Stack
} from '@mui/material';
import { KeyboardArrowRight, KeyboardArrowDown } from '@mui/icons-material';
import type { TaskComponentProps } from '../../types';
import { pathEquals } from '../../types';

interface SlaRow {
  key: string; service: string; status: string; sla: string; owner: string;
  children?: SlaRow[];
}

const DATA: SlaRow[] = [
  { key: 'platform', service: 'Platform', status: 'Active', sla: '99.9%', owner: 'Alice',
    children: [
      { key: 'platform/api-gateway', service: 'API Gateway', status: 'Active', sla: '99.5%', owner: 'Bob' },
      { key: 'platform/auth-service', service: 'Auth Service', status: 'Active', sla: '99.9%', owner: 'Carol' },
      { key: 'platform/queues', service: 'Queues', status: 'Active', sla: '99.0%', owner: 'Dan' },
    ],
  },
  { key: 'finance', service: 'Finance', status: 'Active', sla: '99.5%', owner: 'Eve',
    children: [
      { key: 'finance/billing', service: 'Billing', status: 'Active', sla: '99.5%', owner: 'Frank' },
    ],
  },
];

function getPath(rows: SlaRow[], key: string): string[] {
  for (const r of rows) {
    if (r.key === key) return [r.service];
    if (r.children) { const p = getPath(r.children, key); if (p.length) return [r.service, ...p]; }
  }
  return [];
}

function updateSla(rows: SlaRow[], key: string, sla: string): SlaRow[] {
  return rows.map(r => {
    if (r.key === key) return { ...r, sla };
    if (r.children) return { ...r, children: updateSla(r.children, key, sla) };
    return r;
  });
}

function findNode(rows: SlaRow[], key: string): SlaRow | null {
  for (const r of rows) {
    if (r.key === key) return r;
    if (r.children) { const f = findNode(r.children, key); if (f) return f; }
  }
  return null;
}

export default function T07({ onSuccess }: TaskComponentProps) {
  const [data, setData] = useState(DATA);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  const toggle = (k: string) => setExpanded(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n; });

  const commitEdit = useCallback(() => {
    if (editingKey && editValue) {
      setData(prev => updateSla(prev, editingKey, editValue));
    }
    setEditingKey(null);
    setEditValue('');
  }, [editingKey, editValue]);

  const selectedPath = selectedKey ? getPath(data, selectedKey) : [];

  useEffect(() => {
    if (successFired.current || !saved) return;
    const node = findNode(data, 'platform/api-gateway');
    if (
      node && node.sla === '99.95%' &&
      pathEquals(selectedPath, ['Platform', 'API Gateway'])
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, data, selectedPath, onSuccess]);

  function renderRow(row: SlaRow, depth: number) {
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
          <TableCell onDoubleClick={() => { setEditingKey(row.key); setEditValue(row.sla); }}>
            {editingKey === row.key ? (
              <TextField size="small" autoFocus value={editValue} onChange={e => setEditValue(e.target.value)} onBlur={commitEdit} onKeyDown={e => { e.stopPropagation(); if (e.key === 'Enter') commitEdit(); }} onKeyUp={e => e.stopPropagation()} sx={{ width: 90 }} />
            ) : (
              <Typography variant="body2">{row.sla}</Typography>
            )}
          </TableCell>
          <TableCell><Typography variant="body2">{row.owner}</Typography></TableCell>
        </TableRow>
        {hasKids && isExp && row.children!.map(c => renderRow(c, depth + 1))}
      </React.Fragment>
    );
  }

  return (
    <Stack direction="row" spacing={2}>
      <Card sx={{ flex: 1, minWidth: 500 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Service Catalog</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Double-click an SLA cell to edit.</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 200 }}>Service</TableCell>
                  <TableCell sx={{ width: 80 }}>Status</TableCell>
                  <TableCell sx={{ width: 100 }}>SLA</TableCell>
                  <TableCell sx={{ width: 100 }}>Owner</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{data.map(r => renderRow(r, 0))}</TableBody>
            </Table>
          </TableContainer>
          <Button variant="contained" size="small" fullWidth sx={{ mt: 1 }} onClick={() => setSaved(true)}>Save row changes</Button>
        </CardContent>
      </Card>
      <Card sx={{ width: 200, minHeight: 200 }}>
        <CardContent>
          <Typography variant="subtitle2">Details</Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedKey ? `Selected: ${selectedPath.join(' → ')}` : 'Select a row to view details.'}
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}
