'use client';

/**
 * combobox_editable_multi-mui-T01: Pick two fruits
 *
 * Centered isolated card titled "Preferences". The card contains one Material UI Autocomplete configured for multiple selection.
 * - Label: "Favorite fruits"
 * - Placeholder: "Choose fruits"
 * - Options list contains ~10 fruits (Apple, Banana, Orange, Grape, Mango, etc.).
 * - Initial state: empty (no chips selected).
 * Interaction:
 * - Clicking into the input opens a dropdown list (popper) of options.
 * - Clicking an option adds it as a chip inside the input.
 * No other fields on the card.
 *
 * Success: Selected values equal {Apple, Banana} (order-insensitive).
 */

import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Card, CardContent, Typography, Chip } from '@mui/material';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const fruits = ['Apple', 'Banana', 'Orange', 'Grape', 'Mango', 'Pineapple', 'Strawberry', 'Blueberry', 'Peach', 'Cherry'];

const TARGET_SET = ['Apple', 'Banana'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    if (setsEqual(value, TARGET_SET)) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Preferences</Typography>
        <Typography variant="subtitle2" gutterBottom>Favorite fruits</Typography>
        <Autocomplete
          data-testid="favorite-fruits"
          multiple
          options={fruits}
          value={value}
          onChange={(_event, newValue) => setValue(newValue)}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
            ))
          }
          renderInput={(params) => (
            <TextField {...params} placeholder="Choose fruits" size="small" />
          )}
        />
      </CardContent>
    </Card>
  );
}
