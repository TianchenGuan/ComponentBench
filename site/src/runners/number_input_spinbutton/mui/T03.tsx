'use client';

/**
 * number_input_spinbutton-mui-T03: Clear optional floor number
 * 
 * A centered isolated card titled "Address details" contains one Material UI TextField labeled "Floor number (optional)".
 * The TextField uses input type='number' and shows helper text "Leave blank if unknown".
 * - Constraints: min=0, max=200, step=1.
 * - Initial state: value is 7.
 * There is no reset icon; the intended action is to delete the existing digits so the field becomes empty.
 * 
 * Success: The target number input is empty (no value).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string>('7');

  useEffect(() => {
    if (value === '' || value === null) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Address details
        </Typography>
        <TextField
          label="Floor number (optional)"
          type="number"
          variant="outlined"
          fullWidth
          value={value}
          onChange={(e) => setValue(e.target.value)}
          helperText="Leave blank if unknown"
          inputProps={{ 
            min: 0, 
            max: 200, 
            step: 1,
            'data-testid': 'floor-number-input'
          }}
        />
      </CardContent>
    </Card>
  );
}
