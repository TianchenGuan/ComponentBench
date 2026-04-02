'use client';

/**
 * select_custom_multi-mui-T05: Mixed guidance: one explicit + two from suggestion chips
 *
 * Scene context: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1, guidance=mixed, clutter=low.
 * Layout: isolated card centered titled "Label helper".
 * At the top of the card there is a non-interactive "Suggested labels" area that shows two chips (the visual reference).
 * Below it is a MUI Autocomplete (multiple, freeSolo) labeled "Labels".
 * Dropdown options (10): Priority, Internal, Customer-facing, Finance, Legal, Engineering, Marketing, Support, Urgent, Low.
 * Initial state: empty.
 * No Save button; selecting options adds chips immediately.
 *
 * Success: The selected values are exactly: Priority, Internal, Customer-facing (order does not matter).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Autocomplete, TextField, Chip, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

const options = [
  'Priority', 'Internal', 'Customer-facing', 'Finance', 'Legal',
  'Engineering', 'Marketing', 'Support', 'Urgent', 'Low'
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const targetSet = new Set(['Priority', 'Internal', 'Customer-facing']);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Label helper</Typography>
        
        <Box sx={{ mb: 2, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
            Suggested labels
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip label="Internal" size="small" />
            <Chip label="Customer-facing" size="small" />
          </Box>
        </Box>

        <Autocomplete
          multiple
          freeSolo
          data-testid="labels-select"
          options={options}
          value={selected}
          onChange={(_, newValue) => setSelected(newValue as string[])}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip label={option} {...getTagProps({ index })} key={option} />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} label="Labels" placeholder="Select labels" />
          )}
        />
      </CardContent>
    </Card>
  );
}
