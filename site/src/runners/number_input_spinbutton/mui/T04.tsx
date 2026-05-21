'use client';

/**
 * number_input_spinbutton-mui-T04: Fix Max guests to 6 (starts invalid)
 * 
 * A centered isolated card titled "Booking limits" contains one MUI Number Field labeled "Max guests".
 * - Constraints: min=1, max=10, step=1.
 * - Initial state: the field shows value 15 and is styled as an error with helper text "Enter a value between 1 and 10".
 * The field includes visible increment/decrement controls (Number Field end adornments).
 * There are no other inputs and no Save button; the error clears automatically once the value is within the allowed range.
 * 
 * Success: The numeric value of the target number input is 6, and the input is in a valid (non-error) state.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Typography, IconButton, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number>(15);
  
  const isValid = value >= 1 && value <= 10;

  useEffect(() => {
    if (value === 6 && isValid) {
      onSuccess();
    }
  }, [value, isValid, onSuccess]);

  const handleIncrement = () => {
    setValue(prev => prev + 1);
  };

  const handleDecrement = () => {
    setValue(prev => prev - 1);
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Booking limits
        </Typography>
        <TextField
          label="Max guests"
          type="number"
          variant="outlined"
          fullWidth
          error={!isValid}
          value={value}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (!isNaN(v)) {
              setValue(v);
            }
          }}
          helperText={isValid ? '' : 'Enter a value between 1 and 10'}
          inputProps={{ 
            min: 1, 
            max: 10, 
            step: 1,
            'data-testid': 'max-guests'
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton size="small" onClick={handleDecrement} data-testid="decrement-btn">
                  <RemoveIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleIncrement} data-testid="increment-btn">
                  <AddIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </CardContent>
    </Card>
  );
}
