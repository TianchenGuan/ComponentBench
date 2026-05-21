'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Checkbox, Button, Paper, Grid, Typography, Stack,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const TARGET = ['Date', 'Customer', 'Total', 'Profit margin'];

function not(a: string[], b: string[]) { return a.filter(v => !b.includes(v)); }

export default function T10({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  const [left, setLeft] = useState(['Profit margin', 'Tax', 'Discount']);
  const [right, setRight] = useState(['Date', 'Customer', 'Total', 'Notes']);
  const [committed, setCommitted] = useState<string[] | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && committed && setsEqual(committed, TARGET)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

  const handleSave = () => {
    setCommitted([...right]);
    setOpen(false);
  };

  const toggle = (v: string) => () =>
    setChecked(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);

  const moveRight = () => {
    const sel = checked.filter(v => left.includes(v));
    setRight(prev => [...prev, ...sel]);
    setLeft(prev => not(prev, sel));
    setChecked(prev => not(prev, sel));
  };

  const moveLeft = () => {
    const sel = checked.filter(v => right.includes(v));
    setLeft(prev => [...prev, ...sel]);
    setRight(prev => not(prev, sel));
    setChecked(prev => not(prev, sel));
  };

  const renderList = (title: string, items: string[]) => (
    <Paper variant="outlined" sx={{ width: 200, height: 280, overflow: 'auto' }}>
      <Typography sx={{ p: 1, fontWeight: 500 }}>{title}</Typography>
      <List dense>
        {items.map(v => (
          <ListItemButton key={v} onClick={toggle(v)}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <Checkbox size="small" checked={checked.includes(v)} tabIndex={-1} disableRipple />
            </ListItemIcon>
            <ListItemText primary={v} />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Report configuration</Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Customize which columns appear in the report.
      </Typography>
      <Button variant="contained" onClick={() => setOpen(true)}>Customize columns</Button>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 560, p: 3 }}>
          <Typography variant="h6" gutterBottom>Report columns</Typography>
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item>{renderList('Hidden', left)}</Grid>
            <Grid item>
              <Grid container direction="column" alignItems="center">
                <Button sx={{ my: 0.5 }} variant="outlined" size="small" onClick={moveRight}
                  disabled={!checked.some(v => left.includes(v))}>{'>'}</Button>
                <Button sx={{ my: 0.5 }} variant="outlined" size="small" onClick={moveLeft}
                  disabled={!checked.some(v => right.includes(v))}>{'<'}</Button>
              </Grid>
            </Grid>
            <Grid item>{renderList('Visible', right)}</Grid>
          </Grid>
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button variant="outlined" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>Save columns</Button>
          </Stack>
        </Box>
      </Drawer>
    </Box>
  );
}
