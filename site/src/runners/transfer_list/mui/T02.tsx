'use client';

/**
 * transfer_list-mui-T02: Move all items to the right
 *
 * Layout: isolated card centered on the page titled "Feature flags".
 * A MUI Transfer List in the "basic" style with four move buttons: ≫ (all right), > (selected right),
 * < (selected left), ≪ (all left).
 *
 * Columns: "Available" (left) and "Selected" (right). Each list item has a checkbox.
 * Initial state: Selected is empty. Available contains 8 feature flags.
 *
 * Success: Target (right) list contains all 8 items.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, CardHeader, List, ListItemButton, ListItemIcon, ListItemText,
  Checkbox, Button, Paper, Grid, Typography,
} from '@mui/material';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const ALL_ITEMS = ['Alpha UI', 'Beta search', 'Dark mode', 'New billing', 'Audit log', 'Auto-save', 'Offline mode', 'CSV export'];

function not(a: string[], b: string[]) { return a.filter(v => b.indexOf(v) === -1); }
function intersection(a: string[], b: string[]) { return a.filter(v => b.indexOf(v) !== -1); }

export default function T02({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState<string[]>([]);
  const [left, setLeft] = useState<string[]>([...ALL_ITEMS]);
  const [right, setRight] = useState<string[]>([]);
  const successFired = useRef(false);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  useEffect(() => {
    if (!successFired.current && setsEqual(right, ALL_ITEMS)) {
      successFired.current = true;
      onSuccess();
    }
  }, [right, onSuccess]);

  const handleToggle = (value: string) => () => {
    const idx = checked.indexOf(value);
    const newChecked = [...checked];
    idx === -1 ? newChecked.push(value) : newChecked.splice(idx, 1);
    setChecked(newChecked);
  };

  const handleAllRight = () => { setRight(right.concat(left)); setLeft([]); setChecked(not(checked, left)); };
  const handleCheckedRight = () => { setRight(right.concat(leftChecked)); setLeft(not(left, leftChecked)); setChecked(not(checked, leftChecked)); };
  const handleCheckedLeft = () => { setLeft(left.concat(rightChecked)); setRight(not(right, rightChecked)); setChecked(not(checked, rightChecked)); };
  const handleAllLeft = () => { setLeft(left.concat(right)); setRight([]); setChecked(not(checked, right)); };

  const customList = (title: string, items: string[]) => (
    <Paper sx={{ width: 220, height: 300, overflow: 'auto' }}>
      <Typography sx={{ p: 1, fontWeight: 500 }}>{title}</Typography>
      <List dense>
        {items.map(v => (
          <ListItemButton key={v} onClick={handleToggle(v)}>
            <ListItemIcon><Checkbox checked={checked.indexOf(v) !== -1} tabIndex={-1} disableRipple /></ListItemIcon>
            <ListItemText primary={v} />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );

  return (
    <Card sx={{ width: 600 }} data-testid="transfer-feature-flags">
      <CardHeader title="Feature flags" />
      <CardContent>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item>{customList('Available', left)}</Grid>
          <Grid item>
            <Grid container direction="column" alignItems="center">
              <Button sx={{ my: 0.5 }} variant="outlined" size="small" onClick={handleAllRight} disabled={left.length === 0}>{'≫'}</Button>
              <Button sx={{ my: 0.5 }} variant="outlined" size="small" onClick={handleCheckedRight} disabled={leftChecked.length === 0}>{'>'}</Button>
              <Button sx={{ my: 0.5 }} variant="outlined" size="small" onClick={handleCheckedLeft} disabled={rightChecked.length === 0}>{'<'}</Button>
              <Button sx={{ my: 0.5 }} variant="outlined" size="small" onClick={handleAllLeft} disabled={right.length === 0}>{'≪'}</Button>
            </Grid>
          </Grid>
          <Grid item>{customList('Selected', right)}</Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
