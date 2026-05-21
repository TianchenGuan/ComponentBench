'use client';

/**
 * date_picker_single-mui-T02: Confirm a date in mobile dialog (OK required)
 *
 * Scene: Centered isolated card, light theme, comfortable spacing.
 *
 * Target component: One MUI X MobileDatePicker labeled "Travel date".
 * - Initial state: empty.
 * - Interaction: Activating the field opens a modal dialog date picker (mobile variant).
 * - Action bar: The dialog shows "Cancel" and "OK" (accept) actions. A date click highlights the day but does not commit until "OK" is pressed.
 *
 * Distractors: None.
 *
 * Feedback: Pressing "OK" commits the selected date into the field and closes the dialog.
 *
 * Success: Date picker must have selected date = 2026-04-21. Selection must be confirmed by clicking the picker 'OK' control.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.isValid() && value.format('YYYY-MM-DD') === '2026-04-21') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Travel date</Typography>
          <Box>
            <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Travel date
            </Typography>
            <MobileDatePicker
              value={value}
              onChange={(newValue) => setValue(newValue)}
              format="YYYY-MM-DD"
              slotProps={{
                textField: {
                  fullWidth: true,
                  placeholder: 'YYYY-MM-DD',
                  inputProps: {
                    'data-testid': 'travel-date',
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
