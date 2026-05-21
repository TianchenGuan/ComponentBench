'use client';

/**
 * time_picker-mui-T01: Set reminder time to 08:00 (desktop picker)
 *
 * A centered isolated card contains one MUI X DesktopTimePicker labeled "Reminder time". The field uses
 * 24-hour time (ampm=false) and starts empty, showing a placeholder like "--:--". Clicking the field or the clock icon opens
 * the picker popover. The desktop picker shows the standard MUI time selection UI (clock-based views for hours and minutes).
 * The default views are hours then minutes. No other interactive elements are present.
 *
 * Success: The MUI TimePicker labeled "Reminder time" has canonical time value exactly 08:00 (HH:mm, 24-hour).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { LocalizationProvider, DesktopTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.format('HH:mm') === '08:00') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Settings</Typography>
          <Box>
            <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Reminder time
            </Typography>
            <DesktopTimePicker
              value={value}
              onChange={(newValue) => setValue(newValue)}
              ampm={false}
              slotProps={{
                textField: {
                  fullWidth: true,
                  inputProps: { 'data-testid': 'tp-reminder' },
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              (Set to 08:00)
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
