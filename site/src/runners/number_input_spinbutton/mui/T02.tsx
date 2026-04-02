'use client';

/**
 * number_input_spinbutton-mui-T02: Set quantity to 3 (Number Field)
 * 
 * A centered isolated card titled "Order line" contains one MUI Number Field labeled "Quantity".
 * The field includes visible increment and decrement buttons (end adornments) consistent with the Number Field demo styling.
 * - Constraints: min=1, max=20, step=1.
 * - Initial state: value is 1.
 * There is a read-only text line below: "Total updates automatically". No Save/Apply is required.
 * 
 * Success: The numeric value of the target number input is 3.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Typography, IconButton, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number>(1);

  useEffect(() => {
    if (value === 3) {
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleIncrement = () => {
    setValue(prev => Math.min(prev + 1, 20));
  };

  const handleDecrement = () => {
    setValue(prev => Math.max(prev - 1, 1));
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Order line
        </Typography>
        <TextField
          label="Quantity"
          type="number"
          variant="outlined"
          fullWidth
          value={value}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (!isNaN(v) && v >= 1 && v <= 20) {
              setValue(v);
            }
          }}
          inputProps={{ 
            min: 1, 
            max: 20, 
            step: 1,
            'data-testid': 'quantity-number-field'
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton 
                  size="small" 
                  onClick={handleDecrement}
                  disabled={value <= 1}
                  data-testid="decrement-btn"
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton 
                  size="small" 
                  onClick={handleIncrement}
                  disabled={value >= 20}
                  data-testid="increment-btn"
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Total updates automatically
        </Typography>
      </CardContent>
    </Card>
  );
}
