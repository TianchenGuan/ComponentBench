'use client';

/**
 * autocomplete_freeform-mui-T05: Set the To airport when two fields exist
 *
 * setup_description:
 * A centered isolated card titled "Route" contains two MUI Autocomplete inputs stacked vertically.
 *
 * Instance labels:
 * - "From airport" (top)
 * - "To airport" (bottom)
 *
 * Both are configured with freeSolo and share the same options list (JFK - New York, LAX - Los Angeles, SFO - San Francisco, SEA - Seattle, BOS - Boston). The listbox opens under whichever field is focused.
 *
 * Initial state: From airport is prefilled with "SFO - San Francisco"; To airport is empty. Distractors: none. Feedback: chosen value appears in the focused input.
 *
 * Success: The Autocomplete labeled "To airport" has displayed value "JFK - New York" (trim whitespace). Case-sensitive.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Autocomplete, TextField, Card, CardContent, Typography, Stack } from '@mui/material';
import type { TaskComponentProps } from '../types';

const airports = [
  'JFK - New York',
  'LAX - Los Angeles',
  'SFO - San Francisco',
  'SEA - Seattle',
  'BOS - Boston',
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [fromValue, setFromValue] = useState('SFO - San Francisco');
  const [toValue, setToValue] = useState('');
  const successFired = useRef(false);

  const normalizedToValue = toValue.trim();
  const targetValue = 'JFK - New York';

  useEffect(() => {
    if (!successFired.current && normalizedToValue === targetValue) {
      successFired.current = true;
      onSuccess();
    }
  }, [normalizedToValue, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Route</Typography>
        <Stack spacing={2}>
          <div>
            <Typography variant="subtitle2" gutterBottom>From airport</Typography>
            <Autocomplete
              data-testid="from-airport"
              freeSolo
              options={airports}
              inputValue={fromValue}
              onInputChange={(_event, newValue) => setFromValue(newValue)}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select airport" size="small" />
              )}
            />
          </div>
          <div>
            <Typography variant="subtitle2" gutterBottom>To airport</Typography>
            <Autocomplete
              data-testid="to-airport"
              freeSolo
              options={airports}
              inputValue={toValue}
              onInputChange={(_event, newValue) => setToValue(newValue)}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select airport" size="small" />
              )}
            />
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
}
