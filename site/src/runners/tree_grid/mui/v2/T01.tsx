'use client';

/**
 * tree_grid-mui-v2-T01: Production grid only – exact selected services with local apply
 *
 * Two side-by-side MUI tree grids: "Production environment" and "Staging environment".
 * Select Platform/API Gateway and Platform/Auth Service in Production, click "Apply environment".
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Paper, Button, Checkbox, Stack
} from '@mui/material';
import { KeyboardArrowRight, KeyboardArrowDown } from '@mui/icons-material';
import type { TaskComponentProps } from '../../types';
import { pathSetsEqual } from '../../types';

interface GridNode { key: string; name: string; children?: GridNode[]; }

const DATA: GridNode[] = [
  { key: 'platform', name: 'Platform', children: [
    { key: 'platform/api-gateway', name: 'API Gateway' },
    { key: 'platform/auth-service', name: 'Auth Service' },
    { key: 'platform/queues', name: 'Queues' },
  ]},
  { key: 'finance', name: 'Finance', children: [
    { key: 'finance/billing', name: 'Billing' },
  ]},
];

function getPath(rows: GridNode[], key: string): string[] {
  for (const r of rows) {
    if (r.key === key) return [r.name];
    if (r.children) { const p = getPath(r.children, key); if (p.length) return [r.name, ...p]; }
  }
  return [];
}

function TreeRow({ row, depth, expanded, checked, onToggle, onCheck }: {
  row: GridNode; depth: number; expanded: Set<string>; checked: Set<string>;
  onToggle: (k: string) => void; onCheck: (k: string) => void;
}) {
  const isExpanded = expanded.has(row.key);
  const hasChildren = !!row.children?.length;
  return (
    <>
      <TableRow hover>
        <TableCell sx={{ pl: depth * 3 + 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {hasChildren ? (
              <IconButton size="small" onClick={() => onToggle(row.key)}>
                {isExpanded ? <KeyboardArrowDown fontSize="small" /> : <KeyboardArrowRight fontSize="small" />}
              </IconButton>
            ) : <Box sx={{ width: 28 }} />}
            <Checkbox size="small" checked={checked.has(row.key)} onChange={() => onCheck(row.key)} />
            <Typography variant="body2">{row.name}</Typography>
          </Box>
        </TableCell>
      </TableRow>
      {hasChildren && isExpanded && row.children!.map(c => (
        <TreeRow key={c.key} row={c} depth={depth + 1} expanded={expanded} checked={checked} onToggle={onToggle} onCheck={onCheck} />
      ))}
    </>
  );
}

function EnvGrid({ title, checked, onCheckedChange, footer }: {
  title: string;
  checked: Set<string>;
  onCheckedChange: (s: Set<string>) => void;
  footer?: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const toggle = (k: string) => setExpanded(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n; });
  const check = (k: string) => onCheckedChange((() => { const n = new Set(checked); n.has(k) ? n.delete(k) : n.add(k); return n; })());

  return (
    <Card sx={{ flex: 1, minWidth: 280 }}>
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>{title}</Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead><TableRow><TableCell>Service</TableCell></TableRow></TableHead>
            <TableBody>{DATA.map(r => <TreeRow key={r.key} row={r} depth={0} expanded={expanded} checked={checked} onToggle={toggle} onCheck={check} />)}</TableBody>
          </Table>
        </TableContainer>
        {footer && <Box sx={{ mt: 1 }}>{footer}</Box>}
      </CardContent>
    </Card>
  );
}

export default function T01({ onSuccess }: TaskComponentProps) {
  const [prodChecked, setProdChecked] = useState<Set<string>>(new Set());
  const [stagingChecked, setStagingChecked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current || !saved) return;
    const paths = Array.from(prodChecked).map(k => getPath(DATA, k));
    if (pathSetsEqual(paths, [['Platform', 'API Gateway'], ['Platform', 'Auth Service']])) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, prodChecked, onSuccess]);

  return (
    <Stack direction="row" spacing={2}>
      <EnvGrid title="Staging environment" checked={stagingChecked} onCheckedChange={setStagingChecked} />
      <EnvGrid
        title="Production environment"
        checked={prodChecked}
        onCheckedChange={setProdChecked}
        footer={<Button variant="contained" size="small" fullWidth onClick={() => setSaved(true)}>Apply environment</Button>}
      />
    </Stack>
  );
}
