'use client';

/**
 * time_picker-mui-T02: Open the start time picker popover
 *
 * A centered isolated card contains one MUI X DesktopTimePicker labeled "Start time". The field is empty.
 * The picker can be opened by clicking the input field or the adjacent open-picker (clock) button. When opened, the popover
 * shows the hour/minute selection UI. There are no other popovers, menus, or dialogs on the page.
 *
 * Success: The "Start time" MUI TimePicker overlay (popover) is open/visible.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { LocalizationProvider, DesktopTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      onSuccess();
    }
  }, [isOpen, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Schedule</Typography>
          <Box>
            <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Start time
            </Typography>
            <DesktopTimePicker
              value={value}
              onChange={(newValue) => setValue(newValue)}
              open={isOpen}
              onOpen={() => setIsOpen(true)}
              onClose={() => setIsOpen(false)}
              ampm={false}
              slotProps={{
                textField: {
                  fullWidth: true,
                  inputProps: { 'data-testid': 'tp-start' },
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              (Open picker)
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
