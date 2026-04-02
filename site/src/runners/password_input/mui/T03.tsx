'use client';

/**
 * password_input-mui-T03: Clear a pre-filled password (clear adornment)
 * 
 * A centered card titled "One-time passphrase" contains one MUI TextField labeled "One-time passphrase".
 * It is configured as type=password and starts pre-filled. An endAdornment IconButton with an "X"
 * (clear) icon appears inside the field; clicking it clears the value to empty.
 * No other fields or Save buttons are present.
 * 
 * Success: The TextField labeled "One-time passphrase" has an empty string value.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, InputAdornment, IconButton, Typography } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('TempCode@789');

  useEffect(() => {
    if (value === '') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          One-time passphrase
        </Typography>
        <TextField
          label="One-time passphrase"
          type="password"
          variant="outlined"
          fullWidth
          value={value}
          onChange={(e) => setValue(e.target.value)}
          InputProps={{
            endAdornment: value && (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setValue('')}
                  edge="end"
                  size="small"
                  data-testid="clear-one-time"
                  aria-label="Clear password"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          inputProps={{ 'data-testid': 'one-time-passphrase-input' }}
        />
      </CardContent>
    </Card>
  );
}
