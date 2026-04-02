'use client';

/**
 * time_picker-mui-T09: Set Start time to 10:09:45 (seconds, two fields, OK required)
 *
 * The page shows a form section titled "Recording window". It contains two MUI X DesktopTimePicker fields
 * labeled "Start time" and "End time". Both pickers are configured to include seconds using views=['hours','minutes','seconds']
 * and display values as HH:mm:ss. To make acceptance explicit, the desktop picker includes an action bar with "Cancel" and
 * "OK" buttons (configured via slotProps.actionBar actions). The initial values are Start time=10:00:00 and End time=10:30:00.
 * Only the Start time field should be changed and must be confirmed with OK.
 *
 * Scene: layout=form_section, instances=2, clutter=low
 *
 * Success: The "Start time" picker has canonical time value exactly 10:09:45 (HH:mm:ss, 24-hour).
 *          The value is applied via the picker's "OK" action (desktop action bar).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { LocalizationProvider, DesktopTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [startTime, setStartTime] = useState<Dayjs | null>(dayjs('10:00:00', 'HH:mm:ss'));
  const [endTime, setEndTime] = useState<Dayjs | null>(dayjs('10:30:00', 'HH:mm:ss'));

  useEffect(() => {
    if (startTime && startTime.format('HH:mm:ss') === '10:09:45') {
      onSuccess();
    }
  }, [startTime, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 500 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Recording window</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Configure the recording start and end times with second precision.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block', fontSize: 14 }}>
                Start time
              </Typography>
              <DesktopTimePicker
                value={startTime}
                onChange={(newValue) => setStartTime(newValue)}
                views={['hours', 'minutes', 'seconds']}
                format="HH:mm:ss"
                ampm={false}
                slotProps={{
                  actionBar: {
                    actions: ['cancel', 'accept'],
                  },
                  textField: {
                    fullWidth: true,
                    inputProps: { 'data-testid': 'tp-start' },
                  },
                }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block', fontSize: 14 }}>
                End time
              </Typography>
              <DesktopTimePicker
                value={endTime}
                onChange={(newValue) => setEndTime(newValue)}
                views={['hours', 'minutes', 'seconds']}
                format="HH:mm:ss"
                ampm={false}
                slotProps={{
                  actionBar: {
                    actions: ['cancel', 'accept'],
                  },
                  textField: {
                    fullWidth: true,
                    inputProps: { 'data-testid': 'tp-end' },
                  },
                }}
              />
            </Box>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            (Set Start time to 10:09:45 and confirm with OK)
          </Typography>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
