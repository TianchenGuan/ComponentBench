'use client';

/**
 * date_picker_single-mui-T01: Pick project start date (desktop popover)
 *
 * Scene: Centered isolated card, light theme, comfortable spacing, default scale.
 *
 * Target component: One MUI X DesktopDatePicker labeled "Project start date".
 * - Initial state: empty field with placeholder "YYYY-MM-DD".
 * - Interaction: Clicking the field or the calendar icon opens a desktop popover with a month view calendar.
 * - Sub-controls: Month navigation arrows in the header; month/year label opens higher-level views depending on configuration.
 *
 * Distractors: None.
 *
 * Feedback: Selecting a day updates the field immediately and closes the popover (desktop close-on-select behavior).
 *
 * Success: Date picker must have selected date = 2026-03-05.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.isValid() && value.format('YYYY-MM-DD') === '2026-03-05') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Project start date</Typography>
          <Box>
            <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Project start date
            </Typography>
            <DatePicker
              value={value}
              onChange={(newValue) => setValue(newValue)}
              format="YYYY-MM-DD"
              slotProps={{
                textField: {
                  fullWidth: true,
                  placeholder: 'YYYY-MM-DD',
                  inputProps: {
                    'data-testid': 'project-start-date',
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
