'use client';

/**
 * date_picker_single-mui-T06: Navigate to next month in dark theme
 *
 * Scene: Centered isolated card in dark theme with comfortable spacing.
 *
 * Target component: One MUI X DesktopDatePicker labeled "Report date".
 * - Initial state: empty.
 * - Reference month: When opened, the calendar view starts on January 2026 (so selecting a February date requires moving to the next month).
 * - Interaction: Use the header next-month control to move from January to February, then select day 14.
 *
 * Distractors: None.
 *
 * Feedback: On desktop, selecting a day commits immediately and closes the popover.
 *
 * Success: Date picker must have selected date = 2026-02-14.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.isValid() && value.format('YYYY-MM-DD') === '2026-02-14') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Report date</Typography>
          <Box>
            <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Report date
            </Typography>
            <DatePicker
              value={value}
              onChange={(newValue) => setValue(newValue)}
              format="YYYY-MM-DD"
              referenceDate={dayjs('2026-01-01')}
              slotProps={{
                textField: {
                  fullWidth: true,
                  placeholder: 'YYYY-MM-DD',
                  inputProps: {
                    'data-testid': 'report-date',
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
