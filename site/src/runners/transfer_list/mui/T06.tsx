'use client';

/**
 * transfer_list-mui-T06: Manage tags in a dialog and save
 *
 * Layout: modal flow. A card titled "Issue labels" with a "Manage tags" button.
 * Clicking it opens a MUI Dialog containing a composed transfer list.
 * Columns: "All tags" (left) and "Active tags" (right). ">" and "<" buttons between lists.
 * Dialog actions: "Cancel" and primary "Save". Changes committed only after Save.
 *
 * Initial state: Active tags contains "Needs triage". All tags contains the remaining 6 tags.
 * Goal: Active tags = Urgent, Blocked (remove Needs triage, add Urgent and Blocked).
 *
 * Success: After clicking Save, right list contains exactly Urgent and Blocked.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, CardHeader, List, ListItemButton, ListItemIcon, ListItemText,
  Checkbox, Button, Paper, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const ALL_TAGS = ['Urgent', 'Blocked', 'Needs triage', 'Customer reported', 'Regression', 'Performance', 'Documentation'];
const INITIAL_RIGHT = ['Needs triage'];
const INITIAL_LEFT = ALL_TAGS.filter(t => !INITIAL_RIGHT.includes(t));
const TARGET = ['Urgent', 'Blocked'];

function not(a: string[], b: string[]) { return a.filter(v => b.indexOf(v) === -1); }
function intersection(a: string[], b: string[]) { return a.filter(v => b.indexOf(v) !== -1); }

export default function T06({ onSuccess }: TaskComponentProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  const [left, setLeft] = useState<string[]>([...INITIAL_LEFT]);
  const [right, setRight] = useState<string[]>([...INITIAL_RIGHT]);
  const [committedLeft, setCommittedLeft] = useState<string[]>([...INITIAL_LEFT]);
  const [committedRight, setCommittedRight] = useState<string[]>([...INITIAL_RIGHT]);
  const successFired = useRef(false);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: string) => () => {
    const idx = checked.indexOf(value);
    const newChecked = [...checked];
    idx === -1 ? newChecked.push(value) : newChecked.splice(idx, 1);
    setChecked(newChecked);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };
  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleOpen = () => {
    setLeft([...committedLeft]);
    setRight([...committedRight]);
    setChecked([]);
    setDialogOpen(true);
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };

  const handleSave = () => {
    setCommittedLeft([...left]);
    setCommittedRight([...right]);
    setDialogOpen(false);
    if (!successFired.current && setsEqual(right, TARGET)) {
      successFired.current = true;
      onSuccess();
    }
  };

  const customList = (title: string, items: string[]) => (
    <Paper sx={{ width: 220, height: 280, overflow: 'auto' }}>
      <Typography sx={{ p: 1, fontWeight: 500 }}>{title}</Typography>
      <List dense>
        {items.map(v => (
          <ListItemButton key={v} onClick={handleToggle(v)}>
            <ListItemIcon><Checkbox checked={checked.indexOf(v) !== -1} tabIndex={-1} disableRipple /></ListItemIcon>
            <ListItemText primary={v} />
          </ListItemButton>
        ))}
        {items.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>No tags</Typography>
        )}
      </List>
    </Paper>
  );

  return (
    <>
      <Card sx={{ width: 400 }} data-testid="card-issue-labels">
        <CardHeader title="Issue labels" />
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Configure which tags are active for this project.
          </Typography>
          <Button variant="contained" onClick={handleOpen} data-testid="manage-tags-btn">
            Manage tags
          </Button>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={handleCancel} maxWidth="md" data-testid="dialog-manage-tags">
        <DialogTitle>Manage tags</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ mt: 1 }}>
            <Grid item>{customList('All tags', left)}</Grid>
            <Grid item>
              <Grid container direction="column" alignItems="center">
                <Button sx={{ my: 0.5 }} variant="outlined" size="small" onClick={handleCheckedRight} disabled={leftChecked.length === 0}>{'>'}</Button>
                <Button sx={{ my: 0.5 }} variant="outlined" size="small" onClick={handleCheckedLeft} disabled={rightChecked.length === 0}>{'<'}</Button>
              </Grid>
            </Grid>
            <Grid item>{customList('Active tags', right)}</Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} data-testid="save-tags-btn">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
