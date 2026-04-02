'use client';

/**
 * listbox_multi-mui-T05: Dense list: choose quick actions
 *
 * Layout: isolated_card centered.
 * Target component: a Material UI List rendered in dense mode (reduced vertical padding). Each ListItem has text on the left
 * and a small checkbox aligned on the far right as a secondary action.
 * Spacing is compact and the component scale is small, making the checkbox targets tighter.
 * Options (12): Pin to sidebar, Enable shortcuts, Show tooltips, Auto-refresh, Compact mode, High contrast, Animations, Sounds, etc.
 * Initial state: none selected.
 * No overlays and no scrolling.
 *
 * Success: The target listbox has exactly: Pin to sidebar, Enable shortcuts, Show tooltips.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
} from '@mui/material';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const options = [
  'Pin to sidebar',
  'Enable shortcuts',
  'Show tooltips',
  'Auto-refresh',
  'Compact mode',
  'High contrast',
  'Animations',
  'Sounds',
  'Dark mode',
  'Large text',
  'Reduce motion',
  'Focus mode',
];

const targetSet = ['Pin to sidebar', 'Enable shortcuts', 'Show tooltips'];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(selected, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [selected, onSuccess]);

  const handleToggle = (value: string) => {
    const currentIndex = selected.indexOf(value);
    const newSelected = [...selected];
    if (currentIndex === -1) {
      newSelected.push(value);
    } else {
      newSelected.splice(currentIndex, 1);
    }
    setSelected(newSelected);
  };

  return (
    <Card sx={{ width: 360 }}>
      <CardContent sx={{ p: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Quick actions
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Quick actions (dense list).
        </Typography>
        <List
          data-testid="listbox-quick-actions"
          dense
          sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}
        >
          {options.map((opt) => (
            <ListItem key={opt} sx={{ py: 0.5 }}>
              <ListItemText primary={opt} primaryTypographyProps={{ variant: 'body2' }} />
              <ListItemSecondaryAction>
                <Checkbox
                  edge="end"
                  size="small"
                  checked={selected.includes(opt)}
                  onChange={() => handleToggle(opt)}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
