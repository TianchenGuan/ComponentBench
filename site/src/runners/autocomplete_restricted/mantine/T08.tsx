'use client';

/**
 * autocomplete_restricted-mantine-T08: Dark + compact: choose the correct UTC offset
 *
 * setup_description:
 * The page is a "Regional settings" card rendered in **dark theme** with **compact** spacing.
 *
 * It contains one Mantine Select labeled **Time zone** configured as searchable.
 * - Theme: dark; spacing: compact; size: default.
 * - Initial state: empty.
 * - Options: ~35 time zones formatted with offsets and city names, including:
 *   - UTC+08:00 (Beijing)
 *   - UTC+09:00 (Tokyo)  ← target
 *   - UTC+09:30 (Adelaide)
 *   - UTC+10:00 (Sydney)
 * - Because offsets are similar, selecting the correct one requires careful reading.
 * - Selecting an option commits immediately.
 *
 * No other inputs are present; the hardness comes from compact dark styling and similar option labels.
 *
 * Success: The "Time zone" Select has selected value "UTC+09:00 (Tokyo)".
 */

import React, { useState } from 'react';
import { Card, Text, Select, MantineProvider } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const timezones = [
  'UTC-12:00 (Baker Island)',
  'UTC-11:00 (American Samoa)',
  'UTC-10:00 (Hawaii)',
  'UTC-09:00 (Alaska)',
  'UTC-08:00 (Los Angeles)',
  'UTC-07:00 (Denver)',
  'UTC-06:00 (Chicago)',
  'UTC-05:00 (New York)',
  'UTC-04:00 (Santiago)',
  'UTC-03:00 (Buenos Aires)',
  'UTC-02:00 (South Georgia)',
  'UTC-01:00 (Azores)',
  'UTC+00:00 (London)',
  'UTC+01:00 (Paris)',
  'UTC+02:00 (Cairo)',
  'UTC+03:00 (Moscow)',
  'UTC+04:00 (Dubai)',
  'UTC+05:00 (Karachi)',
  'UTC+05:30 (Mumbai)',
  'UTC+06:00 (Dhaka)',
  'UTC+07:00 (Bangkok)',
  'UTC+08:00 (Beijing)',
  'UTC+08:00 (Singapore)',
  'UTC+08:00 (Perth)',
  'UTC+09:00 (Tokyo)',
  'UTC+09:00 (Seoul)',
  'UTC+09:30 (Adelaide)',
  'UTC+10:00 (Sydney)',
  'UTC+10:00 (Brisbane)',
  'UTC+11:00 (Solomon Islands)',
  'UTC+12:00 (Auckland)',
  'UTC+13:00 (Samoa)',
  'UTC+14:00 (Line Islands)',
].map(tz => ({ label: tz, value: tz }));

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<string | null>(null);

  const handleChange = (newValue: string | null) => {
    setValue(newValue);
    if (newValue === 'UTC+09:00 (Tokyo)') {
      onSuccess();
    }
  };

  return (
    <MantineProvider forceColorScheme="dark">
      <Card
        shadow="sm"
        padding="md"
        radius="md"
        withBorder
        style={{ width: 380, background: '#1a1b1e' }}
      >
        <Text fw={600} size="md" mb="sm" c="white">Regional settings</Text>
        <Text fw={500} size="xs" mb={4} c="dimmed">Time zone</Text>
        <Select
          data-testid="timezone-select"
          placeholder="Select time zone"
          data={timezones}
          value={value}
          onChange={handleChange}
          searchable
          size="sm"
          maxDropdownHeight={200}
        />
      </Card>
    </MantineProvider>
  );
}
