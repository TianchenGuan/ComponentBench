'use client';

/**
 * search_input-mui-T03: Clear a prefilled MUI Autocomplete using the clear indicator
 *
 * Baseline isolated card centered in the viewport titled "Address".
 * Contains one MUI Autocomplete labeled "City search" with a preselected value "Austin".
 * The Autocomplete shows the built-in clear indicator (an ✕ icon button) when a value is present.
 * Feedback: clearing removes the selection chip and changes a helper text from "Selected: Austin" to "No city selected".
 * No other clutter.
 *
 * Success: The Autocomplete labeled "City search" has an empty input value (cleared).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Autocomplete, TextField, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';

const cities = ['Austin', 'Boston', 'Chicago', 'Denver', 'El Paso'];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>('Austin');
  const hasSucceeded = useRef(false);

  useEffect(() => {
    if (value === null && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Address
        </Typography>
        <Autocomplete
          id="search-city"
          options={cities}
          value={value}
          onChange={(_e, newValue) => setValue(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="City search"
              helperText={value ? `Selected: ${value}` : 'No city selected'}
              inputProps={{
                ...params.inputProps,
                'data-testid': 'search-city',
              }}
            />
          )}
        />
      </CardContent>
    </Card>
  );
}
