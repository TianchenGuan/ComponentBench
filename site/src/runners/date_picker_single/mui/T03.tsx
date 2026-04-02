'use client';

/**
 * date_picker_single-mui-T03: Clear a prefilled date using the action bar
 *
 * Scene: Centered isolated card, light theme, comfortable spacing.
 *
 * Target component: One MUI X DatePicker labeled "Reminder date".
 * - Initial state: field shows "2026-01-15".
 * - Configuration: The picker is configured to display an ActionBar even in desktop mode with a single "Clear" action.
 * - Interaction: Open the picker; then use the "Clear" action to reset the value to empty.
 *
 * Distractors: None.
 *
 * Feedback: Clicking "Clear" empties the field and closes the picker.
 *
 * Success: Date picker must have selected date = empty (no date).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { PickersActionBar } from '@mui/x-date-pickers/PickersActionBar';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(dayjs('2026-01-15'));

  useEffect(() => {
    if (value === null) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Reminder date (prefilled)</Typography>
          <Box>
            <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Reminder date
            </Typography>
            <DatePicker
              value={value}
              onChange={(newValue) => setValue(newValue)}
              format="YYYY-MM-DD"
              slotProps={{
                textField: {
                  fullWidth: true,
                  inputProps: {
                    'data-testid': 'reminder-date',
                  },
                },
                actionBar: {
                  actions: ['clear'],
                },
              }}
              slots={{
                actionBar: PickersActionBar,
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
