'use client';

/**
 * time_input_text-mui-T03: Clear a MUI X TimeField using the clear button
 * 
 * Layout: isolated_card centered, light theme, comfortable spacing.
 * A single MUI X TimeField labeled "Reminder time" is shown.
 * - Configuration: format='HH:mm', clearable=true (shows a clear icon button when the field has a value).
 * - Initial state: value is 15:30.
 * - The clear button appears in the field's adornment area (end). Users can also clear by selecting and deleting text.
 * - No distractors; clutter=none.
 * 
 * Success: The TimeField labeled "Reminder time" has no value (cleared to empty).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(dayjs('15:30', 'HH:mm'));

  useEffect(() => {
    if (value === null || !value.isValid()) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Reminders</Typography>
          <Box>
            <Typography component="label" htmlFor="reminder-time" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Reminder time
            </Typography>
            <TimeField
              value={value}
              onChange={(newValue) => setValue(newValue)}
              format="HH:mm"
              clearable
              slotProps={{
                textField: {
                  id: 'reminder-time',
                  fullWidth: true,
                  inputProps: {
                    'data-testid': 'reminder-time',
                  },
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
