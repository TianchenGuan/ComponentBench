'use client';

/**
 * date_picker_range-mui-T01: Open Booking dates picker (desktop popover)
 *
 * Baseline isolated card centered in the viewport with a single
 * MUI X DateRangePicker labeled 'Booking dates'. It uses the desktop variant (popover)
 * with a single input field displaying the range in the format 'MM/DD/YYYY – MM/DD/YYYY'.
 * A calendar icon button at the end of the input also opens the popover. The field
 * starts empty. There are no other interactive elements on the page.
 *
 * Note: Using two DatePickers as MUI free tier doesn't include DateRangePicker.
 *
 * Success: The picker overlay/popover is open for the 'Booking dates' instance.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [startValue, setStartValue] = useState<Dayjs | null>(null);
  const [endValue, setEndValue] = useState<Dayjs | null>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);

  useEffect(() => {
    if (startOpen || endOpen) {
      onSuccess();
    }
  }, [startOpen, endOpen, onSuccess]);

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
                open={startOpen}
                onOpen={() => setStartOpen(true)}
                onClose={() => setStartOpen(false)}
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
                open={endOpen}
                onOpen={() => setEndOpen(true)}
                onClose={() => setEndOpen(false)}
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
