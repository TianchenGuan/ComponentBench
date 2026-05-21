'use client';

/**
 * listbox_single-mui-T05: Pick the item with the star badge
 *
 * Scene: light theme, comfortable spacing, isolated_card layout, placed at center of the viewport.
 * Component scale is default. Page contains 1 instance(s) of this listbox type; guidance is visual; clutter is low.
 * A centered isolated card titled "Plan" shows a small reference badge above a MUI List: a single star icon ⭐.
 * The listbox contains four ListItemButton options, each with a leading badge icon and label:
 * "Starter" (🟦), "Pro" (⭐), "Team" (👥), "Enterprise" (🏢). Only one can be selected.
 * Initial selection is "Starter". The goal is conveyed only by the badge icon reference.
 *
 * Success: Selected option value equals: pro (matching ⭐)
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, List, ListItemButton, ListItemText, ListItemIcon, Box, Chip } from '@mui/material';
import type { TaskComponentProps } from '../types';

const options = [
  { value: 'starter', label: 'Starter', icon: '🟦' },
  { value: 'pro', label: 'Pro', icon: '⭐' },
  { value: 'team', label: 'Team', icon: '👥' },
  { value: 'enterprise', label: 'Enterprise', icon: '🏢' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('starter');

  const handleSelect = (value: string) => {
    setSelected(value);
    if (value === 'pro') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 360 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Plan</Typography>

        {/* Reference badge */}
        <Box sx={{ mb: 2 }}>
          <Chip
            data-cb-reference-badge
            label="⭐"
            sx={{ fontSize: 18 }}
          />
        </Box>

        <List
          data-cb-listbox-root
          data-cb-selected-value={selected}
          sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}
        >
          {options.map(opt => (
            <ListItemButton
              key={opt.value}
              selected={selected === opt.value}
              onClick={() => handleSelect(opt.value)}
              data-cb-option-value={opt.value}
            >
              <ListItemIcon sx={{ minWidth: 40, fontSize: 20 }}>
                {opt.icon}
              </ListItemIcon>
              <ListItemText primary={opt.label} />
            </ListItemButton>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
