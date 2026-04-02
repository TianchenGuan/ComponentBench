'use client';

/**
 * text_input-mui-T02: Replace username value
 * 
 * Scene is an isolated card centered in the viewport titled "Account". It has one MUI TextField labeled
 * "Username" with an outlined style. The field is pre-filled with "john.doe". There are no other inputs or
 * overlays. A grey caption under the field says "This will appear in your profile URL."
 * 
 * Success: The TextField labeled "Username" has value "jdoe" (trim whitespace).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('john.doe');

  useEffect(() => {
    if (value.trim() === 'jdoe') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Account
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          value={value}
          onChange={(e) => setValue(e.target.value)}
          helperText="This will appear in your profile URL."
          inputProps={{ 'data-testid': 'username-input' }}
        />
      </CardContent>
    </Card>
  );
}
