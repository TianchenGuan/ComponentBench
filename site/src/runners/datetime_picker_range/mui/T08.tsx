'use client';

/**
 * datetime_picker_range-mui-T08: Night shift: cross-month range with OK confirmation (dark theme)
 *
 * Layout: isolated_card centered in dark theme; spacing comfortable, scale default.
 * Composite of two MUI DateTimePicker inputs with action bar showing Cancel/OK.
 * Target spans a month boundary (Nov 30 → Dec 1), requiring calendar navigation between months.
 *
 * Success: start=2026-11-30T22:00:00, end=2026-12-01T01:30:00 (local time) after OK is clicked.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, ThemeProvider, createTheme, CssBaseline, Stack } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function T08({ onSuccess }: TaskComponentProps) {
  const [startValue, setStartValue] = useState<Dayjs | null>(null);
  const [endValue, setEndValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (startValue && endValue) {
      const startMatch = startValue.format('YYYY-MM-DD HH:mm') === '2026-11-30 22:00';
      const endMatch = endValue.format('YYYY-MM-DD HH:mm') === '2026-12-01 01:30';
      if (startMatch && endMatch) {
        onSuccess();
      }
    }
  }, [startValue, endValue, onSuccess]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Card sx={{ width: 550, bgcolor: 'background.paper' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Night shift (dark mode)</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Cross-month range with Cancel/OK action bar.
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
    </ThemeProvider>
  );
}
