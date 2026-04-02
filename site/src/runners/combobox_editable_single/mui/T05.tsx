'use client';

/**
 * combobox_editable_single-mui-T05: Scroll to find America/New_York time zone
 *
 * A single isolated card titled "Time zone" is placed near the top-right of the viewport.
 * The card contains one MUI Autocomplete combobox labeled "Time zone".
 * - Scene: isolated_card layout, top_right placement, light theme, comfortable spacing, default scale.
 * - Component behavior: The listbox is scrollable; filtering is disabled.
 * - Options (~80): a long list of IANA-like time zones.
 * - Initial state: empty.
 * - Distractors: none.
 *
 * Success: The "Time zone" combobox value equals "America/New_York".
 */

import React, { useState } from 'react';
import { Autocomplete, TextField, Card, CardContent, Typography } from '@mui/material';
import type { TaskComponentProps } from '../types';

const timezones = [
  'Africa/Cairo', 'Africa/Johannesburg', 'Africa/Lagos', 'Africa/Nairobi',
  'America/Anchorage', 'America/Bogota', 'America/Buenos_Aires', 'America/Caracas',
  'America/Chicago', 'America/Denver', 'America/Edmonton', 'America/Halifax',
  'America/Lima', 'America/Los_Angeles', 'America/Mexico_City', 'America/New_York',
  'America/Phoenix', 'America/Santiago', 'America/Sao_Paulo', 'America/Toronto',
  'America/Vancouver', 'Asia/Bangkok', 'Asia/Beijing', 'Asia/Dubai',
  'Asia/Hong_Kong', 'Asia/Jakarta', 'Asia/Kolkata', 'Asia/Manila',
  'Asia/Seoul', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Taipei',
  'Asia/Tokyo', 'Australia/Brisbane', 'Australia/Melbourne', 'Australia/Perth',
  'Australia/Sydney', 'Europe/Amsterdam', 'Europe/Athens', 'Europe/Berlin',
  'Europe/Brussels', 'Europe/Dublin', 'Europe/Helsinki', 'Europe/Istanbul',
  'Europe/Lisbon', 'Europe/London', 'Europe/Madrid', 'Europe/Moscow',
  'Europe/Paris', 'Europe/Prague', 'Europe/Rome', 'Europe/Stockholm',
  'Europe/Vienna', 'Europe/Warsaw', 'Europe/Zurich', 'Pacific/Auckland',
  'Pacific/Fiji', 'Pacific/Guam', 'Pacific/Honolulu', 'Pacific/Samoa',
  'Indian/Maldives', 'Indian/Mauritius', 'Atlantic/Azores', 'Atlantic/Bermuda',
  'Atlantic/Canary', 'Atlantic/Cape_Verde', 'Atlantic/Reykjavik', 'Atlantic/South_Georgia',
  'Antarctica/Casey', 'Antarctica/Davis', 'Antarctica/McMurdo', 'Antarctica/Palmer',
  'Arctic/Longyearbyen',
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);

  const handleChange = (_event: React.SyntheticEvent, newValue: string | null) => {
    setValue(newValue);
    if (newValue === 'America/New_York') {
      onSuccess();
    }
  };

  return (
    <Card sx={{ width: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Time zone</Typography>
        <Typography variant="subtitle2" gutterBottom>Time zone</Typography>
        <Autocomplete
          data-testid="timezone-autocomplete"
          options={timezones}
          value={value}
          onChange={handleChange}
          ListboxProps={{ style: { maxHeight: 240 } }}
          // No filtering - scroll_find task
          filterOptions={(x) => x}
          renderInput={(params) => (
            <TextField {...params} placeholder="Select time zone" size="small" />
          )}
        />
      </CardContent>
    </Card>
  );
}
