'use client';

/**
 * time_input_text-mui-T07: Match a reference time shown on a dashboard card
 * 
 * Layout: dashboard centered. Light theme, comfortable spacing.
 * Two dashboard cards are visible side-by-side:
 * 1) "Sample alarm" card showing a large digital time display reading "07:45".
 * 2) "Alarm settings" card containing a single MUI X TimeField labeled "Alarm time" (initially empty).
 * - TimeField configuration: format='HH:mm', clearable=false.
 * - Clutter=medium: the dashboard also shows a small notification bell icon and two unrelated statistic chips, but nothing blocks the fields.
 * Only the Alarm time field determines success; the sample alarm card is a reference.
 * 
 * Success: The TimeField labeled "Alarm time" equals the reference time in canonical 'HH:mm' (07:45).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Chip, Stack } from '@mui/material';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import NotificationsIcon from '@mui/icons-material/Notifications';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const REFERENCE_TIME = '07:45';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (value && value.isValid() && value.format('HH:mm') === REFERENCE_TIME) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Reference card */}
        <Card sx={{ width: 200 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Sample alarm
            </Typography>
            <Typography 
              variant="h3" 
              component="div" 
              data-testid="sample-alarm-time"
              sx={{ fontFamily: 'monospace', textAlign: 'center', my: 2 }}
            >
              {REFERENCE_TIME}
            </Typography>
          </CardContent>
        </Card>

        {/* Settings card */}
        <Card sx={{ width: 280 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="h6">Alarm settings</Typography>
              <NotificationsIcon fontSize="small" color="action" />
            </Box>
            
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip label="Active: 3" size="small" />
              <Chip label="Snoozed: 1" size="small" variant="outlined" />
            </Stack>
            
            <Box>
              <Typography component="label" htmlFor="alarm-time" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
                Alarm time
              </Typography>
              <TimeField
                value={value}
                onChange={(newValue) => setValue(newValue)}
                format="HH:mm"
                slotProps={{
                  textField: {
                    id: 'alarm-time',
                    fullWidth: true,
                    inputProps: {
                      'data-testid': 'alarm-time',
                    },
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
}
