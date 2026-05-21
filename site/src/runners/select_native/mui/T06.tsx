'use client';

/**
 * select_native-mui-T06: Select Express shipping in checkout form
 *
 * Layout: a checkout form section centered on the page (not a modal). The section contains several common form fields:
 * - Text inputs: "Full name", "Street address"
 * - A checkbox: "Use as billing address"
 * - The target component: a MUI NativeSelect labeled "Shipping speed"
 *
 * The native select options (label → value):
 * - Standard (3–5 days) → standard
 * - Express (1–2 days) → express
 * - Overnight → overnight
 *
 * Initial state: "Standard (3–5 days)" is selected.
 * Clutter: low — other form fields are present but do not need to be edited for success.
 * Feedback: a small price line under the select updates (e.g., "+$9.99") after selection; no separate Apply button.
 *
 * Success: The target native select has selected option value 'express' (label 'Express (1–2 days)').
 */

import React, { useState } from 'react';
import {
  Card, CardContent, Typography, FormControl, InputLabel,
  NativeSelect, TextField, FormControlLabel, Checkbox, Box
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const options = [
  { label: 'Standard (3–5 days)', value: 'standard', price: '+$0.00' },
  { label: 'Express (1–2 days)', value: 'express', price: '+$9.99' },
  { label: 'Overnight', value: 'overnight', price: '+$19.99' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('standard');
  const [billingAddress, setBillingAddress] = useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelected(value);
    if (value === 'express') {
      onSuccess();
    }
  };

  const selectedOption = options.find(o => o.value === selected);

  return (
    <Card sx={{ width: 450 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Shipping Information</Typography>
        
        <TextField
          fullWidth
          label="Full name"
          defaultValue="John Smith"
          sx={{ mb: 2 }}
        />
        
        <TextField
          fullWidth
          label="Street address"
          defaultValue="123 Main St"
          sx={{ mb: 2 }}
        />
        
        <FormControlLabel
          control={
            <Checkbox 
              checked={billingAddress}
              onChange={(e) => setBillingAddress(e.target.checked)}
            />
          }
          label="Use as billing address"
          sx={{ mb: 2 }}
        />
        
        <FormControl fullWidth sx={{ mt: 1 }}>
          <InputLabel variant="standard" htmlFor="shipping-speed-select">
            Shipping speed
          </InputLabel>
          <NativeSelect
            data-testid="shipping-speed-select"
            data-canonical-type="select_native"
            data-selected-value={selected}
            value={selected}
            onChange={handleChange}
            inputProps={{
              name: 'shipping-speed',
              id: 'shipping-speed-select',
            }}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </NativeSelect>
        </FormControl>
        
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {selectedOption?.price}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
