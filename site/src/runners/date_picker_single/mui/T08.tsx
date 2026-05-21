'use client';

/**
 * date_picker_single-mui-T08: Pick a far future date using year navigation (2037-11-05)
 *
 * Scene: Centered isolated card, light theme, comfortable spacing.
 *
 * Target component: One MUI X DatePicker labeled "Warranty expiration".
 * - Initial state: empty.
 * - Opening the picker shows a month view around a near-term reference date.
 * - To reach year 2037, the user must switch to the year selection view (via the header/toolbar) and scroll/select the correct year, then navigate to November and select day 5.
 *
 * Distractors: None.
 *
 * Feedback: Once a full date is selected, the picker commits the value (desktop behavior) and shows it in the field.
 *
 * Success: Date picker must have selected date = 2037-11-05.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.isValid() && value.format('YYYY-MM-DD') === '2037-11-05') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Product warranty</Typography>
          <Box>
            <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Warranty expiration
            </Typography>
            <DatePicker
              value={value}
              onChange={(newValue) => setValue(newValue)}
              format="YYYY-MM-DD"
              views={['year', 'month', 'day']}
              openTo="year"
              slotProps={{
                textField: {
                  fullWidth: true,
                  placeholder: 'YYYY-MM-DD',
                  inputProps: {
                    'data-testid': 'warranty-expiration',
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
