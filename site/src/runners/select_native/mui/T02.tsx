'use client';

/**
 * select_native-mui-T02: Choose Email as contact method (native Select prop)
 *
 * Layout: an isolated card anchored near the top-right of the viewport (so the control is not centered).
 * The card is titled "Notification preferences" and contains a single MUI Select rendered in native mode (Select with native=true),
 * so the control is backed by an actual <select> element.
 *
 * The native select is labeled "Contact method".
 * Options (label → value):
 * - Email → email
 * - SMS Text → sms
 * - Phone call → call
 * - Push notification → push
 *
 * Initial state: "Push notification" is selected (value=push).
 * Distractors: a short paragraph of explanatory text and a non-functional "Learn more" link below the select.
 * Feedback: selection updates immediately with the chosen label visible in the field.
 *
 * Success: The target native select has selected option value 'email' (label 'Email').
 */

import React, { useState } from 'react';
import {
  Card, CardContent, Typography, FormControl, InputLabel,
  Select, Link, Box
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const options = [
  { label: 'Email', value: 'email' },
  { label: 'SMS Text', value: 'sms' },
  { label: 'Phone call', value: 'call' },
  { label: 'Push notification', value: 'push' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('push');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelected(value);
    if (value === 'email') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 380 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Notification preferences</Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Choose how you would like to receive notifications about important updates.
        </Typography>
        
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel variant="standard" htmlFor="contact-method-select">Contact method</InputLabel>
          <Select
            native
            data-testid="contact-method-select"
            data-canonical-type="select_native"
            data-selected-value={selected}
            value={selected}
            onChange={handleChange as any}
            inputProps={{
              name: 'contact-method',
              id: 'contact-method-select',
            }}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mt: 2 }}>
          <Link href="#" onClick={(e) => e.preventDefault()} sx={{ fontSize: 14 }}>
            Learn more
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
}
