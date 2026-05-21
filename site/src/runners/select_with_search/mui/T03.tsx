'use client';

/**
 * select_with_search-mui-T03: Clear the selected language
 *
 * Layout: isolated_card centered titled "Preferences".
 * Component: one MUI Autocomplete labeled "Language" (single selection) with the standard clear icon enabled.
 * Options: English, Spanish, French, German, Japanese.
 * Initial state: "English" is selected.
 * Interaction: the clear icon (an "x") appears inside the input when a value is selected; clicking it clears the selection and returns the placeholder "Choose language".
 * No other interactive elements are present.
 *
 * Success: The "Language" Autocomplete has no selected value (empty / null).
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, Autocomplete, TextField } from '@mui/material';
import type { TaskComponentProps } from '../types';

const languageOptions = ['English', 'Spanish', 'French', 'German', 'Japanese'];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>('English');

  const handleChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setValue(newValue);
    if (newValue === null) {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Preferences</Typography>
        <Autocomplete
          data-testid="language-autocomplete"
          options={languageOptions}
          value={value}
          onChange={handleChange}
          renderInput={(params) => (
            <TextField {...params} label="Language" placeholder="Choose language" />
          )}
        />
      </CardContent>
    </Card>
  );
}
