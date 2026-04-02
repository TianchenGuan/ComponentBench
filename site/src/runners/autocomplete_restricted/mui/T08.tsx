'use client';

/**
 * autocomplete_restricted-mui-T08: Scroll-heavy time zone selection
 *
 * setup_description:
 * The UI is an isolated card anchored near the **bottom-right** of the viewport.
 *
 * It contains a single Material UI Autocomplete labeled **Time zone** rendered in a **small** size variant.
 * - Theme: light; spacing: comfortable; scale: **small** (reduced height and icon size).
 * - Initial state: empty.
 * - The options list is long (~80 time zones) sorted by UTC offset, each formatted like "UTC+05:30 (India Standard Time)".
 * - The task expects you to scroll within the listbox to reach the +05:30 section and pick the India Standard Time entry.
 * - Restricted mode: the selection must be one of the list items.
 * - Selecting an item commits immediately.
 *
 * No other inputs are present; the difficulty is the small click targets plus deep scrolling inside the listbox.
 *
 * Success: The "Time zone" Autocomplete has selected value "UTC+05:30 (India Standard Time)".
 */

import React, { useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import type { TaskComponentProps } from '../types';

const timezones = [
  'UTC-12:00 (Baker Island)',
  'UTC-11:00 (American Samoa)',
  'UTC-10:00 (Hawaii)',
  'UTC-09:00 (Alaska)',
  'UTC-08:00 (Pacific Time)',
  'UTC-07:00 (Mountain Time)',
  'UTC-06:00 (Central Time)',
  'UTC-05:00 (Eastern Time)',
  'UTC-04:00 (Atlantic Time)',
  'UTC-03:30 (Newfoundland)',
  'UTC-03:00 (Buenos Aires)',
  'UTC-02:00 (South Georgia)',
  'UTC-01:00 (Azores)',
  'UTC+00:00 (London)',
  'UTC+01:00 (Berlin)',
  'UTC+02:00 (Cairo)',
  'UTC+03:00 (Moscow)',
  'UTC+03:30 (Tehran)',
  'UTC+04:00 (Dubai)',
  'UTC+04:30 (Kabul)',
  'UTC+05:00 (Karachi)',
  'UTC+05:30 (India Standard Time)',
  'UTC+05:45 (Kathmandu)',
  'UTC+06:00 (Dhaka)',
  'UTC+06:30 (Yangon)',
  'UTC+07:00 (Bangkok)',
  'UTC+08:00 (Singapore)',
  'UTC+08:45 (Eucla)',
  'UTC+09:00 (Tokyo)',
  'UTC+09:30 (Adelaide)',
  'UTC+10:00 (Sydney)',
  'UTC+10:30 (Lord Howe Island)',
  'UTC+11:00 (Solomon Islands)',
  'UTC+12:00 (Auckland)',
  'UTC+12:45 (Chatham Islands)',
  'UTC+13:00 (Samoa)',
  'UTC+14:00 (Line Islands)',
];

// Extend with more entries to make scrolling more challenging
const extendedTimezones = [
  ...timezones.slice(0, 14),
  'UTC+00:00 (Dublin)',
  'UTC+00:00 (Lisbon)',
  'UTC+00:00 (Reykjavik)',
  ...timezones.slice(14, 15),
  'UTC+01:00 (Paris)',
  'UTC+01:00 (Rome)',
  'UTC+01:00 (Madrid)',
  'UTC+01:00 (Amsterdam)',
  ...timezones.slice(15, 16),
  'UTC+02:00 (Athens)',
  'UTC+02:00 (Helsinki)',
  'UTC+02:00 (Jerusalem)',
  ...timezones.slice(16, 17),
  'UTC+03:00 (Istanbul)',
  'UTC+03:00 (Riyadh)',
  ...timezones.slice(17),
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);

  const handleChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setValue(newValue);
    if (newValue === 'UTC+05:30 (India Standard Time)') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 320 }}>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          Time zone
        </Typography>
        <Autocomplete
          data-testid="timezone-autocomplete"
          options={extendedTimezones}
          value={value}
          onChange={handleChange}
          renderInput={(params) => (
            <TextField {...params} placeholder="Select time zone" size="small" />
          )}
          freeSolo={false}
          size="small"
          ListboxProps={{ style: { maxHeight: 200 } }}
        />
      </CardContent>
    </Card>
  );
}
