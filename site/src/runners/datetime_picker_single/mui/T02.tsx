'use client';

/**
 * datetime_picker_single-mui-T02: MUI typed datetime in sectioned field
 *
 * Layout: isolated card centered.
 * Component: one MUI X DateTimePicker in desktop mode. The text field uses section-based editing (month/day/year/hour/minute/AM-PM).
 * Hint text below the field: "Tip: Press Enter to start editing, then type." (mirrors MUI docs behavior).
 * No action bar buttons; committing is done by finishing a valid value and blurring the field.
 * Initial state: empty.
 *
 * Success: The DateTimePicker labeled "Logged at" equals 2026-02-12 08:45 AM (local time).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.format('YYYY-MM-DD HH:mm') === '2026-02-12 08:45') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Log Entry</Typography>
          <Box>
            <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Logged at
            </Typography>
            <DateTimePicker
              value={value}
              onChange={(newValue) => setValue(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  inputProps: { 'data-testid': 'dt-logged' },
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Tip: Press Enter to start editing, then type.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
