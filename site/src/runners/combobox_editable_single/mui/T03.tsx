'use client';

/**
 * combobox_editable_single-mui-T03: Clear the selected Country
 *
 * A single isolated card titled "Address" is centered in the viewport.
 * It contains one editable combobox labeled "Country" implemented with MUI Autocomplete.
 * - Scene: isolated_card, center placement, light theme, comfortable spacing, default scale.
 * - Component behavior: The Autocomplete shows a clear icon when a value is selected.
 * - Options: Canada, United States, Mexico, United Kingdom, France, Germany.
 * - Initial state: selected value "Canada".
 * - Distractors: none.
 *
 * Success: The "Country" combobox has no selected value and the input text is empty.
 */

import React, { useState } from 'react';
import { Autocomplete, TextField, Card, CardContent, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';

const countries = ['Canada', 'United States', 'Mexico', 'United Kingdom', 'France', 'Germany'];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>('Canada');
  const [inputValue, setInputValue] = useState('Canada');

  const handleChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setValue(newValue);
    if (newValue === null || newValue === '') {
      onSuccess();
    }
  };

  const handleInputChange = (_event: React.SyntheticEvent, newInputValue: string) => {
    setInputValue(newInputValue);
    if (newInputValue.trim() === '' && (value === null || value === '')) {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Address</Typography>
        <Typography variant="subtitle2" gutterBottom>Country</Typography>
        <Autocomplete
          data-testid="country-autocomplete"
          freeSolo
          options={countries}
          value={value}
          onChange={handleChange}
          inputValue={inputValue}
          onInputChange={handleInputChange}
          renderInput={(params) => (
            <TextField {...params} placeholder="Select country" size="small" />
          )}
        />
      </CardContent>
    </Card>
  );
}
