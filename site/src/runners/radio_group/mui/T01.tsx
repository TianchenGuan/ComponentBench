'use client';

/**
 * radio_group-mui-T01: Appearance: set theme preference to Dark
 *
 * A centered isolated card titled "Appearance" contains one MUI FormControl with a FormLabel "Theme preference".
 * A RadioGroup lists three options as FormControlLabel rows:
 * - System default
 * - Light
 * - Dark
 * Initial state: System default is selected.
 * Below the RadioGroup is helper text ("Used for the app UI theme") and a small preview swatch that updates instantly.
 * No Save button is present; selection applies immediately.
 *
 * Success: The "Theme preference" RadioGroup selected value equals "dark" (label "Dark").
 */

import React, { useState } from 'react';
import {
  Card, CardContent, Typography, FormControl, FormLabel,
  RadioGroup, FormControlLabel, Radio, FormHelperText, Box
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const options = [
  { label: 'System default', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('system');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelected(value);
    if (value === 'dark') {
      onSuccess();
    }
  };

  const getSwatchColor = () => {
    switch (selected) {
      case 'dark': return '#1f1f1f';
      case 'light': return '#ffffff';
      default: return 'linear-gradient(135deg, #ffffff 50%, #1f1f1f 50%)';
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Appearance</Typography>
        <FormControl component="fieldset" data-canonical-type="radio_group" data-selected-value={selected}>
          <FormLabel component="legend">Theme preference</FormLabel>
          <RadioGroup value={selected} onChange={handleChange}>
            {options.map(option => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>
          <FormHelperText>Used for the app UI theme</FormHelperText>
        </FormControl>
        
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">Preview:</Typography>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1,
              border: '1px solid #ddd',
              background: getSwatchColor(),
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
