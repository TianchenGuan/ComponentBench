'use client';

/**
 * pin_input_otp-mui-T18: Three OTP instances in a busy form with Apply
 * 
 * A form_section titled "Payments" with multiple typical form fields, plus three
 * OTP-style inputs: "SMS code" (6 digits), "Email code" (6 digits), and "Backup code"
 * (8 digits). An "Apply" button at the bottom commits the Backup code; disabled until
 * all 8 characters filled. Initial state: all OTP boxes empty; Apply disabled.
 * 
 * Success: Target OTP value equals '84712063' in "Backup code" AND Apply clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, Box, Button, Alert } from '@mui/material';
import type { TaskComponentProps } from '../types';

function OTPInput({ 
  length,
  value, 
  onChange, 
  testId,
}: { 
  length: number;
  value: string[]; 
  onChange: (val: string[]) => void; 
  testId: string;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val.slice(-1);
    }
    
    const newValues = [...value];
    newValues[index] = val;
    onChange(newValues);

    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <Box data-testid={testId} sx={{ display: 'flex', gap: 0.5 }}>
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
            style: { textAlign: 'center', width: 24, padding: '6px 0' },
            'data-otp-index': index,
          }}
        />
      ))}
    </Box>
  );
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [smsCode, setSmsCode] = useState<string[]>(Array(6).fill(''));
  const [emailCode, setEmailCode] = useState<string[]>(Array(6).fill(''));
  const [backupCode, setBackupCode] = useState<string[]>(Array(8).fill(''));
  const successCalledRef = useRef(false);

  const backupValue = backupCode.join('');
  const isBackupComplete = backupValue.length === 8;

  const handleApply = () => {
    if (backupValue === '84712063' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  };

  useEffect(() => {
    successCalledRef.current = false;
  }, []);

  return (
    <Card sx={{ width: 480 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Payments</Typography>

        {/* Card info (clutter) */}
        <Box sx={{ mb: 2 }}>
          <TextField fullWidth label="Card number" size="small" sx={{ mb: 1 }} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField label="Expiry" size="small" sx={{ flex: 1 }} />
            <TextField label="CVV" size="small" sx={{ width: 80 }} />
          </Box>
        </Box>

        <Alert severity="info" sx={{ mb: 2, fontSize: 12 }}>
          Please verify with all required codes
        </Alert>

        {/* SMS code */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>SMS code</Typography>
          <OTPInput length={6} value={smsCode} onChange={setSmsCode} testId="otp-sms-code" />
        </Box>

        {/* Email code */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Email code</Typography>
          <OTPInput length={6} value={emailCode} onChange={setEmailCode} testId="otp-email-code" />
        </Box>

        {/* Backup code (target) */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Backup code</Typography>
          <OTPInput length={8} value={backupCode} onChange={setBackupCode} testId="otp-backup-code" />
        </Box>

        <Button
          variant="contained"
          fullWidth
          disabled={!isBackupComplete}
          onClick={handleApply}
          data-testid="apply-button"
        >
          Apply
        </Button>
      </CardContent>
    </Card>
  );
}
