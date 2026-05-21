'use client';

/**
 * select_native-mui-T01: Set Age to Thirty (basic native select)
 *
 * Layout: an isolated card centered in the viewport with a single form control titled "Profile basics".
 * The card contains one MUI native select labeled "Age" (MUI NativeSelect inside a FormControl with an InputLabel and helper text).
 *
 * Options (label → value):
 * - Ten → 10
 * - Twenty → 20
 * - Thirty → 30
 * - Forty → 40
 *
 * Initial state: "Twenty" is selected (value=20). There are no other interactive components besides a disabled "Continue" button used as a visual distractor (does nothing for success).
 * Feedback: the selected value is shown as the select's visible text immediately after selection (no Save/Apply step).
 *
 * Success: The target native select has selected option value '30' (label 'Thirty').
 */

import React, { useState } from 'react';
import {
  Card, CardContent, Typography, FormControl, InputLabel,
  NativeSelect, FormHelperText, Button, Box
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const options = [
  { label: 'Ten', value: '10' },
  { label: 'Twenty', value: '20' },
  { label: 'Thirty', value: '30' },
  { label: 'Forty', value: '40' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('20');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelected(value);
    if (value === '30') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Profile basics</Typography>
        
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel variant="standard" htmlFor="age-select">Age</InputLabel>
          <NativeSelect
            data-testid="age-select"
            data-canonical-type="select_native"
            data-selected-value={selected}
            value={selected}
            onChange={handleChange}
            inputProps={{
              name: 'age',
              id: 'age-select',
            }}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </NativeSelect>
          <FormHelperText>Select your age range</FormHelperText>
        </FormControl>

        <Box sx={{ mt: 3 }}>
          <Button variant="contained" disabled>
            Continue
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
