'use client';

/**
 * datetime_picker_single-mui-T01: MUI desktop basic set datetime
 *
 * Layout: isolated card centered.
 * Component: one MUI X DesktopDateTimePicker with an input field and an icon button to open the picker.
 * Picker UI: opens in a popover (desktop variant) with calendar + time selection (hours/minutes).
 * Action bar: default desktop behavior (no explicit Cancel/OK buttons).
 * Initial state: empty; placeholder shows a datetime format like "MM/DD/YYYY hh:mm aa".
 * No other date/time inputs on the page.
 *
 * Success: The DesktopDateTimePicker labeled "Appointment" has value 2026-02-06 16:00 (local time).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.format('YYYY-MM-DD HH:mm') === '2026-02-06 16:00') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Schedule</Typography>
          <Box>
            <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Appointment
            </Typography>
            <DateTimePicker
              value={value}
              onChange={(newValue) => setValue(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  inputProps: { 'data-testid': 'dt-appointment' },
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
