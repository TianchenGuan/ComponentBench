'use client';

/**
 * password_input-mui-T01: Enter a sign-in password (TextField)
 * 
 * A centered "Sign in" card contains a single MUI TextField labeled "Password". The TextField
 * uses type=password so typed characters are masked. The field starts empty.
 * No show/hide toggle is provided in this simplest configuration and there are no submit buttons.
 * 
 * Success: The TextField labeled "Password" has value exactly "Sunrise_2026".
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value === 'Sunrise_2026') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Sign in
        </Typography>
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          value={value}
          onChange={(e) => setValue(e.target.value)}
          inputProps={{ 'data-testid': 'password-input' }}
        />
      </CardContent>
    </Card>
  );
}
