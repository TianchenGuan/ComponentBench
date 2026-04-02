'use client';

/**
 * datetime_picker_range-mui-T09: Compact mode: set a tight-minute range using multi-input field
 *
 * Layout: isolated_card centered. Light theme but compact spacing mode. Scale default.
 * Composite of two MUI DateTimePicker inputs with small size.
 * Time selection uses 1-minute granularity (dense minute list).
 * Initial state: empty.
 *
 * Success: start=2026-07-04T09:07:00, end=2026-07-04T09:59:00 (local time).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [startValue, setStartValue] = useState<Dayjs | null>(null);
  const [endValue, setEndValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (startValue && endValue) {
      const startMatch = startValue.format('YYYY-MM-DD HH:mm') === '2026-07-04 09:07';
      const endMatch = endValue.format('YYYY-MM-DD HH:mm') === '2026-07-04 09:59';
      if (startMatch && endMatch) {
        onSuccess();
      }
    }
  }, [startValue, endValue, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 500 }}>
        <CardContent sx={{ py: 1.5 }}>
          <Typography variant="subtitle1" gutterBottom>Blackout Settings</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: 12 }}>
            Blackout window (compact spacing; minute options include every minute)
          </Typography>
          <Stack direction="row" spacing={1}>
            <Box sx={{ flex: 1 }}>
              <DateTimePicker
                value={startValue}
                onChange={(newValue) => setStartValue(newValue)}
                label="Start"
                timeSteps={{ minutes: 1 }}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                    inputProps: { 'data-testid': 'dt-range-start' },
                  },
                }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <DateTimePicker
                value={endValue}
                onChange={(newValue) => setEndValue(newValue)}
                label="End"
                timeSteps={{ minutes: 1 }}
                slotProps={{
                  textField: {
                    size: 'small',
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
