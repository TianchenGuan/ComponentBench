'use client';

/**
 * transfer_list-mui-T07: Grant repo access for Project B only
 *
 * Layout: settings panel titled "Repository access" with a non-functional sidebar nav (medium clutter).
 * TWO composed MUI transfer lists stacked vertically:
 *   - "Project A access": Allowed contains "Repo: docs" (pre-selected)
 *   - "Project B access" (target): Allowed is empty
 * Both share the same 6 repo options. Columns: "Blocked" (left) / "Allowed" (right).
 *
 * Success: Project B's Allowed (right) contains exactly Repo: mobile-app and Repo: api.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, CardHeader, List, ListItemButton, ListItemIcon, ListItemText,
  Checkbox, Button, Paper, Grid, Typography, Box, Divider,
} from '@mui/material';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const ALL_REPOS = ['Repo: web-app', 'Repo: mobile-app', 'Repo: api', 'Repo: infra', 'Repo: docs', 'Repo: experiments'];
const TARGET = ['Repo: mobile-app', 'Repo: api'];

function not(a: string[], b: string[]) { return a.filter(v => b.indexOf(v) === -1); }
function intersection(a: string[], b: string[]) { return a.filter(v => b.indexOf(v) !== -1); }

function TransferInstance({
  title, initialLeft, initialRight, onRightChange,
}: {
  title: string; initialLeft: string[]; initialRight: string[];
  onRightChange?: (right: string[]) => void;
}) {
  const [checked, setChecked] = useState<string[]>([]);
  const [left, setLeft] = useState<string[]>(initialLeft);
  const [right, setRight] = useState<string[]>(initialRight);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: string) => () => {
    const idx = checked.indexOf(value);
    const nc = [...checked];
    idx === -1 ? nc.push(value) : nc.splice(idx, 1);
    setChecked(nc);
  };

  const moveRight = () => {
    const nr = right.concat(leftChecked);
    setRight(nr); setLeft(not(left, leftChecked)); setChecked(not(checked, leftChecked));
    onRightChange?.(nr);
  };
  const moveLeft = () => {
    const nr = not(right, rightChecked);
    setLeft(left.concat(rightChecked)); setRight(nr); setChecked(not(checked, rightChecked));
    onRightChange?.(nr);
  };

  const renderList = (label: string, items: string[]) => (
    <Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
      <Typography sx={{ p: 1, fontWeight: 500, fontSize: 13 }}>{label}</Typography>
      <List dense>
        {items.map(v => (
          <ListItemButton key={v} onClick={handleToggle(v)} sx={{ py: 0.25 }}>
            <ListItemIcon sx={{ minWidth: 32 }}><Checkbox checked={checked.includes(v)} tabIndex={-1} disableRipple size="small" /></ListItemIcon>
            <ListItemText primary={v} primaryTypographyProps={{ fontSize: 13 }} />
          </ListItemButton>
        ))}
        {items.length === 0 && <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>Empty</Typography>}
      </List>
    </Paper>
  );

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>{title}</Typography>
      <Grid container spacing={1} alignItems="center">
        <Grid item>{renderList('Blocked', left)}</Grid>
        <Grid item>
          <Grid container direction="column" alignItems="center">
            <Button sx={{ my: 0.25 }} variant="outlined" size="small" onClick={moveRight} disabled={leftChecked.length === 0}>{'>'}</Button>
            <Button sx={{ my: 0.25 }} variant="outlined" size="small" onClick={moveLeft} disabled={rightChecked.length === 0}>{'<'}</Button>
          </Grid>
        </Grid>
        <Grid item>{renderList('Allowed', right)}</Grid>
      </Grid>
    </Box>
  );
}

const NAV_ITEMS = ['General', 'Members', 'Repositories', 'Billing', 'Integrations'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const successFired = useRef(false);

  const handleProjectBChange = (right: string[]) => {
    if (!successFired.current && setsEqual(right, TARGET)) {
      successFired.current = true;
      onSuccess();
    }
  };

  return (
    <Box sx={{ display: 'flex', width: 700 }}>
      <Paper sx={{ width: 160, p: 2, mr: 2, flexShrink: 0 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Settings</Typography>
        {NAV_ITEMS.map(item => (
          <Typography key={item} variant="body2" sx={{ py: 0.5, px: 1, cursor: 'default', color: item === 'Repositories' ? 'primary.main' : 'text.secondary', fontWeight: item === 'Repositories' ? 600 : 400 }}>
            {item}
          </Typography>
        ))}
      </Paper>

      <Card sx={{ flex: 1 }} data-testid="transfer-repo-access">
        <CardHeader title="Repository access" />
        <CardContent>
          <TransferInstance
            title="Project A access"
            initialLeft={ALL_REPOS.filter(r => r !== 'Repo: docs')}
            initialRight={['Repo: docs']}
          />
          <Divider sx={{ mb: 2 }} />
          <TransferInstance
            title="Project B access"
            initialLeft={[...ALL_REPOS]}
            initialRight={[]}
            onRightChange={handleProjectBChange}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
