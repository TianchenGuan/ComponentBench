'use client';

/**
 * date_input_text-mui-T01: MUI DateField basic typed date (MM/DD/YYYY)
 * 
 * Layout: isolated_card centered in the viewport.
 * Component: One MUI X DateField labeled "Birthday".
 * Visuals/behavior: the field shows a placeholder like "MM/DD/YYYY" and uses a sectioned input (month/day/year sections) typical of MUI X fields.
 * Initial state: empty; no popover is open (field-only).
 * Sub-controls: a calendar icon is not shown (DateField only); the user edits directly in the field.
 * Distractors: none.
 * Feedback: once a valid date is entered, the field displays it in MM/DD/YYYY and the internal value becomes a valid date object.
 * 
 * Success: The DateField value (canonical date) equals 2026-03-15.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { DateField } from '@mui/x-date-pickers/DateField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.isValid() && value.format('YYYY-MM-DD') === '2026-03-15') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Profile</Typography>
          <Box>
            <Typography component="label" htmlFor="birthday-datefield" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Birthday
            </Typography>
            <DateField
              value={value}
              onChange={(newValue) => setValue(newValue)}
              format="MM/DD/YYYY"
              slotProps={{
                textField: {
                  id: 'birthday-datefield',
                  fullWidth: true,
                  placeholder: 'MM/DD/YYYY',
                  inputProps: {
                    'data-testid': 'birthday-datefield',
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
