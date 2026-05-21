'use client';

/**
 * autocomplete_freeform-mui-T01: Type a freeSolo search term
 *
 * setup_description:
 * A centered isolated card titled "Quick Search" contains a single MUI Autocomplete configured with freeSolo so it accepts arbitrary text.
 *
 * The field label is "Search" and the placeholder reads "Type to search". A short suggestion list (giraffe, gorilla, gazelle, gibbon) appears in a popup listbox as the user types, but choosing a suggestion is not required.
 *
 * Initial state: the input is empty and the popup is closed. Distractors: none. Feedback: the typed value is immediately visible in the input.
 *
 * Success: The "Search" Autocomplete input's displayed value equals "giraffe" (case-insensitive, trimmed).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Autocomplete, TextField, Card, CardContent, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';

const options = ['giraffe', 'gorilla', 'gazelle', 'gibbon'];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [inputValue, setInputValue] = useState('');
  const successFired = useRef(false);

  const normalizedValue = inputValue.trim().toLowerCase();
  const targetValue = 'giraffe';

  useEffect(() => {
    if (!successFired.current && normalizedValue === targetValue) {
      successFired.current = true;
      onSuccess();
    }
  }, [normalizedValue, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Quick Search</Typography>
        <Typography variant="subtitle2" gutterBottom>Search</Typography>
        <Autocomplete
          data-testid="mui-search"
          freeSolo
          options={options}
          inputValue={inputValue}
          onInputChange={(_event, newValue) => setInputValue(newValue)}
          renderInput={(params) => (
            <TextField {...params} placeholder="Type to search" size="small" />
          )}
        />
      </CardContent>
    </Card>
  );
}
