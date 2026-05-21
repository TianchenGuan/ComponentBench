'use client';

/**
 * transfer_list-mui-T10: Match project assignments in a table row
 *
 * Layout: table titled "User project access" with 3 rows (Alex Chen, Jordan Lee, Sam Rivera).
 * Each row has a "Required projects" column (read-only chips) and an "Assigned projects" column
 * containing an inline mini transfer list (Available / Assigned with > < buttons).
 *
 * Jordan Lee (target): Assigned starts with Apollo, Delta. Required chips: Apollo, Beacon, Comet.
 * Goal: make Jordan Lee's Assigned = Apollo, Beacon, Comet (remove Delta, add Beacon + Comet).
 *
 * Success: Jordan Lee's right list contains exactly Apollo, Beacon, Comet.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, CardHeader, Table, TableHead, TableBody, TableRow, TableCell,
  List, ListItemButton, ListItemIcon, ListItemText, Checkbox, Button, Paper,
  Grid, Typography, Chip, Box,
} from '@mui/material';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const ALL_PROJECTS = ['Apollo', 'Beacon', 'Comet', 'Delta', 'Echo', 'Foxtrot'];
const JORDAN_TARGET = ['Apollo', 'Beacon', 'Comet'];

function not(a: string[], b: string[]) { return a.filter(v => b.indexOf(v) === -1); }
function intersection(a: string[], b: string[]) { return a.filter(v => b.indexOf(v) !== -1); }

function MiniTransfer({
  initialLeft, initialRight, onRightChange,
}: {
  initialLeft: string[]; initialRight: string[];
  onRightChange?: (right: string[]) => void;
}) {
  const [checked, setChecked] = useState<string[]>([]);
  const [left, setLeft] = useState<string[]>(initialLeft);
  const [right, setRight] = useState<string[]>(initialRight);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: string) => () => {
    const idx = checked.indexOf(value);
    const nc = [...checked];
    idx === -1 ? nc.push(value) : nc.splice(idx, 1);
    setChecked(nc);
  };

  const moveRight = () => {
    const nr = right.concat(leftChecked);
    setRight(nr); setLeft(not(left, leftChecked)); setChecked(not(checked, leftChecked));
    onRightChange?.(nr);
  };
  const moveLeft = () => {
    const nr = not(right, rightChecked);
    setLeft(left.concat(rightChecked)); setRight(nr); setChecked(not(checked, rightChecked));
    onRightChange?.(nr);
  };

  const renderList = (label: string, items: string[]) => (
    <Paper variant="outlined" sx={{ width: 120, height: 160, overflow: 'auto' }}>
      <Typography sx={{ px: 0.5, py: 0.25, fontWeight: 500, fontSize: 11, color: 'text.secondary' }}>{label}</Typography>
      <List dense disablePadding>
        {items.map(v => (
          <ListItemButton key={v} onClick={handleToggle(v)} sx={{ py: 0, minHeight: 24 }}>
            <ListItemIcon sx={{ minWidth: 24 }}><Checkbox checked={checked.includes(v)} tabIndex={-1} disableRipple size="small" sx={{ p: 0.25 }} /></ListItemIcon>
            <ListItemText primary={v} primaryTypographyProps={{ fontSize: 11 }} />
          </ListItemButton>
        ))}
        {items.length === 0 && <Typography variant="caption" color="text.secondary" sx={{ p: 1, display: 'block', textAlign: 'center' }}>—</Typography>}
      </List>
    </Paper>
  );

  return (
    <Grid container spacing={0.5} alignItems="center" wrap="nowrap">
      <Grid item>{renderList('Available', left)}</Grid>
      <Grid item>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          <Button variant="outlined" size="small" onClick={moveRight} disabled={leftChecked.length === 0} sx={{ minWidth: 28, px: 0.5, fontSize: 12 }}>{'>'}</Button>
          <Button variant="outlined" size="small" onClick={moveLeft} disabled={rightChecked.length === 0} sx={{ minWidth: 28, px: 0.5, fontSize: 12 }}>{'<'}</Button>
        </Box>
      </Grid>
      <Grid item>{renderList('Assigned', right)}</Grid>
    </Grid>
  );
}

interface RowData {
  name: string;
  required: string[];
  initialAssigned: string[];
}

const ROWS: RowData[] = [
  { name: 'Alex Chen', required: ['Delta', 'Echo'], initialAssigned: ['Delta'] },
  { name: 'Jordan Lee', required: ['Apollo', 'Beacon', 'Comet'], initialAssigned: ['Apollo', 'Delta'] },
  { name: 'Sam Rivera', required: ['Foxtrot'], initialAssigned: ['Foxtrot', 'Echo'] },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const handleJordanChange = (right: string[]) => {
    if (!successFired.current && setsEqual(right, JORDAN_TARGET)) {
      successFired.current = true;
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 750 }} data-testid="transfer-user-access">
      <CardHeader title="User project access" />
      <CardContent sx={{ p: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, width: 120 }}>User</TableCell>
              <TableCell sx={{ fontWeight: 600, width: 180 }}>Required projects</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Assigned projects</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ROWS.map(row => (
              <TableRow key={row.name}>
                <TableCell sx={{ verticalAlign: 'top', pt: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{row.name}</Typography>
                </TableCell>
                <TableCell sx={{ verticalAlign: 'top', pt: 2 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {row.required.map(p => <Chip key={p} label={p} size="small" variant="outlined" />)}
                  </Box>
                </TableCell>
                <TableCell>
                  <MiniTransfer
                    initialLeft={ALL_PROJECTS.filter(p => !row.initialAssigned.includes(p))}
                    initialRight={[...row.initialAssigned]}
                    onRightChange={row.name === 'Jordan Lee' ? handleJordanChange : undefined}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
