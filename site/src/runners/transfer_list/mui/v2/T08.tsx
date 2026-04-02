'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box, List, ListItemButton, ListItemIcon, ListItemText,
  Checkbox, Button, Paper, Grid, Typography,
  ThemeProvider, createTheme, CssBaseline,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const services = Array.from({ length: 120 }, (_, i) =>
  `Service ${String(i + 1).padStart(2, '0')}`
);

const TARGET = ['Service 91', 'Service 94', 'Service 97'];

function not(a: string[], b: string[]) { return a.filter(v => !b.includes(v)); }

export default function T08({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState<string[]>([]);
  const [left, setLeft] = useState(not(services, ['Service 12']));
  const [right, setRight] = useState(['Service 12']);
  const [committed, setCommitted] = useState<string[] | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && committed && setsEqual(committed, TARGET)) {
      successFired.current = true;
      onSuccess();
    }
  }, [committed, onSuccess]);

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
    <Paper sx={{ width: 220, height: 350, overflow: 'auto' }}>
      <Typography sx={{ p: 1, fontWeight: 500 }}>{title}</Typography>
      <List dense>
        {items.map(v => (
          <ListItemButton key={v} onClick={toggle(v)} sx={{ py: 0 }}>
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
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ p: 3, minHeight: '100vh', ml: 10 }}>
        <Typography variant="h6" gutterBottom>Monitored services</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Select services to include in monitoring.
        </Typography>
        <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ mt: 1 }}>
          <Grid item>{renderList('Available', left)}</Grid>
          <Grid item>
            <Grid container direction="column" alignItems="center">
              <Button sx={{ my: 0.5 }} variant="outlined" size="small" onClick={moveRight}
                disabled={!checked.some(v => left.includes(v))}>{'>'}</Button>
              <Button sx={{ my: 0.5 }} variant="outlined" size="small" onClick={moveLeft}
                disabled={!checked.some(v => right.includes(v))}>{'<'}</Button>
            </Grid>
          </Grid>
          <Grid item>{renderList('Selected', right)}</Grid>
        </Grid>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => setCommitted([...right])}>
          Apply services
        </Button>
      </Box>
    </ThemeProvider>
  );
}
