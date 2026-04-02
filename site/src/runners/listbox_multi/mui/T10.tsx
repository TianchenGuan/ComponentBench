'use client';

/**
 * listbox_multi-mui-T10: Drawer: match advanced tags
 *
 * Layout: drawer_flow. The main page has a button labeled "Advanced tags".
 * Clicking it opens a right-side Drawer. Inside the drawer, near the top, is a small row labeled "Required tags" showing 3 chips.
 * Below the chips is the target component: a checkbox listbox titled "Tags", implemented as a MUI List.
 * Options (25): Security, Performance, Accessibility, UX, Reliability, Infra, Compliance, Billing, Analytics, Localization, …
 * Initial state: none selected.
 * No explicit Apply button; selecting checkboxes updates a "Selected tags" summary immediately within the drawer.
 *
 * Success: The target listbox has exactly: Security, Performance, Accessibility.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Chip,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const referenceChips = ['Security', 'Performance', 'Accessibility'];

const options = [
  'Security', 'Performance', 'Accessibility', 'UX', 'Reliability', 'Infra',
  'Compliance', 'Billing', 'Analytics', 'Localization', 'Testing', 'DevOps',
  'Documentation', 'API', 'Frontend', 'Backend', 'Mobile', 'Database',
  'Networking', 'Caching', 'Monitoring', 'Logging', 'Auth', 'Payments', 'Notifications',
];

const targetSet = referenceChips;

export default function T10({ onSuccess }: TaskComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
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
    <>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tag Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Advanced tags (open drawer and match Required tags).
          </Typography>
          <Button variant="contained" onClick={() => setIsOpen(true)}>
            Advanced tags
          </Button>
        </CardContent>
      </Card>

      <Drawer anchor="right" open={isOpen} onClose={() => setIsOpen(false)}>
        <Box sx={{ width: 360, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ flex: 1 }}>
              Advanced tags
            </Typography>
            <IconButton size="small" onClick={() => setIsOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ mb: 2, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Required tags
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {referenceChips.map((chip) => (
                <Chip key={chip} label={chip} size="small" color="primary" />
              ))}
            </Box>
          </Box>

          <Typography variant="subtitle2" gutterBottom>
            Tags
          </Typography>
          <List
            data-testid="listbox-tags"
            sx={{ border: '1px solid #e0e0e0', borderRadius: 1, maxHeight: 350, overflow: 'auto' }}
          >
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
            Selected tags: {selected.join(', ') || 'None'}
          </Typography>
        </Box>
      </Drawer>
    </>
  );
}
