'use client';

/**
 * datetime_picker_range-mui-T01: Booking window: set same-day range (MUI composite)
 *
 * Layout: isolated_card centered. Light theme, comfortable spacing, default scale.
 * Since MUI X Pro DateTimeRangePicker is not available, this uses a composite of two MUI DateTimePicker inputs.
 * Initial state: empty. No distractors.
 *
 * Success: start=2026-02-14T09:30:00, end=2026-02-14T11:00:00 (local time).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [startValue, setStartValue] = useState<Dayjs | null>(null);
  const [endValue, setEndValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (startValue && endValue) {
      const startMatch = startValue.format('YYYY-MM-DD HH:mm') === '2026-02-14 09:30';
      const endMatch = endValue.format('YYYY-MM-DD HH:mm') === '2026-02-14 11:00';
      if (startMatch && endMatch) {
        onSuccess();
      }
    }
  }, [startValue, endValue, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 500 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Booking Scheduler</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Select start and end date/time for the booking window.
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
                Start
              </Typography>
              <DateTimePicker
                value={startValue}
                onChange={(newValue) => setStartValue(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    inputProps: { 'data-testid': 'dt-range-start' },
                  },
                }}
              />
            </Box>
            <Box>
              <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
                End
              </Typography>
              <DateTimePicker
                value={endValue}
                onChange={(newValue) => setEndValue(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    inputProps: { 'data-testid': 'dt-range-end' },
                  },
                }}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
