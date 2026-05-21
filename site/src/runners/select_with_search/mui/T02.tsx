'use client';

/**
 * select_with_search-mui-T02: Open and pick a payment method
 *
 * Layout: isolated_card centered titled "Checkout".
 * Component: one MUI Autocomplete labeled "Payment method" with a popup indicator (dropdown arrow).
 * Options: Visa, Mastercard, American Express, PayPal.
 * Initial state: "Visa" is selected and shown in the input.
 * Interaction: clicking the popup icon (or the input) opens the options list; selecting an option immediately updates the input value.
 * No other fields or buttons are required for success.
 *
 * Success: The "Payment method" Autocomplete value equals "PayPal".
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography, Autocomplete, TextField } from '@mui/material';
import type { TaskComponentProps } from '../types';

const paymentOptions = ['Visa', 'Mastercard', 'American Express', 'PayPal'];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>('Visa');

  const handleChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setValue(newValue);
    if (newValue === 'PayPal') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Checkout</Typography>
        <Autocomplete
          data-testid="payment-autocomplete"
          options={paymentOptions}
          value={value}
          onChange={handleChange}
          renderInput={(params) => (
            <TextField {...params} label="Payment method" />
          )}
        />
      </CardContent>
    </Card>
  );
}
