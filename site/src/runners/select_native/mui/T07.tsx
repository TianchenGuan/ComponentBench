'use client';

/**
 * select_native-mui-T07: Set Billing country to Canada (two selects)
 *
 * Layout: a billing/shipping address form section with two side-by-side native selects of the same canonical type.
 * The selects are clearly labeled:
 * 1) "Shipping country" (left)
 * 2) "Billing country" (right)  ← TARGET
 *
 * Both are MUI NativeSelect controls with identical option sets (label → value):
 * - United States → US
 * - Canada → CA
 * - Mexico → MX
 * - United Kingdom → GB
 * - Germany → DE
 * - France → FR
 * - Japan → JP
 * - Australia → AU
 *
 * Initial state:
 * - Shipping country: United States (US)
 * - Billing country: United States (US)
 *
 * Clutter: low — above the selects are two text inputs (City, Postal code). They are distractors and not needed for success.
 * Feedback: selection is visible directly in each field; no Save/Apply step.
 *
 * Success: The target native select labeled "Billing country" has selected option value 'CA' (label 'Canada').
 * Note: Only changing the Billing country select counts for success.
 */

import React, { useState } from 'react';
import {
  Card, CardContent, Typography, FormControl, InputLabel,
  NativeSelect, TextField, Box, Grid
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const countryOptions = [
  { label: 'United States', value: 'US' },
  { label: 'Canada', value: 'CA' },
  { label: 'Mexico', value: 'MX' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'Germany', value: 'DE' },
  { label: 'France', value: 'FR' },
  { label: 'Japan', value: 'JP' },
  { label: 'Australia', value: 'AU' },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [shippingCountry, setShippingCountry] = useState<string>('US');
  const [billingCountry, setBillingCountry] = useState<string>('US');

  const handleBillingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setBillingCountry(value);
    if (value === 'CA') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 500 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Address Information</Typography>
        
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <TextField fullWidth label="City" defaultValue="New York" size="small" />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Postal code" defaultValue="10001" size="small" />
          </Grid>
        </Grid>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="shipping-country-select">
                Shipping country
              </InputLabel>
              <NativeSelect
                data-testid="shipping-country"
                data-canonical-type="select_native"
                data-selected-value={shippingCountry}
                value={shippingCountry}
                onChange={(e) => setShippingCountry(e.target.value)}
                inputProps={{
                  name: 'shipping-country',
                  id: 'shipping-country-select',
                }}
              >
                {countryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel variant="standard" htmlFor="billing-country-select">
                Billing country
              </InputLabel>
              <NativeSelect
                data-testid="billing-country"
                data-canonical-type="select_native"
                data-selected-value={billingCountry}
                value={billingCountry}
                onChange={handleBillingChange}
                inputProps={{
                  name: 'billing-country',
                  id: 'billing-country-select',
                }}
              >
                {countryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
