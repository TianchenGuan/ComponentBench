'use client';

/**
 * autocomplete_restricted-mui-T01: Fruit autocomplete (basic)
 *
 * setup_description:
 * The page shows a centered isolated card titled "Quick survey".
 *
 * There is one Material UI Autocomplete labeled **Favorite fruit** with placeholder "Choose one".
 * - Theme: light; spacing: comfortable; size: default.
 * - This is the restricted mode (freeSolo is false): the stored value must come from the provided options.
 * - Initial state: empty (no selection).
 * - Options list (8 items): Apple, Banana, Cherry, Grape, Mango, Orange, Peach, Strawberry.
 * - The Autocomplete has the standard popup indicator (dropdown arrow) and will also open when the input is focused.
 * - Selecting an option immediately fills the input; no separate Save button.
 *
 * No other controls are on the page (clutter = none).
 *
 * Success: The "Favorite fruit" Autocomplete has selected value "Mango".
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import type { TaskComponentProps } from '../types';

const fruits = ['Apple', 'Banana', 'Cherry', 'Grape', 'Mango', 'Orange', 'Peach', 'Strawberry'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);

  const handleChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setValue(newValue);
    if (newValue === 'Mango') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Quick survey
        </Typography>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Favorite fruit
        </Typography>
        <Autocomplete
          data-testid="fruit-autocomplete"
          options={fruits}
          value={value}
          onChange={handleChange}
          renderInput={(params) => (
            <TextField {...params} placeholder="Choose one" size="small" />
          )}
          freeSolo={false}
        />
      </CardContent>
    </Card>
  );
}
