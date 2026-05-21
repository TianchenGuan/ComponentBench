'use client';

/**
 * autocomplete_freeform-mui-T07: Open the suggestions popup and keep it open
 *
 * setup_description:
 * A small isolated card is positioned near the top-right corner of the viewport. It contains one MUI Autocomplete labeled "Search" in freeSolo mode.
 *
 * The Autocomplete has a popup icon (dropdown arrow) and opens a listbox of suggestions when focused, when the popup icon is clicked, or when typing begins. Options include a few generic terms (alpha, beta, gamma, delta).
 *
 * Initial state: input is empty and the listbox is closed (aria-expanded=false). Distractors: none. Feedback: when opened, the listbox becomes visible under the input and aria-expanded becomes true.
 *
 * Success: The "Search" Autocomplete listbox/popup is open (e.g., input has aria-expanded=true and listbox is rendered). The input value remains empty.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Autocomplete, TextField, Card, CardContent, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';

const options = ['alpha', 'beta', 'gamma', 'delta'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const successFired = useRef(false);

  useEffect(() => {
    // Success when popup is open and input is empty
    if (!successFired.current && open && inputValue.trim() === '') {
      successFired.current = true;
      onSuccess();
    }
  }, [open, inputValue, onSuccess]);

  return (
    <Card sx={{ width: 300 }} data-testid="search-open-state">
      <CardContent>
        <Typography variant="h6" gutterBottom>Search</Typography>
        <Autocomplete
          data-testid="search-autocomplete"
          freeSolo
          options={options}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          inputValue={inputValue}
          onInputChange={(_event, newValue) => setInputValue(newValue)}
          renderInput={(params) => (
            <TextField {...params} placeholder="Search..." size="small" />
          )}
        />
      </CardContent>
    </Card>
  );
}
