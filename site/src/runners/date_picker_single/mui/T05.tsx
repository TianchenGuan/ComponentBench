'use client';

/**
 * date_picker_single-mui-T05: Enter a date in MM/DD/YYYY format
 *
 * Scene: Centered isolated card, light theme, comfortable spacing.
 *
 * Target component: One MUI X DatePicker with a single text field labeled "Holiday date".
 * - Field behavior: the input is a structured date field (segmented month/day/year). Users can type digits and move between sections with keyboard navigation.
 * - Format hint under the field: "MM/DD/YYYY".
 * - Initial state: empty (shows placeholder underscores).
 * - Invalid input shows an error helper text "Invalid date" and does not commit a value.
 *
 * Distractors: None.
 *
 * Feedback: When the entered date is valid, the internal picker value updates immediately and the calendar (if opened) reflects the entered date.
 *
 * Success: Date picker must have selected date = 2026-07-04.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.isValid() && value.format('YYYY-MM-DD') === '2026-07-04') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Holiday date</Typography>
          <Box>
            <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Holiday date
            </Typography>
            <DatePicker
              value={value}
              onChange={(newValue) => setValue(newValue)}
              format="MM/DD/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  helperText: 'MM/DD/YYYY',
                  inputProps: {
                    'data-testid': 'holiday-date',
                  },
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
