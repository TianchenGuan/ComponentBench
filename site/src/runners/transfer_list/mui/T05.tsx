'use client';

/**
 * transfer_list-mui-T05: Filter and add two groceries
 *
 * Layout: isolated card centered on the page titled "Grocery list builder".
 * A composed MUI transfer list with "Available items" (left) and "In cart" (right).
 *
 * Above the left list is a MUI TextField labeled "Search available" that filters the left list.
 * Between the lists are ">" and "<" move buttons.
 *
 * Initial state: In cart is empty. Available items contains 25 grocery names.
 * Success: Right list contains exactly Carrots and Chocolate.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, CardHeader, List, ListItemButton, ListItemIcon, ListItemText,
  Checkbox, Button, Paper, Grid, Typography, TextField,
} from '@mui/material';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const ALL_ITEMS = [
  'Apples', 'Avocados', 'Bananas', 'Bread', 'Broccoli', 'Butter', 'Carrots', 'Celery',
  'Cheese', 'Chicken', 'Chocolate', 'Eggs', 'Garlic', 'Grapes', 'Honey', 'Lettuce',
  'Milk', 'Onions', 'Oranges', 'Pasta', 'Peppers', 'Rice', 'Spinach', 'Tomatoes', 'Yogurt',
];
const TARGET = ['Carrots', 'Chocolate'];

function not(a: string[], b: string[]) { return a.filter(v => b.indexOf(v) === -1); }
function intersection(a: string[], b: string[]) { return a.filter(v => b.indexOf(v) !== -1); }

export default function T05({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState<string[]>([]);
  const [left, setLeft] = useState<string[]>([...ALL_ITEMS]);
  const [right, setRight] = useState<string[]>([]);
  const [filter, setFilter] = useState('');
  const successFired = useRef(false);

  const filteredLeft = filter ? left.filter(v => v.toLowerCase().includes(filter.toLowerCase())) : left;
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
    const newChecked = [...checked];
    idx === -1 ? newChecked.push(value) : newChecked.splice(idx, 1);
    setChecked(newChecked);
  };

  const handleCheckedRight = () => {
    const toMove = intersection(checked, filteredLeft);
    setRight(right.concat(toMove));
    setLeft(not(left, toMove));
    setChecked(not(checked, toMove));
  };
  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const leftList = (
    <Paper sx={{ width: 220, height: 350, overflow: 'auto' }}>
      <Typography sx={{ p: 1, fontWeight: 500 }}>Available items</Typography>
      <List dense>
        {filteredLeft.map(v => (
          <ListItemButton key={v} onClick={handleToggle(v)}>
            <ListItemIcon><Checkbox checked={checked.indexOf(v) !== -1} tabIndex={-1} disableRipple /></ListItemIcon>
            <ListItemText primary={v} />
          </ListItemButton>
        ))}
        {filteredLeft.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>No matches</Typography>
        )}
      </List>
    </Paper>
  );

  const rightList = (
    <Paper sx={{ width: 220, height: 350, overflow: 'auto' }}>
      <Typography sx={{ p: 1, fontWeight: 500 }}>In cart</Typography>
      <List dense>
        {right.map(v => (
          <ListItemButton key={v} onClick={handleToggle(v)}>
            <ListItemIcon><Checkbox checked={checked.indexOf(v) !== -1} tabIndex={-1} disableRipple /></ListItemIcon>
            <ListItemText primary={v} />
          </ListItemButton>
        ))}
        {right.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>Empty</Typography>
        )}
      </List>
    </Paper>
  );

  return (
    <Card sx={{ width: 620 }} data-testid="transfer-grocery">
      <CardHeader title="Grocery list builder" />
      <CardContent>
        <Grid container spacing={2} justifyContent="center" alignItems="flex-start">
          <Grid item>
            <TextField
              label="Search available"
              size="small"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              sx={{ mb: 1, width: 220 }}
              data-testid="search-available"
            />
            {leftList}
          </Grid>
          <Grid item>
            <Grid container direction="column" alignItems="center" sx={{ mt: 8 }}>
              <Button sx={{ my: 0.5 }} variant="outlined" size="small" onClick={handleCheckedRight} disabled={intersection(checked, filteredLeft).length === 0}>{'>'}</Button>
              <Button sx={{ my: 0.5 }} variant="outlined" size="small" onClick={handleCheckedLeft} disabled={rightChecked.length === 0}>{'<'}</Button>
            </Grid>
          </Grid>
          <Grid item sx={{ mt: '36px' }}>
            {rightList}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
