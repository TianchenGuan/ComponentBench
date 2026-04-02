'use client';

/**
 * time_picker-mui-T06: Match the target time shown on a badge
 *
 * A small dashboard-style card titled "Call setup" is centered. At the top-right of the card, a non-interactive
 * badge labeled "Target time" displays a digital time (e.g., large digits "06:45"). Below the badge is one MUI X DesktopTimePicker
 * labeled "Call time" in 24-hour format. The task is specified visually: the numeric target is only shown inside the badge,
 * not repeated in the instruction. Opening the picker shows the standard hour/minute selection UI. Aside from the badge
 * and the picker, the card contains only a short helper sentence (low clutter).
 *
 * Scene: layout=dashboard, guidance=visual, clutter=low
 *
 * Success: The "Call time" TimePicker value equals the time displayed in the "Target time" badge (06:45).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { LocalizationProvider, DesktopTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.format('HH:mm') === '06:45') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ width: 380 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6">Call setup</Typography>
            {/* Target badge */}
            <Box
              data-testid="target-time-badge"
              sx={{
                bgcolor: '#e3f2fd',
                border: '1px solid #90caf9',
                borderRadius: 2,
                px: 2,
                py: 1,
                textAlign: 'center',
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Target time
              </Typography>
              <Typography variant="h5" sx={{ fontFamily: 'monospace', fontWeight: 700, color: '#1976d2' }}>
                06:45
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Set the call time to match the target.
          </Typography>

          <Box>
            <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
              Call time
            </Typography>
            <DesktopTimePicker
              value={value}
              onChange={(newValue) => setValue(newValue)}
              ampm={false}
              slotProps={{
                textField: {
                  fullWidth: true,
                  inputProps: { 'data-testid': 'tp-call-time' },
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              (Match the badge)
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
}
