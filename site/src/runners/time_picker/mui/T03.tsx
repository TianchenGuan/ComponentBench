'use client';

/**
 * time_picker-mui-T03: Clear the snooze time using Clear action
 *
 * A centered isolated card contains one MUI X MobileTimePicker labeled "Snooze time", pre-filled with 10:15
 * (24-hour). Clicking the field opens a mobile-style dialog. The dialog includes an action bar at the bottom that has a
 * visible "Clear" button (configured via the picker action bar actions). Pressing "Clear" resets the value to empty and
 * closes the dialog. There are no other fields or dialogs on the page.
 *
 * Success: The "Snooze time" TimePicker has no selected time (canonical empty value).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { LocalizationProvider, MobileTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(dayjs('10:15', 'HH:mm'));

  useEffect(() => {
    if (value === null) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Alarm Settings</Typography>
          <Box>
            <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Snooze time
            </Typography>
            <MobileTimePicker
              value={value}
              onChange={(newValue) => setValue(newValue)}
              ampm={false}
              slotProps={{
                actionBar: {
                  actions: ['clear', 'cancel', 'accept'],
                },
                textField: {
                  fullWidth: true,
                  inputProps: { 'data-testid': 'tp-snooze' },
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              (Clear this value)
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
