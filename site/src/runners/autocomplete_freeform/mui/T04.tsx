'use client';

/**
 * autocomplete_freeform-mui-T04: Enter a formatted email into freeSolo autocomplete
 *
 * setup_description:
 * A centered isolated card titled "Invite" contains one MUI Autocomplete labeled "Contact email". It is configured in freeSolo mode to allow typing any email address, while still showing suggestions for common domains (e.g., gmail.com, outlook.com).
 *
 * A helper text under the field says "Use a valid email address". The component shows a red error state if the text does not look like an email when the input loses focus.
 *
 * Initial state: empty input, no error. Distractors: none. Feedback: the full email string is visible in the input; on blur, the error indicator appears/disappears based on formatting.
 *
 * Success: The "Contact email" Autocomplete input's displayed value equals "alex.jordan@example.com" exactly (trim whitespace).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Autocomplete, TextField, Card, CardContent, Typography, FormHelperText } from '@mui/material';
import type { TaskComponentProps } from '../types';

const emailSuggestions = [
  'alex.jordan@gmail.com',
  'alex.jordan@outlook.com',
  'alex.jordan@example.com',
  'alex.jordan@yahoo.com',
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [inputValue, setInputValue] = useState('');
  const [hasError, setHasError] = useState(false);
  const successFired = useRef(false);

  const normalizedValue = inputValue.trim();
  const targetValue = 'alex.jordan@example.com';

  useEffect(() => {
    if (!successFired.current && normalizedValue === targetValue) {
      successFired.current = true;
      onSuccess();
    }
  }, [normalizedValue, onSuccess]);

  const handleBlur = () => {
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setHasError(inputValue.length > 0 && !emailRegex.test(inputValue));
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Invite</Typography>
        <Typography variant="subtitle2" gutterBottom>Contact email</Typography>
        <Autocomplete
          data-testid="contact-email"
          freeSolo
          options={emailSuggestions}
          inputValue={inputValue}
          onInputChange={(_event, newValue) => setInputValue(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Enter email"
              size="small"
              error={hasError}
              onBlur={handleBlur}
            />
          )}
        />
        <FormHelperText error={hasError}>
          {hasError ? 'Please enter a valid email address' : 'Use a valid email address'}
        </FormHelperText>
      </CardContent>
    </Card>
  );
}
