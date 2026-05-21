'use client';

/**
 * pin_input_otp-mui-T12: Enter code with mixed guidance (text + reference panel)
 * 
 * A centered isolated card titled "Verify your email". The main target is a 6-field
 * OTP input built from small MUI TextFields with auto-advance. To the right of the
 * OTP is a non-interactive "Reference code" panel that also displays 120983 in large
 * monospace digits. Initial state: OTP empty. No confirm button.
 * 
 * Success: Target OTP value equals '120983' with length 6.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, TextField, Box, Paper } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [values, setValues] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const targetCode = '120983';

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
    <Card sx={{ width: 520 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Verify your email
        </Typography>
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
          {/* OTP Input */}
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Verification code
            </Typography>
            <Box data-testid="otp-verification-code" sx={{ display: 'flex', gap: 0.5 }}>
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

          {/* Reference panel */}
          <Paper
            elevation={0}
            sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 2, flexShrink: 0 }}
            data-testid="reference-code-panel"
          >
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Reference code
            </Typography>
            <Typography
              sx={{
                fontFamily: 'monospace',
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: 2,
                color: 'primary.main',
              }}
            >
              {targetCode}
            </Typography>
          </Paper>
        </Box>
      </CardContent>
    </Card>
  );
}
