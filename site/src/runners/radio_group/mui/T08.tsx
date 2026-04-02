'use client';

/**
 * radio_group-mui-T08: Small + compact: select Priority code P6 from a dense group
 *
 * A centered isolated card titled "Priority settings" renders in compact spacing with small-scale controls (smaller radio icons and reduced padding).
 * It contains one MUI RadioGroup labeled "Priority code" with eight short, similar options laid out in two rows:
 * P0, P1, P2, P3, P4, P5, P6, P7.
 * Initial state: P3 is selected.
 * There are no other controls besides a non-interactive note ("Higher number = lower urgency"). No Save button.
 * The combination of small targets and many near-identical labels increases click precision and choice interference.
 *
 * Success: The "Priority code" RadioGroup selected value equals "p6" (label "P6").
 */

import React, { useState } from 'react';
import {
  Card, CardContent, Typography, FormControl, FormLabel,
  RadioGroup, FormControlLabel, Radio, Box
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const options = ['P0', 'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('p3');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelected(value);
    if (value === 'p6') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 380 }}>
      <CardContent sx={{ py: 1.5, px: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>Priority settings</Typography>

        <FormControl component="fieldset" data-canonical-type="radio_group" data-selected-value={selected}>
          <FormLabel component="legend" sx={{ fontSize: 13 }}>Priority code</FormLabel>
          <RadioGroup value={selected} onChange={handleChange}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              {options.map(option => (
                <FormControlLabel
                  key={option}
                  value={option.toLowerCase()}
                  control={<Radio size="small" />}
                  label={option}
                  sx={{ 
                    minWidth: 70,
                    mr: 0,
                    '& .MuiFormControlLabel-label': { fontSize: 13 }
                  }}
                />
              ))}
            </Box>
          </RadioGroup>
        </FormControl>
        
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Higher number = lower urgency
        </Typography>
      </CardContent>
    </Card>
  );
}
