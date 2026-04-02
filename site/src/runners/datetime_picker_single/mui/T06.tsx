'use client';

/**
 * datetime_picker_single-mui-T06: MUI match reference card datetime
 *
 * Layout: dashboard with a small "Status" header, a reference card, and the target field beneath.
 * Guidance (visual): a prominent card labeled "Reference" shows the target datetime as large text:
 *   "Fri, Feb 27, 2026 — 3:00 PM"
 * Target component: one MUI X DesktopDateTimePicker labeled "Next sync time".
 * Initial state: field currently shows "02/27/2026 02:00 PM" (one hour early).
 * No OK/Cancel actions (default desktop). Selection commits when a valid value is set.
 *
 * Success: The "Next sync time" value matches the Reference card datetime (2026-02-27 15:00).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Paper } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(dayjs('2026-02-27 14:00', 'YYYY-MM-DD HH:mm'));

  useEffect(() => {
    if (value && value.format('YYYY-MM-DD HH:mm') === '2026-02-27 15:00') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ width: 400 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Status
        </Typography>

        {/* Reference card */}
        <Paper
          elevation={2}
          sx={{ p: 2, mb: 2, bgcolor: '#e3f2fd', textAlign: 'center' }}
          data-testid="ref-next-sync"
        >
          <Typography variant="caption" color="text.secondary">
            Reference
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
            Fri, Feb 27, 2026 — 3:00 PM
          </Typography>
        </Paper>

        {/* Target field */}
        <Card>
          <CardContent>
            <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Next sync time
            </Typography>
            <DateTimePicker
              value={value}
              onChange={(newValue) => setValue(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  inputProps: { 'data-testid': 'dt-sync' },
                },
              }}
            />
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
}
