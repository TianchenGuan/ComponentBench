'use client';

/**
 * select_with_search-mantine-T07: Set time zone in compact small Select (top-left)
 *
 * Layout: isolated_card placed near the top-left of the viewport (placement top_left).
 * Spacing/scale: compact spacing with a small-height input and tight dropdown item padding.
 * Component: one Mantine Select labeled "Time zone" with searchable enabled.
 * Options: a long list (~70) of time zones formatted as "UTC±HH:MM - Location". Many entries are similar.
 * Target option: "UTC+13:00 - Tonga".
 * Initial state: "UTC+00:00 - UTC" is selected.
 * Interaction: open dropdown, type "Tonga" or "UTC+13" to filter, then select the exact matching option.
 *
 * Success: The selected value of the "Time zone" Select equals "UTC+13:00 - Tonga".
 */

import React, { useState } from 'react';
import { Card, Text, Select } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const timeZoneOptions = [
  { value: 'UTC-12:00 - Baker Island', label: 'UTC-12:00 - Baker Island' },
  { value: 'UTC-11:00 - Samoa', label: 'UTC-11:00 - Samoa' },
  { value: 'UTC-10:00 - Hawaii', label: 'UTC-10:00 - Hawaii' },
  { value: 'UTC-09:00 - Alaska', label: 'UTC-09:00 - Alaska' },
  { value: 'UTC-08:00 - Pacific (Los Angeles)', label: 'UTC-08:00 - Pacific (Los Angeles)' },
  { value: 'UTC-07:00 - Mountain (Denver)', label: 'UTC-07:00 - Mountain (Denver)' },
  { value: 'UTC-06:00 - Central (Chicago)', label: 'UTC-06:00 - Central (Chicago)' },
  { value: 'UTC-05:00 - Eastern (New York)', label: 'UTC-05:00 - Eastern (New York)' },
  { value: 'UTC-04:00 - Atlantic (Halifax)', label: 'UTC-04:00 - Atlantic (Halifax)' },
  { value: 'UTC-03:00 - Brazil (São Paulo)', label: 'UTC-03:00 - Brazil (São Paulo)' },
  { value: 'UTC-02:00 - Mid-Atlantic', label: 'UTC-02:00 - Mid-Atlantic' },
  { value: 'UTC-01:00 - Azores', label: 'UTC-01:00 - Azores' },
  { value: 'UTC+00:00 - UTC', label: 'UTC+00:00 - UTC' },
  { value: 'UTC+00:00 - London', label: 'UTC+00:00 - London' },
  { value: 'UTC+01:00 - Paris', label: 'UTC+01:00 - Paris' },
  { value: 'UTC+01:00 - Berlin', label: 'UTC+01:00 - Berlin' },
  { value: 'UTC+02:00 - Cairo', label: 'UTC+02:00 - Cairo' },
  { value: 'UTC+02:00 - Jerusalem', label: 'UTC+02:00 - Jerusalem' },
  { value: 'UTC+03:00 - Moscow', label: 'UTC+03:00 - Moscow' },
  { value: 'UTC+03:00 - Riyadh', label: 'UTC+03:00 - Riyadh' },
  { value: 'UTC+03:30 - Tehran', label: 'UTC+03:30 - Tehran' },
  { value: 'UTC+04:00 - Dubai', label: 'UTC+04:00 - Dubai' },
  { value: 'UTC+04:30 - Kabul', label: 'UTC+04:30 - Kabul' },
  { value: 'UTC+05:00 - Pakistan (Karachi)', label: 'UTC+05:00 - Pakistan (Karachi)' },
  { value: 'UTC+05:30 - India (Kolkata)', label: 'UTC+05:30 - India (Kolkata)' },
  { value: 'UTC+05:45 - Nepal (Kathmandu)', label: 'UTC+05:45 - Nepal (Kathmandu)' },
  { value: 'UTC+06:00 - Bangladesh (Dhaka)', label: 'UTC+06:00 - Bangladesh (Dhaka)' },
  { value: 'UTC+06:30 - Myanmar (Yangon)', label: 'UTC+06:30 - Myanmar (Yangon)' },
  { value: 'UTC+07:00 - Thailand (Bangkok)', label: 'UTC+07:00 - Thailand (Bangkok)' },
  { value: 'UTC+07:00 - Vietnam (Ho Chi Minh)', label: 'UTC+07:00 - Vietnam (Ho Chi Minh)' },
  { value: 'UTC+08:00 - China (Beijing)', label: 'UTC+08:00 - China (Beijing)' },
  { value: 'UTC+08:00 - Singapore', label: 'UTC+08:00 - Singapore' },
  { value: 'UTC+08:00 - Hong Kong', label: 'UTC+08:00 - Hong Kong' },
  { value: 'UTC+08:00 - Taiwan (Taipei)', label: 'UTC+08:00 - Taiwan (Taipei)' },
  { value: 'UTC+09:00 - Japan (Tokyo)', label: 'UTC+09:00 - Japan (Tokyo)' },
  { value: 'UTC+09:00 - Korea (Seoul)', label: 'UTC+09:00 - Korea (Seoul)' },
  { value: 'UTC+09:30 - Australia (Darwin)', label: 'UTC+09:30 - Australia (Darwin)' },
  { value: 'UTC+10:00 - Australia (Sydney)', label: 'UTC+10:00 - Australia (Sydney)' },
  { value: 'UTC+10:00 - Guam', label: 'UTC+10:00 - Guam' },
  { value: 'UTC+11:00 - Solomon Islands', label: 'UTC+11:00 - Solomon Islands' },
  { value: 'UTC+12:00 - New Zealand (Auckland)', label: 'UTC+12:00 - New Zealand (Auckland)' },
  { value: 'UTC+12:00 - Fiji', label: 'UTC+12:00 - Fiji' },
  { value: 'UTC+13:00 - Tonga', label: 'UTC+13:00 - Tonga' },
  { value: 'UTC+14:00 - Line Islands', label: 'UTC+14:00 - Line Islands' },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>('UTC+00:00 - UTC');

  const handleChange = (newValue: string | null) => {
    setValue(newValue);
    if (newValue === 'UTC+13:00 - Tonga') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder style={{ width: 320 }}>
      <Text fw={600} size="sm" mb="xs">Settings</Text>
      <Select
        data-testid="timezone-select"
        label="Time zone"
        size="xs"
        searchable
        data={timeZoneOptions}
        value={value}
        onChange={handleChange}
        maxDropdownHeight={200}
      />
    </Card>
  );
}
