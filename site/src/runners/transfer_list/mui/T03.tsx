'use client';

/**
 * transfer_list-mui-T03: Select all choices without transferring
 *
 * Layout: isolated card centered on the page titled "Bulk selection".
 * A MUI "enhanced" Transfer List with select-all checkbox and counter in each column header.
 * Two lists: "Choices" (left) and "Chosen" (right). A single move button (">") between them.
 *
 * Initial state: Chosen is empty. Choices contains exactly 4 items: Item A, Item B, Item C, Item D.
 * No items are checked initially.
 *
 * Success: All 4 items in the left (Choices) list are checked/selected. Nothing needs to be transferred.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, CardHeader, List, ListItemButton, ListItemIcon, ListItemText,
  Checkbox, Button, Paper, Grid, Typography, Divider,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const INITIAL_LEFT = ['Item A', 'Item B', 'Item C', 'Item D'];
const INITIAL_RIGHT: string[] = [];

function not(a: string[], b: string[]) { return a.filter(v => b.indexOf(v) === -1); }
function intersection(a: string[], b: string[]) { return a.filter(v => b.indexOf(v) !== -1); }

export default function T03({ onSuccess }: TaskComponentProps) {
  const [checked, setChecked] = useState<string[]>([]);
  const [left, setLeft] = useState<string[]>(INITIAL_LEFT);
  const [right, setRight] = useState<string[]>(INITIAL_RIGHT);
  const successFired = useRef(false);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  useEffect(() => {
    if (successFired.current) return;
    const allLeftChecked = left.length > 0 && left.every(item => checked.includes(item));
    if (allLeftChecked) {
      successFired.current = true;
      onSuccess();
    }
  }, [checked, left, onSuccess]);

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
            <ListItemIcon>
              <Checkbox checked={checked.indexOf(v) !== -1} tabIndex={-1} disableRipple />
            </ListItemIcon>
            <ListItemText primary={v} />
          </ListItemButton>
        ))}
        {items.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
            No data
          </Typography>
        )}
      </List>
    </Paper>
  );

  return (
    <Card sx={{ width: 600 }} data-testid="transfer-bulk-selection">
      <CardHeader title="Bulk selection" />
      <CardContent>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item>{customList('Choices', left)}</Grid>
          <Grid item>
            <Grid container direction="column" alignItems="center">
              <Button
                sx={{ my: 0.5 }}
                variant="outlined"
                size="small"
                onClick={handleCheckedRight}
                disabled={leftChecked.length === 0}
              >
                {'>'}
              </Button>
            </Grid>
          </Grid>
          <Grid item>{customList('Chosen', right)}</Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
