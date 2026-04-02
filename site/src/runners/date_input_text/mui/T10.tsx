'use client';

/**
 * date_input_text-mui-T10: MUI fix a validation error and set an in-range date
 * 
 * Layout: form_section anchored near the bottom-left of the viewport.
 * Component: a single MUI X DatePicker input labeled "Compliance date" (manual typing supported).
 * Validation configuration: the field enforces an allowed range (minDate=01/01/2026, maxDate=12/31/2026) and shows an error helper text when out of range.
 * Initial state: the field is pre-filled with 01/01/2027 and is currently in an error state (red underline + helper text "Date must be within 2026").
 * Clutter (medium): there are two non-required controls nearby: a checkbox "Send reminder email" and a disabled text field "Compliance owner".
 * Feedback: when a valid in-range date is entered, the error state disappears and the helper text changes to "Looks good".
 * 
 * Success: The "Compliance date" value equals 2026-07-01 AND field is not in an error/invalid state.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Stack, FormControlLabel, Checkbox, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(dayjs('2027-01-01'));
  const minDate = dayjs('2026-01-01');
  const maxDate = dayjs('2026-12-31');

  const isValid = value && value.isValid() && value.isAfter(minDate.subtract(1, 'day')) && value.isBefore(maxDate.add(1, 'day'));
  const isTargetDate = value && value.isValid() && value.format('YYYY-MM-DD') === '2026-07-01';

  useEffect(() => {
    if (isTargetDate && isValid) {
      onSuccess();
    }
  }, [isTargetDate, isValid, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 420 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Compliance</Typography>
          
          <Stack spacing={2}>
            <Box>
              <Typography component="label" htmlFor="compliance-date" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
                Compliance date
              </Typography>
              <DatePicker
                value={value}
                onChange={(newValue) => setValue(newValue)}
                format="MM/DD/YYYY"
                minDate={minDate}
                maxDate={maxDate}
                slotProps={{
                  textField: {
                    id: 'compliance-date',
                    fullWidth: true,
                    error: !isValid,
                    helperText: isValid ? 'Looks good' : 'Date must be within 2026',
                    inputProps: {
                      'data-testid': 'compliance-date',
                    },
                  },
                }}
              />
            </Box>

            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Send reminder email"
            />

            <TextField
              label="Compliance owner"
              value="Legal Team"
              disabled
              fullWidth
            />
          </Stack>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
