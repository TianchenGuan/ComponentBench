'use client';

/**
 * pin_input_otp-mui-T17: Scroll to Two-step section and enter short code
 * 
 * A settings_panel page with multiple sections stacked vertically requiring scrolling.
 * The target "Two-step verification" section is below the fold. Inside that section
 * is a 4-field OTP input labeled "Short code", implemented as four small-sized MUI
 * TextFields (outlined) with auto-advance. Initial state: viewport at top; OTP empty.
 * 
 * Success: Target OTP value equals '4038' with length 4.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, TextField, Box, Switch, FormControlLabel, Button, Divider } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [values, setValues] = useState<string[]>(['', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const concatenatedValue = values.join('');

  useEffect(() => {
    if (concatenatedValue === '4038') {
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

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <Card sx={{ width: 500, maxHeight: 400, overflow: 'auto' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Settings</Typography>

        {/* Profile Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Profile</Typography>
          <TextField fullWidth label="Display name" size="small" sx={{ mb: 2 }} />
          <TextField fullWidth label="Email" size="small" sx={{ mb: 2 }} />
          <TextField fullWidth label="Bio" size="small" multiline rows={2} />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Notifications Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Notifications</Typography>
          <FormControlLabel control={<Switch size="small" />} label="Email notifications" sx={{ display: 'block', mb: 1 }} />
          <FormControlLabel control={<Switch size="small" />} label="Push notifications" sx={{ display: 'block', mb: 1 }} />
          <FormControlLabel control={<Switch size="small" />} label="SMS notifications" sx={{ display: 'block' }} />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Privacy Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Privacy</Typography>
          <FormControlLabel control={<Switch size="small" />} label="Make profile public" sx={{ display: 'block', mb: 1 }} />
          <FormControlLabel control={<Switch size="small" />} label="Show online status" sx={{ display: 'block' }} />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Two-step verification Section (target) */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Two-step verification</Typography>
          <FormControlLabel control={<Switch size="small" />} label="Enable 2FA" sx={{ display: 'block', mb: 2 }} />
          <Button variant="outlined" size="small" sx={{ mb: 2 }}>
            Download recovery codes
          </Button>
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Short code
            </Typography>
            <Box data-testid="otp-short-code" sx={{ display: 'flex', gap: 0.5 }}>
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
                    style: { textAlign: 'center', width: 24, padding: '6px 0', fontSize: 14 },
                    'data-otp-index': index,
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
