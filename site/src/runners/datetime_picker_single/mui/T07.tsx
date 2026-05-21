'use client';

/**
 * datetime_picker_single-mui-T07: MUI scroll year list to reach far year
 *
 * Layout: isolated card centered.
 * Component: one MUI X DesktopDateTimePicker labeled "Contract renewal".
 * Interaction nuance: the target year (2036) is far from the default year, so the user must open the year selection UI and scroll to find 2036 before choosing the month/day.
 * Time selection: standard hours/minutes (no seconds). No explicit OK on desktop.
 * Initial state: empty.
 *
 * Success: The "Contract renewal" picker value equals 2036-07-04 10:00 AM.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.format('YYYY-MM-DD HH:mm') === '2036-07-04 10:00') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Contract Management</Typography>
          <Box>
            <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Contract renewal
            </Typography>
            <DateTimePicker
              value={value}
              onChange={(newValue) => setValue(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  inputProps: { 'data-testid': 'dt-contract' },
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
