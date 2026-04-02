'use client';

/**
 * pin_input_otp-mui-T15: OTP inside a right-side drawer
 * 
 * A page with a link-style button "Enter verification code" near the top-right.
 * Clicking it opens a MUI Drawer from the right side of the screen. Inside the
 * drawer is helper text and a 6-field OTP input. The drawer also contains a
 * non-target "Resend code" button and a close icon. Initial state: drawer closed;
 * OTP empty.
 * 
 * Success: Target OTP value equals '874105' with length 6.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button, Drawer, Typography, TextField, Box, IconButton, Link } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [values, setValues] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const concatenatedValue = values.join('');

  useEffect(() => {
    if (concatenatedValue === '874105') {
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
    <>
      <Link
        component="button"
        onClick={() => {
          setValues(['', '', '', '', '', '']);
          setDrawerOpen(true);
        }}
        sx={{ cursor: 'pointer' }}
        data-testid="open-drawer-button"
      >
        Enter verification code
      </Link>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 320, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Verification</Typography>
            <IconButton size="small" onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter the 6-digit verification code sent to your device.
          </Typography>

          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Verification code
          </Typography>
          <Box data-testid="otp-verification-code" sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
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

          <Button variant="text" size="small" sx={{ mt: 1 }}>
            Resend code
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
