'use client';

/**
 * select_native-mui-T03: Clear coupon selection to No coupon
 *
 * Layout: a centered isolated card titled "Checkout".
 * The card contains one MUI native select labeled "Coupon".
 *
 * Options (label → value):
 * - No coupon → "" (empty string)
 * - WELCOME5 → WELCOME5
 * - SPRING10 → SPRING10
 * - FREESHIP → FREESHIP
 *
 * Initial state: "SPRING10" is selected (value=SPRING10), and a small line of helper text reads "Discount applied".
 * No Apply/Save is present; changing the selection immediately updates the helper text (pure feedback, not required for success).
 * Distractors: a disabled "Place order" button and an order total summary (static).
 *
 * Success: The target native select has selected option value '' (label 'No coupon').
 */

import React, { useState } from 'react';
import {
  Card, CardContent, Typography, FormControl, InputLabel,
  NativeSelect, FormHelperText, Button, Box, Divider
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const options = [
  { label: 'No coupon', value: '' },
  { label: 'WELCOME5', value: 'WELCOME5' },
  { label: 'SPRING10', value: 'SPRING10' },
  { label: 'FREESHIP', value: 'FREESHIP' },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('SPRING10');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelected(value);
    if (value === '') {
      onSuccess();
    }
  };

  const getHelperText = () => {
    if (selected === '') return 'No discount';
    return 'Discount applied';
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Checkout</Typography>
        
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel variant="standard" htmlFor="coupon-select">Coupon</InputLabel>
          <NativeSelect
            data-testid="coupon-select"
            data-canonical-type="select_native"
            data-selected-value={selected}
            value={selected}
            onChange={handleChange}
            inputProps={{
              name: 'coupon',
              id: 'coupon-select',
            }}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </NativeSelect>
          <FormHelperText>{getHelperText()}</FormHelperText>
        </FormControl>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">Subtotal</Typography>
          <Typography variant="body2">$49.99</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="body2" fontWeight={600}>Total</Typography>
          <Typography variant="body2" fontWeight={600}>$49.99</Typography>
        </Box>

        <Button variant="contained" fullWidth disabled>
          Place order
        </Button>
      </CardContent>
    </Card>
  );
}
