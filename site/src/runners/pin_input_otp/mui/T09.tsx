'use client';

/**
 * pin_input_otp-mui-T19: Dark modal with two OTP instances and Confirm
 * 
 * The page opens directly with a MUI Dialog already visible, UI in dark theme.
 * Inside the dialog are two OTP inputs: "Primary code" and "Secondary code",
 * each a 6-field MUI TextField composite. The dialog footer has "Cancel" and
 * "Confirm" buttons. "Confirm" is disabled until Primary code is fully filled.
 * Initial state: both OTP inputs empty; Confirm disabled.
 * 
 * Success: OTP value equals '568203' in "Primary code" AND Confirm clicked.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField, Box } from '@mui/material';
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

export default function T09({ onSuccess }: TaskComponentProps) {
  const [primaryCode, setPrimaryCode] = useState<string[]>(Array(6).fill(''));
  const [secondaryCode, setSecondaryCode] = useState<string[]>(Array(6).fill(''));
  const successCalledRef = useRef(false);

  const primaryValue = primaryCode.join('');
  const isPrimaryComplete = primaryValue.length === 6;

  const handleConfirm = () => {
    if (primaryValue === '568203' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  };

  useEffect(() => {
    successCalledRef.current = false;
  }, []);

  return (
    <Dialog open={true} maxWidth="sm" fullWidth>
      <DialogTitle>Confirm sign-in</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Enter your verification codes to complete sign-in.
        </Typography>

        {/* Primary code */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Primary code</Typography>
          <OTPInput
            value={primaryCode}
            onChange={setPrimaryCode}
            testId="otp-primary-code"
            label="Primary code"
          />
        </Box>

        {/* Secondary code */}
        <Box>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>Secondary code</Typography>
          <OTPInput
            value={secondaryCode}
            onChange={setSecondaryCode}
            testId="otp-secondary-code"
            label="Secondary code"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button>Cancel</Button>
        <Button
          variant="contained"
          disabled={!isPrimaryComplete}
          onClick={handleConfirm}
          data-testid="confirm-button"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
