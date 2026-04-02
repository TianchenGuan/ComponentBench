'use client';

/**
 * date_picker_range-mui-T02: Select a short date range in March
 *
 * Isolated card centered in the viewport with one MUI X desktop
 * DateRangePicker labeled 'Booking dates'. The calendar opens in a popover when
 * the input is focused. The popover shows a month grid with navigation arrows and
 * highlights the selected start, end, and in-between days. The value commits as
 * soon as the end date is selected (no separate OK button). The input initially
 * shows an empty placeholder 'MM/DD/YYYY – MM/DD/YYYY'.
 *
 * Note: Using two DatePickers as MUI free tier doesn't include DateRangePicker.
 *
 * Success: Start date = 2026-03-10, End date = 2026-03-14
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [startValue, setStartValue] = useState<Dayjs | null>(null);
  const [endValue, setEndValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (
      startValue &&
      endValue &&
      startValue.isValid() &&
      endValue.isValid() &&
      startValue.format('YYYY-MM-DD') === '2026-03-10' &&
      endValue.format('YYYY-MM-DD') === '2026-03-14'
    ) {
      onSuccess();
    }
  }, [startValue, endValue, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 500 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Booking dates</Typography>
          <Box>
            <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Booking dates
            </Typography>
            <Stack direction="row" spacing={2}>
              <DatePicker
                label="Start"
                value={startValue}
                onChange={(newValue) => setStartValue(newValue)}
                format="YYYY-MM-DD"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    inputProps: {
                      'data-testid': 'booking-dates-start',
                    },
                  },
                }}
              />
              <DatePicker
                label="End"
                value={endValue}
                onChange={(newValue) => setEndValue(newValue)}
                format="YYYY-MM-DD"
                minDate={startValue || undefined}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    inputProps: {
                      'data-testid': 'booking-dates-end',
                    },
                  },
                }}
              />
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
