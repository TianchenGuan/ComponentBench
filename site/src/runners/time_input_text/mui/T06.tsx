'use client';

/**
 * time_input_text-mui-T06: Fix an invalid time to satisfy a range constraint
 * 
 * Layout: form_section centered. Light theme, comfortable spacing.
 * A form section titled "Business rules" contains one MUI X TimeField labeled "Business hours time".
 * - Configuration: format='HH:mm', minTime=09:00, maxTime=17:00. The component displays an inline error message when out of range.
 * - Initial state: value is 08:00 and the field is marked invalid (red state) with helper text like "Time must be between 09:00 and 17:00".
 * - Distractors (clutter=low): a disabled checkbox and a short paragraph; no other editable fields.
 * - Success depends only on making the TimeField value 16:30 and valid.
 * 
 * Success: The TimeField labeled "Business hours time" has value 16:30 (24-hour).
 *          The field is in a valid state (no validation error displayed / validation flag false).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, FormControlLabel, Checkbox } from '@mui/material';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(dayjs('08:00', 'HH:mm'));
  
  const minTime = dayjs('09:00', 'HH:mm');
  const maxTime = dayjs('17:00', 'HH:mm');
  
  const isValid = value && value.isValid() && 
    !value.isBefore(minTime) && 
    !value.isAfter(maxTime);

  useEffect(() => {
    if (value && value.isValid() && value.format('HH:mm') === '16:30' && isValid) {
      onSuccess();
    }
  }, [value, isValid, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 450 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Business rules</Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Set operational hours within business constraints.
          </Typography>
          
          <FormControlLabel
            control={<Checkbox disabled />}
            label="Enable overtime (disabled)"
            sx={{ mb: 2 }}
          />
          
          <Box>
            <Typography component="label" htmlFor="business-hours-time" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Business hours time
            </Typography>
            <TimeField
              value={value}
              onChange={(newValue) => setValue(newValue)}
              format="HH:mm"
              minTime={minTime}
              maxTime={maxTime}
              slotProps={{
                textField: {
                  id: 'business-hours-time',
                  fullWidth: true,
                  error: !isValid,
                  helperText: !isValid ? 'Time must be between 09:00 and 17:00' : '',
                  inputProps: {
                    'data-testid': 'business-hours-time',
                    'aria-invalid': !isValid,
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
