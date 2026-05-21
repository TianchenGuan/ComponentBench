'use client';

/**
 * time_input_text-mui-T05: Enter a 12-hour time with meridiem in MUI X TimeField
 * 
 * Layout: isolated_card centered, light theme, comfortable spacing.
 * A single MUI X TimeField labeled "Afternoon check-in" is displayed.
 * - Configuration: format='hh:mm a', ampm=true (shows meridiem), clearable=false.
 * - Initial state: empty.
 * - The field exposes hour/minute/meridiem sections.
 * - No distractors; clutter=none.
 * 
 * Success: The TimeField labeled "Afternoon check-in" has canonical 24-hour value 15:30 (displayed as 3:30 PM).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.isValid() && value.format('HH:mm') === '15:30') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Check-ins</Typography>
          <Box>
            <Typography component="label" htmlFor="afternoon-checkin" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Afternoon check-in
            </Typography>
            <TimeField
              value={value}
              onChange={(newValue) => setValue(newValue)}
              format="hh:mm a"
              ampm
              slotProps={{
                textField: {
                  id: 'afternoon-checkin',
                  fullWidth: true,
                  inputProps: {
                    'data-testid': 'afternoon-checkin',
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
