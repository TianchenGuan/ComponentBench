'use client';

/**
 * time_picker-mui-T05: Set To time to 18:30 in a settings panel
 *
 * The page shows a settings-panel layout with a left sidebar (non-interactive headings) and a main panel
 * titled "Availability". In the main panel are a few toggles and helper text (low clutter). The target components are two
 * MUI X TimePicker fields labeled "From time" and "To time". Both are in 24-hour format and use the standard MUI open-picker
 * icon to open the time selection UI. Initial values are 09:00 and 17:00 respectively. Only the "To time" field should be
 * changed to 18:30.
 *
 * Scene: layout=settings_panel, instances=2, clutter=low
 *
 * Success: The TimePicker labeled "To time" has canonical time value exactly 18:30 (HH:mm, 24-hour).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Switch, FormControlLabel, Divider } from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [fromTime, setFromTime] = useState<Dayjs | null>(dayjs('09:00', 'HH:mm'));
  const [toTime, setToTime] = useState<Dayjs | null>(dayjs('17:00', 'HH:mm'));

  useEffect(() => {
    if (toTime && toTime.format('HH:mm') === '18:30') {
      onSuccess();
    }
  }, [toTime, onSuccess]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Sidebar (non-interactive) */}
        <Box sx={{ width: 160, bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>Settings</Typography>
          <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>Profile</Typography>
          <Typography variant="body2" sx={{ mt: 1, color: '#1976d2', fontWeight: 500 }}>Availability</Typography>
          <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>Notifications</Typography>
        </Box>

        {/* Main panel */}
        <Card sx={{ flex: 1, maxWidth: 400 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Availability</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Set your working hours for calendar visibility.
            </Typography>

            {/* Clutter */}
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Show as available"
              sx={{ mb: 2, display: 'block' }}
            />
            <Divider sx={{ mb: 2 }} />

            {/* Target fields */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block', fontSize: 14 }}>
                  From time
                </Typography>
                <TimePicker
                  value={fromTime}
                  onChange={(newValue) => setFromTime(newValue)}
                  ampm={false}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      inputProps: { 'data-testid': 'tp-from' },
                    },
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography component="label" sx={{ fontWeight: 500, mb: 1, display: 'block', fontSize: 14 }}>
                  To time
                </Typography>
                <TimePicker
                  value={toTime}
                  onChange={(newValue) => setToTime(newValue)}
                  ampm={false}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      inputProps: { 'data-testid': 'tp-to' },
                    },
                  }}
                />
              </Box>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              (Set To time to 18:30)
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
}
