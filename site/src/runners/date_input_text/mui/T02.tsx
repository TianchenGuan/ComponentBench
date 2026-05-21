'use client';

/**
 * date_input_text-mui-T02: MUI DateField overwrite an existing date
 * 
 * Layout: isolated_card centered in the viewport.
 * Component: One MUI X DateField labeled "Start date".
 * Initial state: pre-filled with 02/10/2026.
 * Behavior: the DateField uses month/day/year sections; user can edit by selecting sections and typing.
 * Distractors: a read-only "Project name" text line above the field.
 * Feedback: the value updates in place when the edit is committed (blur/Enter).
 * 
 * Success: The "Start date" DateField value equals 2026-02-28.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { DateField } from '@mui/x-date-pickers/DateField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(dayjs('2026-02-10'));

  useEffect(() => {
    if (value && value.isValid() && value.format('YYYY-MM-DD') === '2026-02-28') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Project Details</Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Project name: <strong>Website Redesign</strong>
            </Typography>
          </Box>

          <Box>
            <Typography component="label" htmlFor="start-date" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Start date
            </Typography>
            <DateField
              value={value}
              onChange={(newValue) => setValue(newValue)}
              format="MM/DD/YYYY"
              slotProps={{
                textField: {
                  id: 'start-date',
                  fullWidth: true,
                  inputProps: {
                    'data-testid': 'start-date',
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
