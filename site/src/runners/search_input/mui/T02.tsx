'use client';

/**
 * search_input-mui-T02: MUI Autocomplete: open dropdown and pick a recent query
 *
 * Baseline isolated card centered in the viewport titled "Analytics".
 * Contains one MUI Autocomplete labeled "Quick range". It behaves like a search input with suggestions: focusing the input opens a popup list.
 * Options (5): Today, Yesterday, This week, This month, Custom….
 * Initial state: empty; popup closed.
 * Feedback: selecting an option sets the input value and shows a small chip under the field: "Range preset: This week".
 * No other controls are required.
 *
 * Success: The MUI Autocomplete labeled "Quick range" has selected_option and value equal to "This week".
 */

import React, { useState, useRef } from 'react';
import { Card, CardContent, Autocomplete, TextField, Typography, Chip } from '@mui/material';
import type { TaskComponentProps } from '../types';

const options = ['Today', 'Yesterday', 'This week', 'This month', 'Custom…'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);
  const hasSucceeded = useRef(false);

  const handleChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setValue(newValue);
    if (newValue === 'This week' && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Analytics
        </Typography>
        <Autocomplete
          id="search-range"
          options={options}
          value={value}
          onChange={handleChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Quick range"
              placeholder="Select…"
              inputProps={{
                ...params.inputProps,
                'data-testid': 'search-range',
              }}
            />
          )}
        />
        {value && (
          <Chip
            label={`Range preset: ${value}`}
            color="primary"
            size="small"
            sx={{ mt: 1 }}
          />
        )}
      </CardContent>
    </Card>
  );
}
