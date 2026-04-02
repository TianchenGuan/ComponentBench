'use client';

/**
 * date_input_text-mui-T06: MUI scroll to find a date field in settings panel
 * 
 * Layout: settings_panel. The page has a left navigation rail (non-interactive for this task) and a main scrollable settings pane.
 * Target component: a MUI X DateField labeled "Data retention start date" located in the "Retention" section near the bottom of the scrollable pane (initially below the fold).
 * Initial state: the field is empty.
 * Other content (clutter=medium): multiple toggles, helper text paragraphs, and a numeric input appear above it; none affect success.
 * Behavior: standard sectioned MM/DD/YYYY input; no popovers.
 * Feedback: after entry, the field displays "08/01/2026" and the section header shows a small "Unsaved changes" dot (cosmetic).
 * 
 * Success: The "Data retention start date" DateField value equals 2026-08-01.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Switch, FormControlLabel, TextField, Divider, Stack, Chip } from '@mui/material';
import { DateField } from '@mui/x-date-pickers/DateField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Dayjs | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (value && value.isValid() && value.format('YYYY-MM-DD') === '2026-08-01') {
      onSuccess();
    }
  }, [value, onSuccess]);

  const handleDateChange = (newValue: Dayjs | null) => {
    setValue(newValue);
    setHasChanges(true);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Left navigation rail */}
        <Card sx={{ width: 180, height: 500 }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>Settings</Typography>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ color: 'text.secondary', cursor: 'pointer' }}>General</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', cursor: 'pointer' }}>Notifications</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', cursor: 'pointer' }}>Security</Typography>
              <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 500 }}>Data & Storage</Typography>
            </Stack>
          </CardContent>
        </Card>

        {/* Main scrollable settings pane */}
        <Card sx={{ width: 450, height: 500, overflow: 'auto' }} id="settings-scroll-container">
          <CardContent>
            <Typography variant="h6" gutterBottom>Data & Storage Settings</Typography>

            {/* Section: General Data */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>General Data</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Configure how your data is stored and managed across the system.
              </Typography>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Enable automatic backups"
              />
              <FormControlLabel
                control={<Switch />}
                label="Compress old files"
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Section: Storage Limits */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>Storage Limits</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Set storage quotas and limits for different data types.
              </Typography>
              <TextField
                label="Max storage (GB)"
                type="number"
                defaultValue={100}
                size="small"
                sx={{ width: 150 }}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Section: Notifications */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>Storage Notifications</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Receive alerts when storage thresholds are reached.
              </Typography>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Email notifications"
              />
              <FormControlLabel
                control={<Switch />}
                label="In-app notifications"
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Section: Retention (target section - below the fold) */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="subtitle2">Retention</Typography>
                {hasChanges && <Chip label="Unsaved changes" size="small" color="warning" />}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Configure data retention policies and cleanup schedules.
              </Typography>
              
              <Box>
                <Typography component="label" htmlFor="retention-start-date" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
                  Data retention start date
                </Typography>
                <DateField
                  value={value}
                  onChange={handleDateChange}
                  format="MM/DD/YYYY"
                  slotProps={{
                    textField: {
                      id: 'retention-start-date',
                      fullWidth: true,
                      placeholder: 'MM/DD/YYYY',
                      inputProps: {
                        'data-testid': 'retention-start-date',
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
}
