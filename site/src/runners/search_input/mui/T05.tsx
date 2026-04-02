'use client';

/**
 * search_input-mui-T05: Type-to-filter and select a city (MUI Autocomplete)
 *
 * Isolated card centered in the viewport titled "Travel planner".
 * One MUI Autocomplete labeled "Destination city" with placeholder "Start typing…".
 * Options list contains 15 cities including: San Antonio, San Diego, San Francisco, Santa Fe, Seattle, etc.
 * Initial state: empty; popup closed until focus/typing.
 * Feedback: selecting an option fills the input and shows "Selected destination: San Diego" beneath.
 * No extra clutter.
 *
 * Success: The Autocomplete labeled "Destination city" has selected_option "San Diego" and value "San Diego".
 */

import React, { useState, useRef } from 'react';
import { Card, CardContent, Autocomplete, TextField, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';

const cities = [
  'San Antonio', 'San Diego', 'San Francisco', 'San Jose', 'Santa Fe',
  'Seattle', 'Salt Lake City', 'Sacramento', 'Savannah', 'Scottsdale',
  'St. Louis', 'St. Paul', 'Spokane', 'Syracuse', 'Stamford'
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);
  const hasSucceeded = useRef(false);

  const handleChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setValue(newValue);
    if (newValue === 'San Diego' && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Travel planner
        </Typography>
        <Autocomplete
          id="search-destination"
          options={cities}
          value={value}
          onChange={handleChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Destination city"
              placeholder="Start typing…"
              inputProps={{
                ...params.inputProps,
                'data-testid': 'search-destination',
              }}
            />
          )}
        />
        {value && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Selected destination: {value}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
