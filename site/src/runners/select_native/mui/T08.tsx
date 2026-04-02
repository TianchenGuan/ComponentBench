'use client';

/**
 * select_native-mui-T08: Set time zone in modal and Save
 *
 * Layout: a profile page with a primary button "Edit profile". Clicking it opens a modal dialog (centered).
 * Inside the modal:
 * - Title: "Edit profile"
 * - Target component: MUI NativeSelect labeled "Time zone"
 * - Buttons in the modal footer: "Cancel" and "Save"
 *
 * Time zone options (label → value):
 * - Los Angeles (UTC−08:00) → America/Los_Angeles
 * - Denver (UTC−07:00) → America/Denver
 * - Chicago (UTC−06:00) → America/Chicago
 * - New York (UTC−05:00) → America/New_York  ← TARGET
 * - UTC → UTC
 *
 * Initial state: "Chicago (UTC−06:00)" is selected.
 * Clutter: low — one additional optional toggle "Show time zone abbreviation" appears above the buttons but does not affect success.
 * Feedback: selection changes immediately, but the modal does NOT close until "Save" is clicked (confirmation required).
 *
 * Success: The target native select has selected option value 'America/New_York' AND user clicks 'Save'.
 */

import React, { useState } from 'react';
import {
  Card, CardContent, Typography, FormControl, InputLabel,
  NativeSelect, Button, Box, Dialog, DialogTitle, DialogContent,
  DialogActions, FormControlLabel, Switch
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const timezoneOptions = [
  { label: 'Los Angeles (UTC−08:00)', value: 'America/Los_Angeles' },
  { label: 'Denver (UTC−07:00)', value: 'America/Denver' },
  { label: 'Chicago (UTC−06:00)', value: 'America/Chicago' },
  { label: 'New York (UTC−05:00)', value: 'America/New_York' },
  { label: 'UTC', value: 'UTC' },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [open, setOpen] = useState(false);
  const [timezone, setTimezone] = useState<string>('America/Chicago');
  const [showAbbrev, setShowAbbrev] = useState(false);

  const handleSave = () => {
    if (timezone === 'America/New_York') {
      onSuccess();
    }
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
    setTimezone('America/Chicago'); // Reset to initial
  };

  return (
    <>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Profile</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Manage your profile settings
          </Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>
            Edit profile
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel variant="standard" htmlFor="timezone-select">
              Time zone
            </InputLabel>
            <NativeSelect
              data-testid="timezone-select"
              data-canonical-type="select_native"
              data-selected-value={timezone}
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              inputProps={{
                name: 'timezone',
                id: 'timezone-select',
              }}
            >
              {timezoneOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </NativeSelect>
          </FormControl>

          <Box sx={{ mt: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={showAbbrev}
                  onChange={(e) => setShowAbbrev(e.target.checked)}
                />
              }
              label="Show time zone abbreviation"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
