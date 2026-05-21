'use client';

/**
 * number_input_spinbutton-mui-T01: Set age to 28 (TextField type=number)
 * 
 * A centered isolated card titled "Basic info" contains one Material UI TextField labeled "Age".
 * The TextField uses the native HTML input type='number' so browsers may show built-in spinbuttons.
 * - Constraints via inputProps: min=0, max=120, step=1.
 * - Initial state: value is 35.
 * Helper text under the field says "Enter a whole number".
 * There are no other interactive controls on the page.
 * 
 * Success: The numeric value of the target number input is 28.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>('35');

  useEffect(() => {
    const numValue = parseInt(value, 10);
    if (numValue === 28) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Basic info
        </Typography>
        <TextField
          label="Age"
          type="number"
          variant="outlined"
          fullWidth
          value={value}
          onChange={(e) => setValue(e.target.value)}
          helperText="Enter a whole number"
          inputProps={{ 
            min: 0, 
            max: 120, 
            step: 1,
            'data-testid': 'age-input'
          }}
        />
      </CardContent>
    </Card>
  );
}
