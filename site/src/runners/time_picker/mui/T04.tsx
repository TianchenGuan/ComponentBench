'use client';

/**
 * time_picker-mui-T04: Type a specific time (14:20) into the picker field
 *
 * A centered isolated card contains one MUI X DesktopTimePicker labeled "Check-in time", pre-filled with
 * 13:00. The field is editable (keyboard input allowed) and uses a 24-hour HH:mm format. The open-picker clock button is
 * present, but for this task the intended interaction is direct formatted entry into the text field (with standard MUI validation/formatting
 * behavior). There are no other inputs on the page.
 *
 * Success: The "Check-in time" field has canonical time value exactly 14:20 (HH:mm, 24-hour).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { LocalizationProvider, DesktopTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(dayjs('13:00', 'HH:mm'));

  useEffect(() => {
    if (value && value.format('HH:mm') === '14:20') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Check-in</Typography>
          <Box>
            <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Check-in time
            </Typography>
            <DesktopTimePicker
              value={value}
              onChange={(newValue) => setValue(newValue)}
              ampm={false}
              slotProps={{
                textField: {
                  fullWidth: true,
                  inputProps: { 'data-testid': 'tp-checkin' },
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              (Change to 14:20)
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
