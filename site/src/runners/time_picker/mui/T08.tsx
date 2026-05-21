'use client';

/**
 * time_picker-mui-T08: Set wake-up time to 6:05 AM (mobile dialog, OK required, dark theme)
 *
 * The page uses a dark theme but otherwise follows the baseline isolated-card layout. The card contains
 * a single MUI X MobileTimePicker labeled "Wake-up time" using 12-hour format (ampm=true). Clicking the field opens a mobile-style
 * dialog with hour and minute selection. The dialog includes an AM/PM control and the default action bar at the bottom with
 * "Cancel" and "OK" buttons. The picker is configured so the value is only accepted when "OK" is pressed (closeOnSelect
 * is false and acceptance uses the action bar).
 *
 * Scene: theme=dark
 *
 * Success: The "Wake-up time" picker has canonical time value exactly 06:05 (24-hour equivalent of 6:05 AM).
 *          The value must be accepted by pressing the dialog's "OK" button.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { LocalizationProvider, MobileTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.format('HH:mm') === '06:05') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Card sx={{ width: 400 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Morning Alarm</Typography>
            <Box>
              <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
                Wake-up time
              </Typography>
              <MobileTimePicker
                value={value}
                onChange={(newValue) => setValue(newValue)}
                ampm={true}
                closeOnSelect={false}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    inputProps: { 'data-testid': 'tp-wakeup' },
                  },
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                (Set to 6:05 AM and confirm with OK)
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
