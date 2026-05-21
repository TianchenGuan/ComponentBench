'use client';

/**
 * pin_input_otp-mui-T11: Enter 5-digit login code (MUI OTP, length 5)
 * 
 * A centered isolated card titled "Sign in". Under the label "Login code" is an OTP
 * input composed of five small MUI TextField inputs (outlined variant) laid out
 * horizontally. A thin dash separator is rendered between the 2nd and 3rd field.
 * Each field accepts a single character and auto-advances focus.
 * Initial state: all fields empty. No other interactive elements.
 * 
 * Success: Target OTP value equals '54821' with length 5.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, TextField, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [values, setValues] = useState<string[]>(['', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const concatenatedValue = values.join('');

  useEffect(() => {
    if (concatenatedValue === '54821') {
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

    // Auto-advance
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <Card sx={{ width: 380 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Sign in
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
          Login code
        </Typography>
        <Box data-testid="otp-login-code" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {values.map((val, index) => (
            <React.Fragment key={index}>
              <TextField
                inputRef={(el) => (inputRefs.current[index] = el)}
                value={val}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                variant="outlined"
                size="small"
                inputProps={{
                  maxLength: 1,
                  style: { textAlign: 'center', width: 32, padding: '8px 0' },
                  'data-otp-index': index,
                }}
              />
              {index === 1 && (
                <Typography sx={{ mx: 0.5, color: 'text.secondary' }}>–</Typography>
              )}
            </React.Fragment>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
