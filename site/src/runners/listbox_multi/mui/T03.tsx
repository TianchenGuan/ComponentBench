'use client';

/**
 * listbox_multi-mui-T03: Clear selected labels
 *
 * Layout: isolated_card centered titled "Issue labels".
 * Target component: a checkbox listbox labeled "Labels" built with a MUI List.
 * A small text button labeled "Clear selected" appears in the list header row (inside the card, directly above the list).
 * Options (8): Bug, Feature, Documentation, Security, Performance, Accessibility, UI, Backend.
 * Initial state: Bug, UI, and Performance are preselected (checked).
 * No overlays and no scrolling.
 * Feedback: clearing updates checkmarks immediately; a helper text below reads "0 selected" when cleared.
 *
 * Success: The target listbox has no selected items (all options are unchecked).
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
  Button,
  Box,
} from '@mui/material';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const options = ['Bug', 'Feature', 'Documentation', 'Security', 'Performance', 'Accessibility', 'UI', 'Backend'];
const targetSet: string[] = [];
const initialSelected = ['Bug', 'UI', 'Performance'];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected);
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

  const handleClear = () => {
    setSelected([]);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Issue labels
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Labels (you can clear selected labels).
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2">Labels</Typography>
          <Button size="small" onClick={handleClear}>
            Clear selected
          </Button>
        </Box>
        <List data-testid="listbox-labels" sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}>
          {options.map((opt) => (
            <ListItem key={opt} disablePadding>
              <ListItemButton onClick={() => handleToggle(opt)} dense>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selected.includes(opt)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText primary={opt} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {selected.length} selected
        </Typography>
      </CardContent>
    </Card>
  );
}
