'use client';

/**
 * autocomplete_freeform-mui-T02: Select a country from the popup list
 *
 * setup_description:
 * A centered isolated card titled "Profile" contains a single MUI Autocomplete labeled "Country". It is configured with freeSolo so the user can type any country name, but a popup list of suggested countries is provided.
 *
 * The options list contains 10 common countries (Canada, United States, Mexico, Brazil, France, Germany, Japan, Australia, India, South Africa). The popup listbox opens when the input is focused or when typing begins.
 *
 * Initial state: empty input. Distractors: none. Feedback: selecting an option fills the input with the selected country name.
 *
 * Success: The "Country" Autocomplete input's displayed value equals "Canada" (trim whitespace).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Autocomplete, TextField, Card, CardContent, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';

const countries = [
  'Canada',
  'United States',
  'Mexico',
  'Brazil',
  'France',
  'Germany',
  'Japan',
  'Australia',
  'India',
  'South Africa',
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const successFired = useRef(false);

  // Check input value for the target
  const normalizedValue = inputValue.trim();
  const targetValue = 'Canada';

  useEffect(() => {
    if (!successFired.current && normalizedValue === targetValue) {
      successFired.current = true;
      onSuccess();
    }
  }, [normalizedValue, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Profile</Typography>
        <Typography variant="subtitle2" gutterBottom>Country</Typography>
        <Autocomplete
          data-testid="country"
          freeSolo
          options={countries}
          value={value}
          onChange={(_event, newValue) => setValue(newValue)}
          inputValue={inputValue}
          onInputChange={(_event, newValue) => setInputValue(newValue)}
          renderInput={(params) => (
            <TextField {...params} placeholder="Select country" size="small" />
          )}
        />
      </CardContent>
    </Card>
  );
}
