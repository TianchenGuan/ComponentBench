'use client';

/**
 * select_custom_single-mui-T04: Set Week starts on to Monday
 *
 * Layout: settings_panel anchored near the top-right of the viewport.
 * The panel title is "Calendar preferences". Spacing is comfortable, default component size.
 *
 * Instances: there are two MUI Select components:
 * 1) "Time zone" (currently "America/New_York")
 * 2) "Week starts on" (currently "Sunday")
 *
 * The "Week starts on" select opens a short menu with options: Sunday, Monday, Saturday.
 * The "Time zone" select has a longer list and is a distractor.
 *
 * Clutter: the panel also contains two toggles ("Show week numbers", "Use 24‑hour time").
 * These do not affect success.
 *
 * Feedback: selection applies immediately; no Save/Apply button in this benchmark scene.
 *
 * Success: The MUI Select labeled "Week starts on" has selected value exactly "Monday".
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { TaskComponentProps } from '../types';

const timezones = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
];

const weekStartOptions = ['Sunday', 'Monday', 'Saturday'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [timezone, setTimezone] = useState<string>('America/New_York');
  const [weekStart, setWeekStart] = useState<string>('Sunday');

  const handleWeekStartChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value;
    setWeekStart(newValue);
    if (newValue === 'Monday') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Calendar preferences</Typography>
        
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="timezone-label">Time zone</InputLabel>
          <Select
            labelId="timezone-label"
            id="timezone-select"
            data-testid="timezone-select"
            value={timezone}
            label="Time zone"
            onChange={(e) => setTimezone(e.target.value)}
          >
            {timezones.map((tz) => (
              <MenuItem key={tz} value={tz}>{tz}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="week-start-label">Week starts on</InputLabel>
          <Select
            labelId="week-start-label"
            id="week-start-select"
            data-testid="week-start-select"
            value={weekStart}
            label="Week starts on"
            onChange={handleWeekStartChange}
          >
            {weekStartOptions.map((day) => (
              <MenuItem key={day} value={day}>{day}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mt: 2 }}>
          <FormControlLabel control={<Switch size="small" />} label="Show week numbers" />
        </Box>
        <Box>
          <FormControlLabel control={<Switch size="small" />} label="Use 24-hour time" />
        </Box>
      </CardContent>
    </Card>
  );
}
