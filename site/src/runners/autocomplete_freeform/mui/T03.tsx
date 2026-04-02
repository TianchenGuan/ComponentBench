'use client';

/**
 * autocomplete_freeform-mui-T03: Clear a selected assignee
 *
 * setup_description:
 * A centered isolated card titled "Task" contains one MUI Autocomplete labeled "Assignee". It is configured with freeSolo and uses the default clear indicator (an X icon) when a value is present.
 *
 * Initial state: the input displays "Mia" and the clear icon is visible inside the input on the right. A suggestion list of names exists but is not necessary.
 *
 * There are no other interactive elements. Feedback: clearing removes the text and the clear icon disappears.
 *
 * Success: The "Assignee" Autocomplete input's displayed value is empty (after trimming whitespace).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Autocomplete, TextField, Card, CardContent, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';

const assignees = ['Mia', 'Emma', 'Noah', 'Liam', 'Olivia'];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>('Mia');
  const [inputValue, setInputValue] = useState('Mia');
  const successFired = useRef(false);

  const normalizedValue = inputValue.trim();

  useEffect(() => {
    if (!successFired.current && normalizedValue === '') {
      successFired.current = true;
      onSuccess();
    }
  }, [normalizedValue, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Task</Typography>
        <Typography variant="subtitle2" gutterBottom>Assignee</Typography>
        <Autocomplete
          data-testid="assignee"
          freeSolo
          options={assignees}
          value={value}
          onChange={(_event, newValue) => setValue(newValue)}
          inputValue={inputValue}
          onInputChange={(_event, newValue) => setInputValue(newValue)}
          renderInput={(params) => (
            <TextField {...params} placeholder="Select assignee" size="small" />
          )}
        />
      </CardContent>
    </Card>
  );
}
