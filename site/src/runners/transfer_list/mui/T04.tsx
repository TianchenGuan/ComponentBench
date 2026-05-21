'use client';

/**
 * transfer_list-mui-T04: Pick three newsletter topics in a form
 *
 * Layout: form section titled "Newsletter preferences". Includes an email text field and a
 * "Weekly digest" toggle as low clutter.
 *
 * Below is a MUI enhanced Transfer List with counters in headers.
 * Columns: "Topics" (left) and "Subscribed" (right). Single move button (">").
 *
 * Initial state: Subscribed is empty. Topics contains 8 items.
 * Success: Right list contains exactly Security, Product updates, Events.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, CardHeader, List, ListItemButton, ListItemIcon, ListItemText,
  Checkbox, Button, Paper, Grid, Typography, Divider, TextField, FormControlLabel, Switch,
} from '@mui/material';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const ALL_ITEMS = ['Security', 'Product updates', 'Events', 'Engineering blog', 'Design tips', 'Pricing', 'Community', 'Research'];
const TARGET = ['Security', 'Product updates', 'Events'];

function not(a: string[], b: string[]) { return a.filter(v => b.indexOf(v) === -1); }
function intersection(a: string[], b: string[]) { return a.filter(v => b.indexOf(v) !== -1); }

export default function T04({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState<string[]>([]);
  const [left, setLeft] = useState<string[]>([...ALL_ITEMS]);
  const [right, setRight] = useState<string[]>([]);
  const successFired = useRef(false);

  const leftChecked = intersection(checked, left);

  useEffect(() => {
    if (!successFired.current && setsEqual(right, TARGET)) {
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

  const handleToggleAll = (items: string[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(Array.from(new Set([...checked, ...items])));
    }
  };

  const numberOfChecked = (items: string[]) => intersection(checked, items).length;

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const customList = (title: string, items: string[]) => (
    <Paper sx={{ width: 220, height: 300, overflow: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 16px' }}>
        <Checkbox
          onClick={handleToggleAll(items)}
          checked={items.length > 0 && numberOfChecked(items) === items.length}
          indeterminate={numberOfChecked(items) > 0 && numberOfChecked(items) < items.length}
          disabled={items.length === 0}
          inputProps={{ 'aria-label': `select all ${title}` }}
        />
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {title} {numberOfChecked(items)}/{items.length} selected
        </Typography>
      </div>
      <Divider />
      <List dense>
        {items.map(v => (
          <ListItemButton key={v} onClick={handleToggle(v)}>
            <ListItemIcon><Checkbox checked={checked.indexOf(v) !== -1} tabIndex={-1} disableRipple /></ListItemIcon>
            <ListItemText primary={v} />
          </ListItemButton>
        ))}
        {items.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>No items</Typography>
        )}
      </List>
    </Paper>
  );

  return (
    <Card sx={{ width: 620 }} data-testid="transfer-newsletter">
      <CardHeader title="Newsletter preferences" />
      <CardContent>
        <TextField label="Email" placeholder="you@example.com" size="small" fullWidth sx={{ mb: 2, maxWidth: 300 }} />
        <FormControlLabel control={<Switch />} label="Weekly digest" sx={{ mb: 3, display: 'block' }} />

        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item>{customList('Topics', left)}</Grid>
          <Grid item>
            <Grid container direction="column" alignItems="center">
              <Button sx={{ my: 0.5 }} variant="outlined" size="small" onClick={handleCheckedRight} disabled={leftChecked.length === 0}>{'>'}</Button>
            </Grid>
          </Grid>
          <Grid item>{customList('Subscribed', right)}</Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
