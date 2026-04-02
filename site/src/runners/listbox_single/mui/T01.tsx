'use client';

/**
 * listbox_single-mui-T01: Coffee roast: choose Dark roast
 *
 * Scene: light theme, comfortable spacing, isolated_card layout, placed at center of the viewport.
 * Component scale is default. Page contains 1 instance(s) of this listbox type; guidance is text; clutter is none.
 * A centered isolated card titled "Coffee roast" contains a Material UI List rendered as a vertical listbox.
 * Each option is a ListItemButton with a single-line label: "Light roast", "Medium roast", "Dark roast".
 * Exactly one option can be selected; the selected item uses the MUI selected state styling.
 * Initial selection is "Medium roast". No other controls are present.
 *
 * Success: Selected option value equals: dark
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, List, ListItemButton, ListItemText } from '@mui/material';
import type { TaskComponentProps } from '../types';

const options = [
  { value: 'light', label: 'Light roast' },
  { value: 'medium', label: 'Medium roast' },
  { value: 'dark', label: 'Dark roast' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('medium');

  const handleSelect = (value: string) => {
    setSelected(value);
    if (value === 'dark') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 360 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Coffee roast</Typography>
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
              <ListItemText primary={opt.label} />
            </ListItemButton>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
