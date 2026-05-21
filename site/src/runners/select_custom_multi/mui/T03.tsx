'use client';

/**
 * select_custom_multi-mui-T03: Create a custom chip (On-call)
 *
 * Scene context: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1, guidance=text, clutter=none.
 * Layout: isolated card centered titled "Shift assignment".
 * Component: MUI Autocomplete configured for multiple selections with freeSolo enabled (users can create new chip values by typing and pressing Enter).
 * Label: "Labels".
 * Dropdown options (3): Full-time, Part-time, Contractor.
 * Initial state: empty.
 * Behavior: typing shows matching suggestions; pressing Enter creates the current input as a new chip if it does not match an existing option.
 * No other UI elements are present.
 *
 * Success: The selected values are exactly: Full-time, On-call (order does not matter).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Autocomplete, TextField, Chip } from '@mui/material';
import type { TaskComponentProps } from '../types';

const defaultOptions = ['Full-time', 'Part-time', 'Contractor'];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const targetSet = new Set(['Full-time', 'On-call']);
    const currentSet = new Set(selected);
    if (currentSet.size === targetSet.size && Array.from(targetSet).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Shift assignment</Typography>
        <Autocomplete
          multiple
          freeSolo
          data-testid="labels-select"
          options={defaultOptions}
          value={selected}
          onChange={(_, newValue) => setSelected(newValue as string[])}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip label={option} {...getTagProps({ index })} key={option} />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} label="Labels" placeholder="Add labels" />
          )}
        />
      </CardContent>
    </Card>
  );
}
