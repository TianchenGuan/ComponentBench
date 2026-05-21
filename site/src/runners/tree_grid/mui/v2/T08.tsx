'use client';

/**
 * tree_grid-mui-v2-T08: Write permissions grid only – exact checkbox set in one of two grids
 *
 * Two MUI tree grids side by side: "Read permissions" and "Write permissions".
 * In Write permissions, expand Platform, uncheck Logs (pre-checked), check Deployments + Incidents + Queues.
 * Click "Apply permissions".
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Paper, Button,
  Checkbox, Stack, createTheme, ThemeProvider, CssBaseline
} from '@mui/material';
import { KeyboardArrowRight, KeyboardArrowDown } from '@mui/icons-material';
import type { TaskComponentProps } from '../../types';
import { pathSetsEqual } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

interface PermNode { key: string; name: string; children?: PermNode[]; }

const PERM_TREE: PermNode[] = [
  { key: 'platform', name: 'Platform', children: [
    { key: 'platform/deployments', name: 'Deployments' },
    { key: 'platform/incidents', name: 'Incidents' },
    { key: 'platform/queues', name: 'Queues' },
    { key: 'platform/logs', name: 'Logs' },
  ]},
  { key: 'finance', name: 'Finance', children: [
    { key: 'finance/billing', name: 'Billing' },
  ]},
];

function getPath(rows: PermNode[], key: string): string[] {
  for (const r of rows) {
    if (r.key === key) return [r.name];
    if (r.children) { const p = getPath(r.children, key); if (p.length) return [r.name, ...p]; }
  }
  return [];
}

function TreeRow({ row, depth, expanded, checked, onToggle, onCheck }: {
  row: PermNode; depth: number; expanded: Set<string>; checked: Set<string>;
  onToggle: (k: string) => void; onCheck: (k: string) => void;
}) {
  const isExp = expanded.has(row.key);
  const hasKids = !!row.children?.length;
  return (
    <>
      <TableRow hover>
        <TableCell sx={{ pl: depth * 3 + 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {hasKids ? (
              <IconButton size="small" onClick={() => onToggle(row.key)}>
                {isExp ? <KeyboardArrowDown fontSize="small" /> : <KeyboardArrowRight fontSize="small" />}
              </IconButton>
            ) : <Box sx={{ width: 28 }} />}
            <Checkbox size="small" checked={checked.has(row.key)} onChange={() => onCheck(row.key)} />
            <Typography variant="body2">{row.name}</Typography>
          </Box>
        </TableCell>
      </TableRow>
      {hasKids && isExp && row.children!.map(c => (
        <TreeRow key={c.key} row={c} depth={depth + 1} expanded={expanded} checked={checked} onToggle={onToggle} onCheck={onCheck} />
      ))}
    </>
  );
}

function PermGrid({ title, checked, onCheckedChange, footer }: {
  title: string; checked: Set<string>; onCheckedChange: (s: Set<string>) => void; footer?: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const toggle = (k: string) => setExpanded(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n; });
  const check = (k: string) => onCheckedChange((() => { const n = new Set(checked); n.has(k) ? n.delete(k) : n.add(k); return n; })());

  return (
    <Card sx={{ flex: 1, minWidth: 260 }}>
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>{title}</Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead><TableRow><TableCell>Permission</TableCell></TableRow></TableHead>
            <TableBody>{PERM_TREE.map(r => <TreeRow key={r.key} row={r} depth={0} expanded={expanded} checked={checked} onToggle={toggle} onCheck={check} />)}</TableBody>
          </Table>
        </TableContainer>
        {footer && <Box sx={{ mt: 1 }}>{footer}</Box>}
      </CardContent>
    </Card>
  );
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [readChecked, setReadChecked] = useState<Set<string>>(new Set(['platform/deployments']));
  const [writeChecked, setWriteChecked] = useState<Set<string>>(new Set(['platform/logs']));
  const [saved, setSaved] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current || !saved) return;
    const paths = Array.from(writeChecked).map(k => getPath(PERM_TREE, k));
    if (pathSetsEqual(paths, [['Platform', 'Deployments'], ['Platform', 'Incidents'], ['Platform', 'Queues']])) {
      successFired.current = true;
      onSuccess();
    }
  }, [saved, writeChecked, onSuccess]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Stack direction="row" spacing={2}>
        <PermGrid title="Read permissions" checked={readChecked} onCheckedChange={setReadChecked} />
        <PermGrid
          title="Write permissions"
          checked={writeChecked}
          onCheckedChange={setWriteChecked}
          footer={<Button variant="contained" size="small" fullWidth onClick={() => setSaved(true)}>Apply permissions</Button>}
        />
      </Stack>
    </ThemeProvider>
  );
}
