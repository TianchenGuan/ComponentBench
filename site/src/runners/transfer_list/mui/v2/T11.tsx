'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box, List, ListItemButton, ListItemIcon, ListItemText,
  Checkbox, Button, Paper, Grid, Typography, TextField,
  ThemeProvider, createTheme, CssBaseline,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const countries = [
  'Afghanistan', 'Argentina', 'Australia', 'Belgium', 'Brazil', 'Canada',
  'Chile', 'China', 'Colombia', 'Denmark', 'Egypt', 'Finland',
  'France', 'Germany', 'Greece', 'India', 'Indonesia', 'Ireland',
  'Italy', 'Japan', 'Jordan', 'Kenya', 'Malaysia', 'Mexico',
  'Morocco', 'Netherlands', 'New Zealand', 'Nigeria', 'North Macedonia', 'Norway',
  'Pakistan', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Romania',
  'Saudi Arabia', 'Singapore', 'South Africa', 'South Korea', 'Spain', 'Sweden',
  'Switzerland', 'Thailand', 'Turkey', 'Ukraine', 'United Kingdom', 'United States',
  'Vietnam',
];

const TARGET = ['Canada', 'Japan', 'Kenya', 'Norway'];

function not(a: string[], b: string[]) { return a.filter(v => !b.includes(v)); }

export default function T11({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState<string[]>([]);
  const [left, setLeft] = useState(not(countries, ['Jordan']));
  const [right, setRight] = useState(['Jordan']);
  const [filter, setFilter] = useState('');
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

  const filteredLeft = filter
    ? left.filter(v => v.toLowerCase().includes(filter.toLowerCase()))
    : left;

  const renderList = (title: string, items: string[], showFilter?: boolean) => (
    <Paper sx={{ width: 220, height: 350, overflow: 'auto' }}>
      <Typography sx={{ p: 1, fontWeight: 500 }}>{title}</Typography>
      {showFilter && (
        <TextField
          size="small"
          placeholder="Filter..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ mx: 1, mb: 1, width: 'calc(100% - 16px)' }}
        />
      )}
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
        <Typography variant="h6" gutterBottom>Allowed countries</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Manage the country allowlist for this policy.
        </Typography>
        <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ mt: 1 }}>
          <Grid item>{renderList('Available', filteredLeft, true)}</Grid>
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
          Apply allowlist
        </Button>
      </Box>
    </ThemeProvider>
  );
}
