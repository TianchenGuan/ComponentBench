'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Card, CardContent, List, ListItemButton, ListItemIcon,
  ListItemText, Checkbox, Button, Paper, Grid, Typography, Chip, Stack,
} from '@mui/material';
import type { TaskComponentProps } from '../../types';
import { setsEqual } from '../../types';

const REFERENCE = ['Viewer', 'Editor', 'Admin (billing)', 'Owner'];

const allRoles = [
  'Viewer', 'View-only', 'Editor', 'Editor (limited)',
  'Admin (billing)', 'Admin', 'Admin (ops)', 'Owner', 'Owner (workspace)',
];

function not(a: string[], b: string[]) { return a.filter(v => !b.includes(v)); }

export default function T09({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState<string[]>([]);
  const [left, setLeft] = useState(not(allRoles, ['View-only', 'Editor (limited)']));
  const [right, setRight] = useState(['View-only', 'Editor (limited)']);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(right, REFERENCE)) {
      successFired.current = true;
      onSuccess();
    }
  }, [right, onSuccess]);

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
    <Paper variant="outlined" sx={{ width: 200, height: 260, overflow: 'auto', border: '2px solid #000' }}>
      <Typography sx={{ p: 1, fontWeight: 600, fontSize: '0.85rem' }}>{title}</Typography>
      <List dense>
        {items.map(v => (
          <ListItemButton key={v} onClick={toggle(v)} sx={{ py: 0 }}>
            <ListItemIcon sx={{ minWidth: 30 }}>
              <Checkbox size="small" checked={checked.includes(v)} tabIndex={-1} disableRipple />
            </ListItemIcon>
            <ListItemText primary={v} primaryTypographyProps={{ fontSize: '0.8rem' }} />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );

  return (
    <Box sx={{ p: 2, maxWidth: 540, ml: 'auto', mr: 3, mt: 2 }}>
      <Card variant="outlined" sx={{ border: '2px solid #000' }}>
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>Access roles</Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Required roles
            </Typography>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
              {REFERENCE.map(r => <Chip key={r} label={r} size="small" color="primary" />)}
            </Stack>
          </Box>
          <Grid container spacing={1} justifyContent="center" alignItems="center">
            <Grid item>{renderList('Available', left)}</Grid>
            <Grid item>
              <Grid container direction="column" alignItems="center">
                <Button size="small" variant="outlined" onClick={moveRight}
                  disabled={!checked.some(v => left.includes(v))} sx={{ my: 0.5, minWidth: 30 }}>{'>'}</Button>
                <Button size="small" variant="outlined" onClick={moveLeft}
                  disabled={!checked.some(v => right.includes(v))} sx={{ my: 0.5, minWidth: 30 }}>{'<'}</Button>
              </Grid>
            </Grid>
            <Grid item>{renderList('Selected', right)}</Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
