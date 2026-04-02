'use client';

/**
 * datetime_picker_single-mui-T03: MUI open picker overlay (desktop)
 *
 * Layout: isolated card centered.
 * Component: one MUI X DesktopDateTimePicker labeled "Start time".
 * Picker UI: opens in a popover attached to the field.
 * Initial state: empty value; placeholder shows "MM/DD/YYYY hh:mm aa".
 * This task ends when the picker popover is open for the correct field and the value is still empty.
 *
 * Success: The "Start time" picker popover is open (calendar/time UI visible). The committed value remains empty.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen && value === null) {
      onSuccess();
    }
  }, [isOpen, value, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Schedule</Typography>
          <Box>
            <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Start time
            </Typography>
            <DateTimePicker
              value={value}
              onChange={(newValue) => setValue(newValue)}
              open={isOpen}
              onOpen={() => setIsOpen(true)}
              onClose={() => setIsOpen(false)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  inputProps: { 'data-testid': 'dt-start' },
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
