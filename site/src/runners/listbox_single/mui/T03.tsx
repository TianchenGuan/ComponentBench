'use client';

/**
 * listbox_single-mui-T03: Shipping method: clear selection
 *
 * Scene: light theme, comfortable spacing, isolated_card layout, placed at center of the viewport.
 * Component scale is default. Page contains 1 instance(s) of this listbox type; guidance is text; clutter is low.
 * A centered isolated card titled "Shipping method" contains a MUI List styled as a single-select listbox
 * with four options: "Standard", "Express", "Overnight", "Pickup". The "Express" item is initially selected.
 * Above the list is a small MUI Button labeled "Clear" that resets the listbox to an empty selection;
 * when cleared, no item is highlighted and a caption below the list reads "No shipping method selected".
 *
 * Success: Selected option value equals: null (no selection)
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, List, ListItemButton, ListItemText, Button, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

const options = [
  { value: 'standard', label: 'Standard' },
  { value: 'express', label: 'Express' },
  { value: 'overnight', label: 'Overnight' },
  { value: 'pickup', label: 'Pickup' },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string | null>('express');

  const handleSelect = (value: string) => {
    setSelected(value);
  };

  const handleClear = () => {
    setSelected(null);
    onSuccess();
  };

  return (
    <Card sx={{ width: 360 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Shipping method</Typography>
          <Button size="small" onClick={handleClear}>Clear</Button>
        </Box>

        <List
          data-cb-listbox-root
          data-cb-selected-value={selected || 'null'}
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

        {selected === null && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
            No shipping method selected
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
