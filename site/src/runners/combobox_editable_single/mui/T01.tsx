'use client';

/**
 * combobox_editable_single-mui-T01: Select English as the UI language
 *
 * A single isolated card titled "Preferences" is centered in the viewport.
 * It contains one editable combobox labeled "Language" implemented with MUI Autocomplete.
 * - Scene: isolated_card layout, center placement, light theme, comfortable spacing, default scale.
 * - Component behavior: Clicking the input opens a popup list; selecting an option sets the input value.
 * - Options: English, Spanish, French, German.
 * - Initial state: empty.
 * - Distractors: none.
 *
 * Success: The "Language" combobox value equals "English".
 */

import React, { useState } from 'react';
import { Autocomplete, TextField, Card, CardContent, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';

const languages = ['English', 'Spanish', 'French', 'German'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  const handleChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setValue(newValue);
    if (newValue === 'English') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Preferences</Typography>
        <Typography variant="subtitle2" gutterBottom>Language</Typography>
        <Autocomplete
          data-testid="language-autocomplete"
          freeSolo
          options={languages}
          value={value}
          onChange={handleChange}
          inputValue={inputValue}
          onInputChange={(_event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          renderInput={(params) => (
            <TextField {...params} placeholder="Select language" size="small" />
          )}
        />
      </CardContent>
    </Card>
  );
}
