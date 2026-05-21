'use client';

/**
 * pin_input_otp-mui-T20: Restricted-digit OTP with validation feedback
 * 
 * A centered isolated card titled "Enter restricted code". The target is a 6-field
 * OTP input with custom validation: each field only accepts digits 0–3, and invalid
 * characters are ignored and briefly show an inline error state.
 * Initial state: first field focused but empty. No confirm button.
 * 
 * Success: Target OTP value equals '301230' (only digits 0-3).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, TextField, Box, FormHelperText } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [values, setValues] = useState<string[]>(['', '', '', '', '', '']);
  const [errors, setErrors] = useState<boolean[]>([false, false, false, false, false, false]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const concatenatedValue = values.join('');

  useEffect(() => {
    if (concatenatedValue === '301230') {
      onSuccess();
    }
  }, [concatenatedValue, onSuccess]);

  // Auto-focus first field on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only accept digits 0-3
    if (value.length > 1) {
      value = value.slice(-1);
    }

    // Validate: only digits 0-3
    if (value && !/^[0-3]$/.test(value)) {
      // Show error briefly
      const newErrors = [...errors];
      newErrors[index] = true;
      setErrors(newErrors);
      
      setTimeout(() => {
        setErrors(prev => {
          const updated = [...prev];
          updated[index] = false;
          return updated;
        });
      }, 1000);
      
      return; // Reject invalid input
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

  const hasError = errors.some(e => e);

  return (
    <Card sx={{ width: 420 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Enter restricted code
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
          Restricted code
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          Only digits 0–3 are allowed
        </Typography>
        <Box data-testid="otp-restricted-code" sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
          {values.map((val, index) => (
            <TextField
              key={index}
              inputRef={(el) => (inputRefs.current[index] = el)}
              value={val}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              variant="outlined"
              size="small"
              error={errors[index]}
              inputProps={{
                maxLength: 1,
                style: { textAlign: 'center', width: 32, padding: '8px 0' },
                'data-otp-index': index,
              }}
            />
          ))}
        </Box>
        {hasError && (
          <FormHelperText error>Only 0–3 allowed</FormHelperText>
        )}
      </CardContent>
    </Card>
  );
}
