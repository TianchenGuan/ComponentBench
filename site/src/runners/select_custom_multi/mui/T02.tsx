'use client';

/**
 * select_custom_multi-mui-T02: Clear all department chips
 *
 * Scene context: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1, guidance=text, clutter=none.
 * Layout: isolated card centered titled "Search filters".
 * Component: MUI Autocomplete (multiple) labeled "Departments".
 * Options: Sales, Support, Engineering, Design, Finance.
 * Initial state: three chips are already selected: Support, Engineering, Finance.
 * The input shows a clear-all icon (an 'x') at the end when it has focus (clearOnEscape disabled; clear icon enabled).
 * No other inputs are present.
 *
 * Success: The selected values are exactly: (empty) (order does not matter).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Autocomplete, TextField, Chip } from '@mui/material';
import type { TaskComponentProps } from '../types';

const options = ['Sales', 'Support', 'Engineering', 'Design', 'Finance'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['Support', 'Engineering', 'Finance']);

  useEffect(() => {
    if (selected.length === 0) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Search filters</Typography>
        <Autocomplete
          multiple
          data-testid="departments-select"
          options={options}
          value={selected}
          onChange={(_, newValue) => setSelected(newValue)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip label={option} {...getTagProps({ index })} key={option} />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} label="Departments" placeholder="Select departments" />
          )}
        />
      </CardContent>
    </Card>
  );
}
