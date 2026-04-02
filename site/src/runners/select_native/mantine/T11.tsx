'use client';

/**
 * select_native-mantine-T11: Select Tokyo time zone from long list (compact, small)
 *
 * Layout: an isolated card anchored near the bottom-right of the viewport.
 * Spacing: compact. Scale: small (smaller input height and tighter padding).
 *
 * The target is a Mantine NativeSelect labeled "Time zone".
 * The dropdown contains a long list of 24+ time zones; a representative subset:
 * - UTC (UTC+00:00) → UTC
 * - London (UTC+00:00) → Europe/London
 * - Berlin (UTC+01:00) → Europe/Berlin
 * - New York (UTC−05:00) → America/New_York
 * - Chicago (UTC−06:00) → America/Chicago
 * - Denver (UTC−07:00) → America/Denver
 * - Los Angeles (UTC−08:00) → America/Los_Angeles
 * - Seoul (UTC+09:00) → Asia/Seoul
 * - Tokyo (UTC+09:00) → Asia/Tokyo  ← TARGET
 * - Sydney (UTC+10:00) → Australia/Sydney
 * (and more)
 *
 * Initial state: UTC is selected.
 * Clutter: none.
 * Feedback: immediate; no Save/Apply.
 *
 * Success: The target native select has selected option value 'Asia/Tokyo' (label 'Tokyo (UTC+09:00)').
 */

import React, { useState } from 'react';
import { Card, Text, NativeSelect } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const timezoneOptions = [
  { label: 'UTC (UTC+00:00)', value: 'UTC' },
  { label: 'London (UTC+00:00)', value: 'Europe/London' },
  { label: 'Paris (UTC+01:00)', value: 'Europe/Paris' },
  { label: 'Berlin (UTC+01:00)', value: 'Europe/Berlin' },
  { label: 'Athens (UTC+02:00)', value: 'Europe/Athens' },
  { label: 'Moscow (UTC+03:00)', value: 'Europe/Moscow' },
  { label: 'Dubai (UTC+04:00)', value: 'Asia/Dubai' },
  { label: 'Kolkata (UTC+05:30)', value: 'Asia/Kolkata' },
  { label: 'Bangkok (UTC+07:00)', value: 'Asia/Bangkok' },
  { label: 'Hong Kong (UTC+08:00)', value: 'Asia/Hong_Kong' },
  { label: 'Singapore (UTC+08:00)', value: 'Asia/Singapore' },
  { label: 'Seoul (UTC+09:00)', value: 'Asia/Seoul' },
  { label: 'Tokyo (UTC+09:00)', value: 'Asia/Tokyo' },
  { label: 'Sydney (UTC+10:00)', value: 'Australia/Sydney' },
  { label: 'Auckland (UTC+12:00)', value: 'Pacific/Auckland' },
  { label: 'Honolulu (UTC−10:00)', value: 'Pacific/Honolulu' },
  { label: 'Anchorage (UTC−09:00)', value: 'America/Anchorage' },
  { label: 'Los Angeles (UTC−08:00)', value: 'America/Los_Angeles' },
  { label: 'Denver (UTC−07:00)', value: 'America/Denver' },
  { label: 'Chicago (UTC−06:00)', value: 'America/Chicago' },
  { label: 'New York (UTC−05:00)', value: 'America/New_York' },
  { label: 'Sao Paulo (UTC−03:00)', value: 'America/Sao_Paulo' },
];

export default function T11({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string>('UTC');

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelected(value);
    if (value === 'Asia/Tokyo') {
      onSuccess();
    }
  };

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder style={{ width: 320 }}>
      <Text fw={600} size="md" mb="sm">Time Settings</Text>
      
      <NativeSelect
        data-testid="timezone-select"
        data-canonical-type="select_native"
        data-selected-value={selected}
        label="Time zone"
        value={selected}
        onChange={handleChange}
        data={timezoneOptions}
        size="xs"
      />
    </Card>
  );
}
