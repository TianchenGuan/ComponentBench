'use client';

/**
 * time_input_text-mui-T04: Enter time with seconds in MUI X TimeField
 * 
 * Layout: isolated_card centered, light theme, comfortable spacing.
 * A single MUI X TimeField labeled "Timestamp" is shown.
 * - Configuration: format='HH:mm:ss' (includes seconds), clearable=false.
 * - Initial state: empty.
 * - The field uses section-based editing for hours, minutes, and seconds.
 * - No distractors; clutter=none.
 * 
 * Success: The TimeField labeled "Timestamp" has value 12:34:56 (24-hour, seconds).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.isValid() && value.format('HH:mm:ss') === '12:34:56') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Precision Timing</Typography>
          <Box>
            <Typography component="label" htmlFor="timestamp" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Timestamp
            </Typography>
            <TimeField
              value={value}
              onChange={(newValue) => setValue(newValue)}
              format="HH:mm:ss"
              slotProps={{
                textField: {
                  id: 'timestamp',
                  fullWidth: true,
                  placeholder: 'HH:MM:SS',
                  inputProps: {
                    'data-testid': 'timestamp',
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
