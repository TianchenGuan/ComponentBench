'use client';

/**
 * pin_input_otp-mui-T14: Disambiguate two OTP inputs in a form
 * 
 * A form_section titled "Security checks" containing two OTP inputs rendered with
 * MUI TextField composites. The first is labeled "Login code" and the second is
 * labeled "Transaction code". Both are 6 digits. The form also contains non-target
 * elements (a checkbox "Remember this device" and an info tooltip) as light clutter.
 * Initial state: both OTP inputs empty.
 * 
 * Success: Target OTP value equals '660129' in the "Transaction code" instance only.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, TextField, Box, Checkbox, FormControlLabel, Tooltip, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import type { TaskComponentProps } from '../types';

function OTPInput({ 
  value, 
  onChange, 
  testId,
  label,
}: { 
  value: string[]; 
  onChange: (val: string[]) => void; 
  testId: string;
  label: string;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    
    const newValues = [...value];
    newValues[index] = val;
    onChange(newValues);

    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <Box data-testid={testId} aria-label={label} sx={{ display: 'flex', gap: 0.5 }}>
      {value.map((val, index) => (
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
  );
}

export default function T04({ onSuccess }: TaskComponentProps) {
  const [loginCode, setLoginCode] = useState<string[]>(['', '', '', '', '', '']);
  const [transactionCode, setTransactionCode] = useState<string[]>(['', '', '', '', '', '']);

  const transactionValue = transactionCode.join('');

  useEffect(() => {
    if (transactionValue === '660129') {
      onSuccess();
    }
  }, [transactionValue, onSuccess]);

  return (
    <Card sx={{ width: 420 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="h6">Security checks</Typography>
          <Tooltip title="Additional security verification is required for this transaction">
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Login code */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Login code
          </Typography>
          <OTPInput
            value={loginCode}
            onChange={setLoginCode}
            testId="otp-login-code"
            label="Login code"
          />
        </Box>

        {/* Transaction code */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Transaction code
          </Typography>
          <OTPInput
            value={transactionCode}
            onChange={setTransactionCode}
            testId="otp-transaction-code"
            label="Transaction code"
          />
        </Box>

        {/* Clutter element */}
        <FormControlLabel
          control={<Checkbox size="small" />}
          label={<Typography variant="body2">Remember this device</Typography>}
        />
      </CardContent>
    </Card>
  );
}
