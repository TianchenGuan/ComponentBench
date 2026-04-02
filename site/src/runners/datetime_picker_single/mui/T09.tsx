'use client';

/**
 * datetime_picker_single-mui-T09: MUI small field with seconds (typed)
 *
 * Layout: isolated card anchored near the bottom-right of the viewport.
 * Scale: small (reduced font size and smaller input height).
 * Component: one MUI X DateTimePicker in desktop mode configured to include seconds (views include 'seconds'; field format shows hh:mm:ss).
 * Editing: section-based field supports seconds as a separate editable segment.
 * Initial state: empty; placeholder looks like "MM/DD/YYYY hh:mm:ss aa".
 * No action bar buttons; commit happens on valid value + blur.
 *
 * Success: The "Audit timestamp" picker equals 02/22/2026 07:05:30 PM exactly (local time).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.format('YYYY-MM-DD HH:mm:ss') === '2026-02-22 19:05:30') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 350 }}>
        <CardContent sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>Audit Log</Typography>
          <Box>
            <Typography component="label" sx={{ fontWeight: 500, mb: 0.5, display: 'block', fontSize: 13 }}>
              Audit timestamp
            </Typography>
            <DateTimePicker
              value={value}
              onChange={(newValue) => setValue(newValue)}
              views={['year', 'month', 'day', 'hours', 'minutes', 'seconds']}
              format="MM/DD/YYYY hh:mm:ss A"
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: true,
                  inputProps: { 'data-testid': 'dt-audit' },
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
