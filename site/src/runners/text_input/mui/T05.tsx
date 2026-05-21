'use client';

/**
 * text_input-mui-T05: Enter a valid support email (with helper text)
 * 
 * Scene is an isolated card centered in the viewport titled "Contact settings". It contains a single MUI
 * TextField labeled "Support email". The field uses MUI validation styling: when invalid, the TextField is
 * in error state and a helper text line says "Invalid email address". When valid, helper text changes to a
 * neutral hint ("We'll show this on your help page."). Initial value is "help@acme" (missing top-level
 * domain), so the field starts in an error state. No other text inputs exist and no confirmation button is required.
 * 
 * Success: The TextField labeled "Support email" has value exactly "help@acme.io" (trim whitespace), and
 * the field is not in an error state after entry (validation passes).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('help@acme');
  
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  const isValid = emailRegex.test(value.trim());

  useEffect(() => {
    if (value.trim() === 'help@acme.io' && isValid) {
      onSuccess();
    }
  }, [value, isValid, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Contact settings
        </Typography>
        <TextField
          label="Support email"
          variant="outlined"
          fullWidth
          value={value}
          onChange={(e) => setValue(e.target.value)}
          error={!isValid}
          helperText={isValid ? "We'll show this on your help page." : "Invalid email address"}
          inputProps={{ 
            'data-testid': 'support-email-input',
            'aria-invalid': !isValid
          }}
        />
      </CardContent>
    </Card>
  );
}
