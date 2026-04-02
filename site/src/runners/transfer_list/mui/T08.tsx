'use client';

/**
 * transfer_list-mui-T08: Configure alert types in dark compact mode
 *
 * Layout: isolated card titled "Alert routing". Dark theme, compact spacing.
 * Columns: "All alerts" (left) and "Enabled alerts" (right) with ">" and "<" buttons.
 *
 * Left list has 50 alert labels with near-duplicates (CPU high/critical/warning, etc.).
 * Initial right list has incorrect defaults (CPU warning, Latency avg) that must be removed.
 *
 * Success: Right list contains exactly the 12 target alerts.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, CardHeader, List, ListItemButton, ListItemIcon, ListItemText,
  Checkbox, Button, Paper, Grid, Typography, ThemeProvider, createTheme, CssBaseline,
} from '@mui/material';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const TARGET = [
  'CPU high', 'CPU critical', 'Memory high', 'Memory critical',
  'Disk high', 'Disk critical', 'Latency p95', 'Latency p99',
  'Error rate', 'Throughput drop', 'Queue backlog', 'Pod restarts',
];

const ALL_ALERTS = [
  'CPU high', 'CPU critical', 'CPU warning', 'CPU idle', 'CPU throttled',
  'Memory high', 'Memory critical', 'Memory warning', 'Memory leak suspected', 'Memory swap',
  'Disk high', 'Disk critical', 'Disk warning', 'Disk read latency', 'Disk write latency',
  'Latency p95', 'Latency p99', 'Latency avg', 'Latency p50', 'Latency timeout',
  'Error rate', 'Error rate (5xx)', 'Error rate (4xx)', 'Error rate (timeout)', 'Error rate (upstream)',
  'Throughput drop', 'Throughput spike', 'Throughput zero', 'Throughput anomaly', 'Throughput baseline',
  'Queue backlog', 'Queue delay', 'Queue depth', 'Queue consumer lag', 'Queue dead letter',
  'Pod restarts', 'Pod restarts (OOM)', 'Pod restarts (CrashLoop)', 'Pod evicted', 'Pod pending',
  'Network in spike', 'Network out spike', 'Network packet loss', 'Network DNS failure', 'Network timeout',
  'Certificate expiry', 'Certificate mismatch', 'Secret rotation', 'Config drift', 'Deployment failed',
];

const INITIAL_RIGHT = ['CPU warning', 'Latency avg'];
const INITIAL_LEFT = ALL_ALERTS.filter(a => !INITIAL_RIGHT.includes(a));

const darkTheme = createTheme({ palette: { mode: 'dark' } });

function not(a: string[], b: string[]) { return a.filter(v => b.indexOf(v) === -1); }
function intersection(a: string[], b: string[]) { return a.filter(v => b.indexOf(v) !== -1); }

export default function T08({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState<string[]>([]);
  const [left, setLeft] = useState<string[]>([...INITIAL_LEFT]);
  const [right, setRight] = useState<string[]>([...INITIAL_RIGHT]);
  const successFired = useRef(false);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  useEffect(() => {
    if (!successFired.current && setsEqual(right, TARGET)) {
      successFired.current = true;
      onSuccess();
    }
  }, [right, onSuccess]);

  const handleToggle = (value: string) => () => {
    const idx = checked.indexOf(value);
    const nc = [...checked];
    idx === -1 ? nc.push(value) : nc.splice(idx, 1);
    setChecked(nc);
  };

  const handleCheckedRight = () => { setRight(right.concat(leftChecked)); setLeft(not(left, leftChecked)); setChecked(not(checked, leftChecked)); };
  const handleCheckedLeft = () => { setLeft(left.concat(rightChecked)); setRight(not(right, rightChecked)); setChecked(not(checked, rightChecked)); };

  const customList = (title: string, items: string[]) => (
    <Paper sx={{ width: 240, height: 400, overflow: 'auto' }}>
      <Typography sx={{ p: 0.75, fontWeight: 500, fontSize: 13 }}>{title}</Typography>
      <List dense disablePadding>
        {items.map(v => (
          <ListItemButton key={v} onClick={handleToggle(v)} sx={{ py: 0, minHeight: 28 }}>
            <ListItemIcon sx={{ minWidth: 28 }}><Checkbox checked={checked.includes(v)} tabIndex={-1} disableRipple size="small" /></ListItemIcon>
            <ListItemText primary={v} primaryTypographyProps={{ fontSize: 12 }} />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Card sx={{ width: 640 }} data-testid="transfer-alert-routing">
        <CardHeader title="Alert routing" titleTypographyProps={{ fontSize: 16 }} />
        <CardContent sx={{ pt: 0 }}>
          <Grid container spacing={1} justifyContent="center" alignItems="center">
            <Grid item>{customList('All alerts', left)}</Grid>
            <Grid item>
              <Grid container direction="column" alignItems="center">
                <Button sx={{ my: 0.25 }} variant="outlined" size="small" onClick={handleCheckedRight} disabled={leftChecked.length === 0}>{'>'}</Button>
                <Button sx={{ my: 0.25 }} variant="outlined" size="small" onClick={handleCheckedLeft} disabled={rightChecked.length === 0}>{'<'}</Button>
              </Grid>
            </Grid>
            <Grid item>{customList('Enabled alerts', right)}</Grid>
          </Grid>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}
