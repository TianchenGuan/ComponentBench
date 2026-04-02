'use client';

/**
 * text_input-mui-T03: Clear website field
 * 
 * Scene is a centered isolated card titled "Company info". It contains one MUI TextField labeled "Website".
 * The field is pre-filled with "https://acme.io". There is no built-in clear icon; clearing is expected via
 * keyboard deletion or selecting and deleting text. No other text inputs or overlays are present.
 * 
 * Success: The TextField labeled "Website" has an empty value (after trimming).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('https://acme.io');

  useEffect(() => {
    if (value.trim() === '') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Company info
        </Typography>
        <TextField
          label="Website"
          variant="outlined"
          fullWidth
          value={value}
          onChange={(e) => setValue(e.target.value)}
          inputProps={{ 'data-testid': 'website-input' }}
        />
      </CardContent>
    </Card>
  );
}
