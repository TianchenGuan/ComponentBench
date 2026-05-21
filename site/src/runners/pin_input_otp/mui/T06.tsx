'use client';

/**
 * pin_input_otp-mui-T16: Enter code shown in authenticator screenshot (visual)
 * 
 * A centered isolated card titled "Authenticator app". On the left is an OTP input
 * labeled "Authenticator code" built from six small MUI TextFields. On the right
 * is a non-interactive "Authenticator preview" image that looks like a small app
 * screen; it displays a 6-digit code in large digits. Initial state: OTP empty.
 * 
 * Success: Target OTP value equals '991274'.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, TextField, Box, Paper } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [values, setValues] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const targetCode = '991274';

  const concatenatedValue = values.join('');

  useEffect(() => {
    if (concatenatedValue === targetCode) {
      onSuccess();
    }
  }, [concatenatedValue, onSuccess]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <Card sx={{ width: 540 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Authenticator app
        </Typography>
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
          {/* OTP Input */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Authenticator code
            </Typography>
            <Box data-testid="otp-authenticator-code" sx={{ display: 'flex', gap: 0.5 }}>
              {values.map((val, index) => (
                <TextField
                  key={index}
                  inputRef={(el) => (inputRefs.current[index] = el)}
                  value={val}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  variant="outlined"
                  size="small"
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: 'center', width: 28, padding: '8px 0' },
                    'data-otp-index': index,
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Authenticator preview */}
          <Paper
            elevation={2}
            sx={{
              bgcolor: '#1a1a2e',
              borderRadius: 3,
              p: 2,
              minWidth: 140,
              textAlign: 'center',
            }}
            data-testid="authenticator-preview-image"
          >
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mb: 0.5 }}>
              Authenticator preview
            </Typography>
            <Box
              sx={{
                bgcolor: '#16213e',
                borderRadius: 1,
                py: 1,
                px: 2,
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'monospace',
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: 3,
                  color: '#4cc9f0',
                  userSelect: 'none',
                }}
              >
                {targetCode}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', mt: 0.5, display: 'block' }}>
              29s remaining
            </Typography>
          </Paper>
        </Box>
      </CardContent>
    </Card>
  );
}
