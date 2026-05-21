'use client';

/**
 * password_input-mui-T02: Reveal a password using an end-adornment toggle (small)
 * 
 * A centered card titled "Security check" contains one MUI OutlinedInput labeled "Password"
 * in a small size (reduced height). The input starts pre-filled and masked. An eye IconButton
 * is rendered as an endAdornment inside the input; clicking it toggles the input type between
 * password (masked) and text (revealed).
 * There are no other inputs or confirmation buttons.
 * 
 * Success: The password field is in the revealed state (input type is text / characters are visible).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, Typography } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [showPassword, setShowPassword] = useState(false);
  const prefilledValue = 'HiddenSecret!42';

  useEffect(() => {
    if (showPassword) {
      onSuccess();
    }
  }, [showPassword, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Security check
        </Typography>
        <FormControl fullWidth variant="outlined" size="small">
          <InputLabel htmlFor="password-input">Password</InputLabel>
          <OutlinedInput
            id="password-input"
            type={showPassword ? 'text' : 'password'}
            value={prefilledValue}
            readOnly
            label="Password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  size="small"
                  data-testid="password-visibility-toggle"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            inputProps={{ 'data-testid': 'password-input' }}
          />
        </FormControl>
      </CardContent>
    </Card>
  );
}
