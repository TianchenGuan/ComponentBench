'use client';

/**
 * datetime_picker_single-mui-T04: MUI mobile modal with OK/Cancel
 *
 * Layout: isolated card centered.
 * Component: MUI X MobileDateTimePicker labeled "Delivery window start" (forced mobile variant).
 * Picker UI: opens in a modal dialog (not a popover). Date and time are selected in a step-based flow (date → time), with an action bar at the bottom.
 * Action bar: includes "Cancel" and "OK" (accept). The value is only committed when OK is pressed.
 * Initial state: empty.
 *
 * Success: The MobileDateTimePicker labeled "Delivery window start" is committed to 2026-02-18 15:30. OK (accept) is required to apply the value.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.format('YYYY-MM-DD HH:mm') === '2026-02-18 15:30') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Delivery Settings</Typography>
          <Box>
            <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Delivery window start
            </Typography>
            <MobileDateTimePicker
              value={value}
              onChange={(newValue) => setValue(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  inputProps: { 'data-testid': 'dt-delivery' },
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
