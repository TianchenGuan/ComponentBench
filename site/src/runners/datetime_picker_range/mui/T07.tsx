'use client';

/**
 * datetime_picker_range-mui-T07: Keyboard edit: type a full date-time range in one field
 *
 * Layout: isolated_card centered. Light theme, comfortable spacing, default scale.
 * Composite of two MUI DateTimePicker inputs that support keyboard editing.
 * Helper text indicates keyboard editing support.
 * Initial state: empty.
 *
 * Success: start=2026-04-10T08:15:00, end=2026-04-10T09:45:00 (local time).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [startValue, setStartValue] = useState<Dayjs | null>(null);
  const [endValue, setEndValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (startValue && endValue) {
      const startMatch = startValue.format('YYYY-MM-DD HH:mm') === '2026-04-10 08:15';
      const endMatch = endValue.format('YYYY-MM-DD HH:mm') === '2026-04-10 09:45';
      if (startMatch && endMatch) {
        onSuccess();
      }
    }
  }, [startValue, endValue, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 550 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Editing Range</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            MM/DD/YYYY hh:mm aa format. You can type directly into the fields.
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
                    helperText: 'Press Enter to start editing',
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
                    helperText: 'Press Enter to start editing',
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
