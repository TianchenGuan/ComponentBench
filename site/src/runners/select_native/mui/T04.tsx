'use client';

/**
 * select_native-mui-T04: Set meeting duration to 45 minutes (small scale)
 *
 * Layout: a centered isolated card titled "Calendar".
 * The page is in comfortable spacing but the component scale is set to SMALL: the native select and label are rendered in a compact height
 * (MUI size styling), making the click target slightly smaller than default.
 *
 * The MUI NativeSelect is labeled "Meeting duration".
 * Options (label → value):
 * - 15 minutes → 15
 * - 30 minutes → 30
 * - 45 minutes → 45
 * - 60 minutes → 60
 *
 * Initial state: "30 minutes" is selected (value=30).
 * Distractors: a read-only text field showing "Next meeting: Today 3:00 PM" and a decorative calendar icon.
 * Feedback: the selected label updates immediately; no confirmation step.
 *
 * Success: The target native select has selected option value '45' (label '45 minutes').
 */

import React, { useState } from 'react';
import {
  Card, CardContent, Typography, FormControl, InputLabel,
  NativeSelect, Box, TextField
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import type { TaskComponentProps } from '../types';

const options = [
  { label: '15 minutes', value: '15' },
  { label: '30 minutes', value: '30' },
  { label: '45 minutes', value: '45' },
  { label: '60 minutes', value: '60' },
];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('30');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelected(value);
    if (value === '45') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 380 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CalendarMonthIcon color="primary" />
          <Typography variant="h6">Calendar</Typography>
        </Box>
        
        <TextField
          fullWidth
          size="small"
          label="Next meeting"
          value="Today 3:00 PM"
          InputProps={{ readOnly: true }}
          sx={{ mb: 2 }}
        />
        
        <FormControl fullWidth size="small" sx={{ mt: 1 }}>
          <InputLabel variant="standard" htmlFor="duration-select" sx={{ fontSize: 14 }}>
            Meeting duration
          </InputLabel>
          <NativeSelect
            data-testid="duration-select"
            data-canonical-type="select_native"
            data-selected-value={selected}
            value={selected}
            onChange={handleChange}
            inputProps={{
              name: 'duration',
              id: 'duration-select',
            }}
            sx={{ fontSize: 14, height: 32 }}
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </NativeSelect>
        </FormControl>
      </CardContent>
    </Card>
  );
}
