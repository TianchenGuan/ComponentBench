'use client';

/**
 * combobox_editable_single-antd-T06: Pick Pacific/Honolulu from a long time zone list
 *
 * A single isolated card titled "Regional Settings" is anchored near the bottom-right of the viewport.
 * It contains one editable combobox labeled "Time zone" implemented with Ant Design AutoComplete.
 * - Scene: isolated_card layout, bottom_right placement, light theme, comfortable spacing, default scale.
 * - Component behavior: The dropdown is scrollable (max height ~240px). Filtering is disabled.
 * - Options (~60 IANA-like entries): Africa/Cairo, America/Chicago, etc.
 * - Initial state: empty.
 *
 * Success: The "Time zone" combobox value equals "Pacific/Honolulu".
 */

import React, { useState } from 'react';
import { Card, AutoComplete, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

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
].map(tz => ({ value: tz }));

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState('');

  const handleSelect = (selectedValue: string) => {
    setValue(selectedValue);
    if (selectedValue === 'Pacific/Honolulu') {
      onSuccess();
    }
  };

  return (
    <Card title="Regional Settings" style={{ width: 400 }}>
      <Text strong style={{ display: 'block', marginBottom: 8 }}>Time zone</Text>
      <AutoComplete
        data-testid="timezone-autocomplete"
        style={{ width: '100%' }}
        options={timezones}
        placeholder="Select time zone"
        value={value}
        onChange={setValue}
        onSelect={handleSelect}
        listHeight={240}
        // Filtering disabled for scroll_find task
      />
    </Card>
  );
}
