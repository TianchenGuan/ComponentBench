'use client';

/**
 * number_input_spinbutton-mui-T05: Dark theme: set font size percent
 * 
 * The UI uses a dark theme (dark surface colors with light text).
 * A centered isolated card titled "Typography" contains one MUI Number Field labeled "Font size (%)".
 * - Constraints: min=50, max=200, step=5.
 * - Initial state: value is 100.
 * A small preview line "Sample text" below updates in size as the value changes, but no Apply button is required.
 * 
 * Success: The numeric value of the target number input is 115.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, Typography, IconButton, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<number>(100);

  useEffect(() => {
    if (value === 115) {
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleIncrement = () => {
    setValue(prev => Math.min(prev + 5, 200));
  };

  const handleDecrement = () => {
    setValue(prev => Math.max(prev - 5, 50));
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Typography
        </Typography>
        <TextField
          label="Font size (%)"
          type="number"
          variant="outlined"
          fullWidth
          value={value}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (!isNaN(v) && v >= 50 && v <= 200) {
              setValue(v);
            }
          }}
          inputProps={{ 
            min: 50, 
            max: 200, 
            step: 5,
            'data-testid': 'font-size-input'
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton size="small" onClick={handleDecrement} disabled={value <= 50}>
                  <RemoveIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleIncrement} disabled={value >= 200}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Typography 
          sx={{ mt: 2, fontSize: `${value}%` }}
        >
          Sample text
        </Typography>
      </CardContent>
    </Card>
  );
}
