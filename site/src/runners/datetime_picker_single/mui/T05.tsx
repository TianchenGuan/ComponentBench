'use client';

/**
 * datetime_picker_single-mui-T05: MUI clear using action bar
 *
 * Layout: isolated card centered (no other form fields).
 * Component: one MUI X DesktopDateTimePicker labeled "Scheduled run".
 * Configuration: picker action bar is enabled and shows a "Clear" action (actionBar.actions includes 'clear').
 * Initial state: value is set to "02/05/2026 09:00 AM".
 * Behavior: using the Clear action resets the value to empty and closes the picker; no extra OK is required after clearing.
 *
 * Success: The DateTimePicker labeled "Scheduled run" is empty/null after the clear action.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(dayjs('2026-02-05 09:00', 'YYYY-MM-DD HH:mm'));

  useEffect(() => {
    if (value === null) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Job Scheduler</Typography>
          <Box>
            <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Scheduled run
            </Typography>
            <DateTimePicker
              value={value}
              onChange={(newValue) => setValue(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  inputProps: { 'data-testid': 'dt-scheduled' },
                },
                actionBar: {
                  actions: ['clear', 'accept'],
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
