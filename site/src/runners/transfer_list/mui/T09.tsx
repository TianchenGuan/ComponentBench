'use client';

/**
 * transfer_list-mui-T09: Move high-numbered assets by scrolling
 *
 * Layout: isolated card anchored to the top-left titled "Asset monitoring".
 * Columns: "All assets" (left, 80 sequential items) and "Monitored" (right).
 * Constrained height requires scrolling to reach assets in the 70s. No search field.
 *
 * Success: Right list contains exactly Asset 72, Asset 73, Asset 74.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, CardHeader, List, ListItemButton, ListItemIcon, ListItemText,
  Checkbox, Button, Paper, Grid, Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const ALL_ASSETS = Array.from({ length: 80 }, (_, i) => `Asset ${String(i + 1).padStart(2, '0')}`);
const TARGET = ['Asset 72', 'Asset 73', 'Asset 74'];

function not(a: string[], b: string[]) { return a.filter(v => b.indexOf(v) === -1); }
function intersection(a: string[], b: string[]) { return a.filter(v => b.indexOf(v) !== -1); }

export default function T09({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState<string[]>([]);
  const [left, setLeft] = useState<string[]>([...ALL_ASSETS]);
  const [right, setRight] = useState<string[]>([]);
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
    <Paper sx={{ width: 220, height: 350, overflow: 'auto' }}>
      <Typography sx={{ p: 1, fontWeight: 500 }}>{title}</Typography>
      <List dense>
        {items.map(v => (
          <ListItemButton key={v} onClick={handleToggle(v)}>
            <ListItemIcon><Checkbox checked={checked.includes(v)} tabIndex={-1} disableRipple /></ListItemIcon>
            <ListItemText primary={v} />
          </ListItemButton>
        ))}
        {items.length === 0 && <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>Empty</Typography>}
      </List>
    </Paper>
  );

  return (
    <Card sx={{ width: 580 }} data-testid="transfer-asset-monitoring">
      <CardHeader title="Asset monitoring" />
      <CardContent>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item>{customList('All assets', left)}</Grid>
          <Grid item>
            <Grid container direction="column" alignItems="center">
              <Button sx={{ my: 0.5 }} variant="outlined" size="small" onClick={handleCheckedRight} disabled={leftChecked.length === 0}>{'>'}</Button>
              <Button sx={{ my: 0.5 }} variant="outlined" size="small" onClick={handleCheckedLeft} disabled={rightChecked.length === 0}>{'<'}</Button>
            </Grid>
          </Grid>
          <Grid item>{customList('Monitored', right)}</Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
