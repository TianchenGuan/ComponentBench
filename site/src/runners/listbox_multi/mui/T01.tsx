'use client';

/**
 * listbox_multi-mui-T01: Meeting snacks selection
 *
 * Layout: isolated_card centered titled "Office meeting order".
 * Target component: a Material UI List where each ListItem contains a Checkbox and a text label (checkbox is the primary action).
 * Options (7): Chips, Trail mix, Fruit cups, Cookies, Pretzels, Granola bars, Popcorn.
 * Initial state: no items selected.
 * No overlays and no scrolling. No other checkbox lists on the page.
 * Feedback: the checkbox checkmark and ListItem selected styling update immediately.
 *
 * Success: The target listbox has exactly: Trail mix, Fruit cups, Pretzels.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
} from '@mui/material';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const options = [
  { value: 'Chips', label: 'Chips' },
  { value: 'Trail mix', label: 'Trail mix' },
  { value: 'Fruit cups', label: 'Fruit cups' },
  { value: 'Cookies', label: 'Cookies' },
  { value: 'Pretzels', label: 'Pretzels' },
  { value: 'Granola bars', label: 'Granola bars' },
  { value: 'Popcorn', label: 'Popcorn' },
];

const targetSet = ['Trail mix', 'Fruit cups', 'Pretzels'];

export default function T01({ onSuccess }: TaskComponentProps) {
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
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Office meeting order
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Snacks (choose multiple).
        </Typography>
        <List data-testid="listbox-snacks" sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
          {options.map((opt) => (
            <ListItem key={opt.value} disablePadding>
              <ListItemButton onClick={() => handleToggle(opt.value)} dense>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selected.includes(opt.value)}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-label': opt.label }}
                  />
                </ListItemIcon>
                <ListItemText primary={opt.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
