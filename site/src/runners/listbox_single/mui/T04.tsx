'use client';

/**
 * listbox_single-mui-T04: Payment methods: set Primary to Card
 *
 * Scene: light theme, comfortable spacing, form_section layout, placed at center of the viewport.
 * Component scale is default. Page contains 2 instance(s) of this listbox type; guidance is text; clutter is low.
 * A form_section layout shows two stacked cards. The first card is labeled "Primary payment method" and contains
 * a single-select MUI List with options "Card", "Bank transfer", "PayPal", initial selection "PayPal".
 * The second card is labeled "Backup payment method" with the same options, initial selection "Card".
 * Each list uses ListItemButton selected styling. The task target is the first list labeled "Primary payment method".
 *
 * Success: Selected option value equals: card (in Primary payment method)
 * require_correct_instance: true
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, List, ListItemButton, ListItemText, Stack } from '@mui/material';
import type { TaskComponentProps } from '../types';

const options = [
  { value: 'card', label: 'Card' },
  { value: 'bank_transfer', label: 'Bank transfer' },
  { value: 'paypal', label: 'PayPal' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [primarySelected, setPrimarySelected] = useState<string>('paypal');
  const [backupSelected, setBackupSelected] = useState<string>('card');

  const handlePrimarySelect = (value: string) => {
    setPrimarySelected(value);
    if (value === 'card') {
      onSuccess();
    }
  };

  const handleBackupSelect = (value: string) => {
    setBackupSelected(value);
  };

  return (
    <Stack spacing={3} sx={{ width: 360 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Primary payment method</Typography>
          <List
            data-cb-listbox-root
            data-cb-instance="primary"
            data-cb-selected-value={primarySelected}
            sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}
          >
            {options.map(opt => (
              <ListItemButton
                key={opt.value}
                selected={primarySelected === opt.value}
                onClick={() => handlePrimarySelect(opt.value)}
                data-cb-option-value={opt.value}
              >
                <ListItemText primary={opt.label} />
              </ListItemButton>
            ))}
          </List>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Backup payment method</Typography>
          <List
            data-cb-listbox-root
            data-cb-instance="backup"
            data-cb-selected-value={backupSelected}
            sx={{ border: '1px solid #e0e0e0', borderRadius: 1 }}
          >
            {options.map(opt => (
              <ListItemButton
                key={opt.value}
                selected={backupSelected === opt.value}
                onClick={() => handleBackupSelect(opt.value)}
                data-cb-option-value={opt.value}
              >
                <ListItemText primary={opt.label} />
              </ListItemButton>
            ))}
          </List>
        </CardContent>
      </Card>
    </Stack>
  );
}
