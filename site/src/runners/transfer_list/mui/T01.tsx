'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, List, ListItemButton, ListItemIcon, ListItemText, Checkbox, Button, Paper, Grid, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const allItems = ['Design', 'Engineering', 'Legal', 'Finance', 'Sales', 'Support', 'Marketing', 'HR'];
const targetItems = ['Design', 'Legal'];

function not(a: string[], b: string[]) { return a.filter(v => b.indexOf(v) === -1); }
function intersection(a: string[], b: string[]) { return a.filter(v => b.indexOf(v) !== -1); }

export default function T01({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState<string[]>([]);
  const [left, setLeft] = useState<string[]>(allItems);
  const [right, setRight] = useState<string[]>([]);
  const successFired = useRef(false);
  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  useEffect(() => { if (!successFired.current && setsEqual(right, targetItems)) { successFired.current = true; onSuccess(); } }, [right, onSuccess]);

  const handleToggle = (value: string) => () => {
    const idx = checked.indexOf(value);
    const newChecked = [...checked];
    idx === -1 ? newChecked.push(value) : newChecked.splice(idx, 1);
    setChecked(newChecked);
  };

  const handleCheckedRight = () => { setRight(right.concat(leftChecked)); setLeft(not(left, leftChecked)); setChecked(not(checked, leftChecked)); };
  const handleCheckedLeft = () => { setLeft(left.concat(rightChecked)); setRight(not(right, rightChecked)); setChecked(not(checked, rightChecked)); };

  const customList = (title: string, items: string[]) => (
    <Paper sx={{ width: 200, height: 300, overflow: 'auto' }}>
      <Typography sx={{ p: 1, fontWeight: 500 }}>{title}</Typography>
      <List dense>{items.map(v => (
        <ListItemButton key={v} onClick={handleToggle(v)}>
          <ListItemIcon><Checkbox checked={checked.indexOf(v) !== -1} tabIndex={-1} disableRipple /></ListItemIcon>
          <ListItemText primary={v} />
        </ListItemButton>
      ))}</List>
    </Paper>
  );

  return (
    <Card sx={{ width: 550 }}>
      <CardHeader title="Department access" />
      <CardContent>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item>{customList('Choices', left)}</Grid>
          <Grid item>
            <Grid container direction="column" alignItems="center">
              <Button sx={{ my: 0.5 }} variant="outlined" size="small" onClick={handleCheckedRight} disabled={leftChecked.length === 0}>{'>'}</Button>
              <Button sx={{ my: 0.5 }} variant="outlined" size="small" onClick={handleCheckedLeft} disabled={rightChecked.length === 0}>{'<'}</Button>
            </Grid>
          </Grid>
          <Grid item>{customList('Chosen', right)}</Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
