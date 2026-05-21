'use client';

/**
 * datetime_picker_single-mui-T08: MUI dark compact two-instance end datetime with OK
 *
 * Theme: dark mode. Spacing: compact.
 * Layout: settings_panel with a vertical nav on the left and a dense "Release window" section on the right.
 * Instances: 2 MUI X DesktopDateTimePickers stacked closely:
 *   - "Start datetime"
 *   - "End datetime"  ← TARGET
 * Clutter (medium): several toggles (Enable notifications, Auto-rollout), a numeric input (Max users), and a Save button (not required).
 * Picker configuration: desktop popover, but an action bar is enabled with Cancel + OK (accept). closeOnSelect=false so OK is required to commit.
 * Initial state:
 *   - Start datetime: 03/05/2026 10:00 PM
 *   - End datetime: 03/05/2026 11:00 PM (must change minutes to 59 and commit)
 *
 * Success: Only the "End datetime" picker is committed to 2026-03-05 23:59. OK/accept is required (closeOnSelect=false).
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Switch, FormControlLabel, TextField, Button, Divider } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function T08({ onSuccess }: TaskComponentProps) {
  const [startDatetime, setStartDatetime] = useState<Dayjs | null>(dayjs('2026-03-05 22:00', 'YYYY-MM-DD HH:mm'));
  const [endDatetime, setEndDatetime] = useState<Dayjs | null>(dayjs('2026-03-05 23:00', 'YYYY-MM-DD HH:mm'));
  const [notifications, setNotifications] = useState(true);
  const [autoRollout, setAutoRollout] = useState(false);

  useEffect(() => {
    if (endDatetime && endDatetime.format('YYYY-MM-DD HH:mm') === '2026-03-05 23:55') {
      onSuccess();
    }
  }, [endDatetime, onSuccess]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Left sidebar */}
          <Box sx={{ width: 160, bgcolor: '#1e1e1e', p: 2, borderRadius: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Settings</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: '#888' }}>General</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: '#90caf9', fontWeight: 500 }}>Release window</Typography>
            <Typography variant="body2" sx={{ mt: 1, color: '#888' }}>Notifications</Typography>
          </Box>

          {/* Main panel */}
          <Card sx={{ flex: 1, maxWidth: 400 }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Release window</Typography>

              {/* Clutter controls */}
              <FormControlLabel
                control={<Switch size="small" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />}
                label="Enable notifications"
                sx={{ mb: 1, display: 'flex' }}
              />
              <FormControlLabel
                control={<Switch size="small" checked={autoRollout} onChange={(e) => setAutoRollout(e.target.checked)} />}
                label="Auto-rollout"
                sx={{ mb: 1, display: 'flex' }}
              />
              <TextField
                size="small"
                label="Max users"
                type="number"
                defaultValue={100}
                sx={{ mb: 2, width: 120 }}
              />
              <Divider sx={{ mb: 2 }} />

              {/* Target datetime pickers */}
              <Box sx={{ mb: 2 }}>
                <Typography component="label" sx={{ fontWeight: 500, mb: 0.5, display: 'block', fontSize: 14 }}>
                  Start datetime
                </Typography>
                <DateTimePicker
                  value={startDatetime}
                  onChange={(newValue) => setStartDatetime(newValue)}
                  closeOnSelect={false}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      inputProps: { 'data-testid': 'dt-start' },
                    },
                    actionBar: {
                      actions: ['cancel', 'accept'],
                    },
                  }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography component="label" sx={{ fontWeight: 500, mb: 0.5, display: 'block', fontSize: 14 }}>
                  End datetime
                </Typography>
                <DateTimePicker
                  value={endDatetime}
                  onChange={(newValue) => setEndDatetime(newValue)}
                  closeOnSelect={false}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      inputProps: { 'data-testid': 'dt-end' },
                    },
                    actionBar: {
                      actions: ['cancel', 'accept'],
                    },
                  }}
                />
              </Box>

              <Button variant="contained" size="small">Save</Button>
            </CardContent>
          </Card>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
