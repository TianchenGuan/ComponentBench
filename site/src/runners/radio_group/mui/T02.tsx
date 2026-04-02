'use client';

/**
 * radio_group-mui-T02: Contact preferences: choose SMS as contact method
 *
 * An isolated card titled "Contact preferences" is placed near the top-right of the viewport (light theme).
 * It contains one RadioGroup labeled "Contact method" with three vertically-stacked choices:
 * - Email
 * - SMS
 * - Phone call
 * Initial state: Email is selected.
 * Below the group is a read-only line that shows the selected method. No other radio groups exist and there is no Save button.
 *
 * Success: The "Contact method" RadioGroup selected value equals "sms" (label "SMS").
 */

import React, { useState } from 'react';
import {
  Card, CardContent, Typography, FormControl, FormLabel,
  RadioGroup, FormControlLabel, Radio
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const options = [
  { label: 'Email', value: 'email' },
  { label: 'SMS', value: 'sms' },
  { label: 'Phone call', value: 'phone' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('email');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelected(value);
    if (value === 'sms') {
      onSuccess();
    }
  };

  const selectedLabel = options.find(o => o.value === selected)?.label || '';

  return (
    <Card sx={{ width: 360 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Contact preferences</Typography>
        <FormControl component="fieldset" data-canonical-type="radio_group" data-selected-value={selected}>
          <FormLabel component="legend">Contact method</FormLabel>
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
        </FormControl>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Selected method: {selectedLabel}
        </Typography>
      </CardContent>
    </Card>
  );
}
