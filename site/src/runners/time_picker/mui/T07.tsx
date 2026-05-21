'use client';

/**
 * time_picker-mui-T07: Set gym time to 7:45 PM (12-hour)
 *
 * A centered isolated card contains one MUI X DesktopTimePicker labeled "Gym time". The picker uses 12-hour
 * format (ampm=true), so the UI includes an AM/PM control and the field displays times like "7:45 PM". The field starts
 * empty. Clicking the open-picker button opens the hour view first, then the minute view. No other controls are present.
 *
 * Success: The "Gym time" TimePicker has canonical time value exactly 19:45 (24-hour equivalent of 7:45 PM).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { LocalizationProvider, DesktopTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.format('HH:mm') === '19:45') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Fitness Schedule</Typography>
          <Box>
            <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Gym time
            </Typography>
            <DesktopTimePicker
              value={value}
              onChange={(newValue) => setValue(newValue)}
              ampm={true}
              slotProps={{
                textField: {
                  fullWidth: true,
                  inputProps: { 'data-testid': 'tp-gym' },
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              (Set to 7:45 PM)
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
