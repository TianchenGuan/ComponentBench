'use client';

/**
 * combobox_editable_multi-mui-T03: Clear selected colors
 *
 * Centered isolated card titled "Palette".
 * - Component: Material UI Autocomplete with multiple selection enabled.
 * - Label: "Selected colors"
 * - Initial selected chips: Red, Green, Blue
 * - A clear indicator (×) button appears inside the input on the right when the field has a value (default behavior when disableClearable is false).
 * Behavior:
 * - Clicking the clear indicator removes all selected chips at once.
 * - Alternatively, chips can be removed individually.
 * No other controls are required for completion.
 *
 * Success: Selected values equal [] (empty).
 */

import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Card, CardContent, Typography, Chip } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const colors = ['Red', 'Green', 'Blue', 'Yellow', 'Purple', 'Orange', 'Pink', 'Brown'];

const TARGET_SET: string[] = [];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>(['Red', 'Green', 'Blue']);

  useEffect(() => {
    if (setsEqual(value, TARGET_SET)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Palette</Typography>
        <Typography variant="subtitle2" gutterBottom>Selected colors</Typography>
        <Autocomplete
          data-testid="selected-colors"
          multiple
          options={colors}
          value={value}
          onChange={(_event, newValue) => setValue(newValue)}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} placeholder="Select colors" size="small" />
          )}
        />
      </CardContent>
    </Card>
  );
}
