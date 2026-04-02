'use client';

/**
 * select_with_search-antd-T07: Set time zone in a compact small Select (top-right)
 *
 * Layout: isolated_card anchored near the top-right of the viewport (placement top_right).
 * Spacing: compact density; the Select uses size='small' and a narrow width.
 * Component: one Ant Design Select labeled "Time zone" with showSearch enabled.
 * Options: a long list of time zones (about 60), formatted like "UTC±HH:MM - Region (City)".
 * Similar distractors are present (e.g., "UTC+05:00 - Pakistan (Karachi)" and "UTC+06:00 - Bangladesh (Dhaka)").
 * Initial state: "UTC+00:00 - UTC" is selected.
 * Interaction: open dropdown popover → search field appears at top; typing filters options; selecting an option immediately updates the displayed value.
 *
 * Success: The selected value of the "Time zone" Select equals "UTC+05:30 - India (Kolkata)".
 */

import React, { useState } from 'react';
import { Card, Select, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

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
  const [value, setValue] = useState<string>('UTC+00:00 - UTC');

  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (newValue === 'UTC+05:30 - India (Kolkata)') {
      onSuccess();
    }
  };

  return (
    <Card title="Settings" style={{ width: 320 }} size="small">
      <Text strong style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>Time zone</Text>
      <Select
        data-testid="timezone-select"
        showSearch
        size="small"
        style={{ width: '100%' }}
        value={value}
        onChange={handleChange}
        options={timeZoneOptions}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        listHeight={200}
      />
    </Card>
  );
}
