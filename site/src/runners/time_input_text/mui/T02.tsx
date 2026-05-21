'use client';

/**
 * time_input_text-mui-T02: Set time in MUI X TimeField (24h)
 * 
 * Layout: isolated_card centered, light theme, comfortable spacing.
 * A single MUI X TimeField labeled "Standup time" is displayed.
 * - Configuration: format='HH:mm' (24-hour, minutes), clearable=false.
 * - Initial state: empty.
 * - The field uses section-based editing (hours and minutes). On keyboard-driven flows, entering edit mode may require pressing Enter as indicated by the component.
 * - No other inputs; clutter=none.
 * 
 * Success: The TimeField labeled "Standup time" has value 09:45 (24-hour, minutes).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.isValid() && value.format('HH:mm') === '09:45') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Daily Schedule</Typography>
          <Box>
            <Typography component="label" htmlFor="standup-time" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Standup time
            </Typography>
            <TimeField
              value={value}
              onChange={(newValue) => setValue(newValue)}
              format="HH:mm"
              slotProps={{
                textField: {
                  id: 'standup-time',
                  fullWidth: true,
                  inputProps: {
                    'data-testid': 'standup-time',
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
