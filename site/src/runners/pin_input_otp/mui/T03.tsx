'use client';

/**
 * pin_input_otp-mui-T13: Clear partially filled OTP to empty
 * 
 * A centered isolated card titled "Enter verification code". A 6-field OTP input
 * (MUI TextField composite) is shown under the label "Verification code".
 * Initial state: the first three fields are prefilled (1, 2, 0) and remaining three
 * are empty. User must delete values using keyboard actions. No confirm button.
 * 
 * Success: All 6 inputs are empty (concatenated value is '').
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, TextField, Box } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [values, setValues] = useState<string[]>(['1', '2', '0', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const concatenatedValue = values.join('');

  useEffect(() => {
    if (concatenatedValue === '') {
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
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Enter verification code
        </Typography>
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
                style: { textAlign: 'center', width: 32, padding: '8px 0' },
                'data-otp-index': index,
              }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
