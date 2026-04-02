'use client';

/**
 * datetime_picker_range-mui-T04: Approval required: set range and press OK
 *
 * Layout: isolated_card centered. Light theme, comfortable spacing.
 * Composite of two MUI DateTimePicker inputs with action bar showing Cancel/OK.
 * No other UI elements are present.
 *
 * Success: start=2026-03-05T13:15:00, end=2026-03-05T14:45:00 (local time) after OK is clicked.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [startValue, setStartValue] = useState<Dayjs | null>(null);
  const [endValue, setEndValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (startValue && endValue) {
      const startMatch = startValue.format('YYYY-MM-DD HH:mm') === '2026-03-05 13:15';
      const endMatch = endValue.format('YYYY-MM-DD HH:mm') === '2026-03-05 14:45';
      if (startMatch && endMatch) {
        onSuccess();
      }
    }
  }, [startValue, endValue, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 500 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Approval Settings</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Approval window (action bar shows Cancel and OK)
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
                  actionBar: {
                    actions: ['cancel', 'accept'],
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
                  actionBar: {
                    actions: ['cancel', 'accept'],
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
