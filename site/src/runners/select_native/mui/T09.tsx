'use client';

/**
 * select_native-mui-T09: Scroll to Report format and set to CSV
 *
 * Layout: a settings panel with its own vertical scroll region (the panel is taller than the viewport).
 * The panel contains multiple sections (Account, Notifications, Privacy) with toggles and text fields as distractors.
 *
 * The target is in the "Exports" section near the bottom of the panel:
 * - A MUI NativeSelect labeled "Report format"
 *
 * Options (label → value):
 * - PDF → pdf
 * - CSV → csv  ← TARGET
 * - JSON → json
 *
 * Initial state: "PDF" is selected.
 * Clutter: medium — there are several non-target toggles above and below, plus a "Download sample" button (does nothing for success).
 * Feedback: immediate; no Save/Apply.
 *
 * Success: The target native select has selected option value 'csv' (label 'CSV').
 */

import React, { useState } from 'react';
import {
  Card, CardContent, Typography, FormControl, InputLabel,
  NativeSelect, Box, Switch, FormControlLabel, TextField, Button, Divider
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const formatOptions = [
  { label: 'PDF', value: 'pdf' },
  { label: 'CSV', value: 'csv' },
  { label: 'JSON', value: 'json' },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [format, setFormat] = useState<string>('pdf');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  const handleFormatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setFormat(value);
    if (value === 'csv') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 450, maxHeight: 400, overflow: 'auto' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Settings</Typography>

        {/* Account Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="primary" gutterBottom>Account</Typography>
          <TextField
            fullWidth
            size="small"
            label="Display name"
            defaultValue="John Doe"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            size="small"
            label="Email"
            defaultValue="john@example.com"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Notifications Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="primary" gutterBottom>Notifications</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
            }
            label="Email notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={marketingEmails}
                onChange={(e) => setMarketingEmails(e.target.checked)}
              />
            }
            label="Marketing emails"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Privacy Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="primary" gutterBottom>Privacy</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
              />
            }
            label="Two-factor authentication"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Exports Section - TARGET */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="primary" gutterBottom>Exports</Typography>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel variant="standard" htmlFor="report-format-select">
              Report format
            </InputLabel>
            <NativeSelect
              data-testid="report-format-select"
              data-canonical-type="select_native"
              data-selected-value={format}
              value={format}
              onChange={handleFormatChange}
              inputProps={{
                name: 'report-format',
                id: 'report-format-select',
              }}
            >
              {formatOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </NativeSelect>
          </FormControl>

          <Button variant="outlined" size="small" sx={{ mt: 2 }}>
            Download sample
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
