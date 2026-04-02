'use client';

/**
 * select_with_search-mui-T01: Search and select a city: Boston
 *
 * Layout: isolated_card centered titled "Profile basics".
 * Component: one Material UI Autocomplete labeled "City" (single selection).
 * Interaction: the Autocomplete is a text field; focusing it and typing shows a popup list of matching cities below (Popper/listbox).
 * Options: New York, Boston, Chicago, Seattle, San Diego, San Jose, Austin, Miami.
 * Initial state: empty (no value selected). Clear icon is not shown until a value is chosen.
 * No other interactive elements on the card.
 *
 * Success: The "City" Autocomplete value equals "Boston".
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, Autocomplete, TextField } from '@mui/material';
import type { TaskComponentProps } from '../types';

const cityOptions = [
  'New York',
  'Boston',
  'Chicago',
  'Seattle',
  'San Diego',
  'San Jose',
  'Austin',
  'Miami',
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);

  const handleChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setValue(newValue);
    if (newValue === 'Boston') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Profile basics</Typography>
        <Autocomplete
          data-testid="city-autocomplete"
          options={cityOptions}
          value={value}
          onChange={handleChange}
          renderInput={(params) => (
            <TextField {...params} label="City" placeholder="Search cities..." />
          )}
        />
      </CardContent>
    </Card>
  );
}
