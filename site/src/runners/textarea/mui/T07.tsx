'use client';

/**
 * textarea-mui-T07: Out-of-office message found by scrolling
 *
 * A settings panel (settings_panel layout) is anchored near the top-left of the viewport.
 * - Light theme, comfortable spacing, default scale.
 * - The panel is long with multiple sections ("Profile", "Notifications", "Email", "Security").
 * - The "Email" section is below the fold and requires scrolling the panel to reach it.
 * - Within "Email", there is one multiline MUI TextField labeled "Out-of-office message", initially empty.
 * - Other sections contain toggles and dropdowns as clutter.
 *
 * Success: Value equals "I'm out of office until Feb 2. For urgent issues, contact the team." (trim)
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Divider,
  Box,
} from '@mui/material';
import type { TaskComponentProps } from '../types';

const TARGET_VALUE = "I'm out of office until Feb 2. For urgent issues, contact the team.";

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (value.trim() === TARGET_VALUE) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card sx={{ width: 400, maxHeight: '70vh', overflow: 'auto' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Settings
        </Typography>

        {/* Profile Section */}
        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Profile
        </Typography>
        <TextField label="Display name" fullWidth size="small" sx={{ mb: 1 }} />
        <TextField label="Bio" fullWidth size="small" sx={{ mb: 2 }} />
        <Divider sx={{ my: 2 }} />

        {/* Notifications Section */}
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Notifications
        </Typography>
        <FormControlLabel control={<Switch defaultChecked />} label="Email notifications" />
        <FormControlLabel control={<Switch />} label="Push notifications" />
        <FormControlLabel control={<Switch defaultChecked />} label="Weekly digest" />
        <Divider sx={{ my: 2 }} />

        {/* Email Section - Target */}
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Email
        </Typography>
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Reply-to address</InputLabel>
          <Select label="Reply-to address" defaultValue="primary">
            <MenuItem value="primary">Primary email</MenuItem>
            <MenuItem value="work">Work email</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Out-of-office message"
          multiline
          rows={3}
          fullWidth
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Set your out-of-office message"
          inputProps={{ 'data-testid': 'textarea-out-of-office' }}
          sx={{ mb: 2 }}
        />
        <Divider sx={{ my: 2 }} />

        {/* Security Section */}
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Security
        </Typography>
        <FormControlLabel control={<Switch defaultChecked />} label="Two-factor authentication" />
        <FormControlLabel control={<Switch />} label="Login alerts" />
      </CardContent>
    </Card>
  );
}
