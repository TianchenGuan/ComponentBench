'use client';

/**
 * text_input-mui-T10: Enter admin PIN in dark compact card
 * 
 * Scene is an isolated card centered in the viewport with a dark theme and compact spacing. The card is
 * titled "Admin access" and contains a single MUI TextField labeled "Admin PIN". The TextField uses
 * type=password, so typed characters are masked (•). An optional visibility toggle icon appears as an input
 * adornment on the right, but using it is not required. Initial value is empty. No other text inputs,
 * overlays, or confirmation buttons exist.
 * 
 * Success: The TextField labeled "Admin PIN" has underlying value exactly "R3d-Fox9" (case-sensitive; trim whitespace).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Typography, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (value.trim() === 'R3d-Fox9') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ 
      width: 350, 
      bgcolor: '#1e1e1e', 
      '& .MuiCardContent-root': { p: 2 }
    }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
          Admin access
        </Typography>
        <TextField
          label="Admin PIN"
          variant="outlined"
          fullWidth
          size="small"
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  size="small"
                  sx={{ color: '#999' }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
            sx: { color: '#fff', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' } }
          }}
          InputLabelProps={{ sx: { color: '#999' } }}
          inputProps={{ 'data-testid': 'admin-pin-input' }}
        />
      </CardContent>
    </Card>
  );
}
