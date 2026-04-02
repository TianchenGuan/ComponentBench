'use client';

/**
 * datetime_picker_range-mui-T05: Delivery window: match the on-page reference (corner placement)
 *
 * Layout: isolated_card anchored near the bottom-right of the viewport.
 * Light theme, comfortable spacing, default scale.
 * A small 'Reference' card above the picker displays the target range as formatted text.
 * Composite of two MUI DateTimePicker inputs.
 * Initial state: empty. No other UI elements.
 *
 * Success: start=2026-05-12T10:00:00, end=2026-05-12T12:00:00 (local time).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Paper, Stack } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [startValue, setStartValue] = useState<Dayjs | null>(null);
  const [endValue, setEndValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (startValue && endValue) {
      const startMatch = startValue.format('YYYY-MM-DD HH:mm') === '2026-05-12 10:00';
      const endMatch = endValue.format('YYYY-MM-DD HH:mm') === '2026-05-12 12:00';
      if (startMatch && endMatch) {
        onSuccess();
      }
    }
  }, [startValue, endValue, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 500 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Delivery Setup</Typography>

          {/* Reference panel */}
          <Paper
            elevation={0}
            sx={{
              mb: 2,
              p: 1.5,
              bgcolor: '#e3f2fd',
              border: '1px solid #90caf9',
              borderRadius: 1,
            }}
            data-testid="reference-panel"
          >
            <Typography variant="subtitle2" fontWeight={600}>Reference</Typography>
            <Typography variant="body2">05/12/2026 10:00 AM – 05/12/2026 12:00 PM</Typography>
          </Paper>

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
