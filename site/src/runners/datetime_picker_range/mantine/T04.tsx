'use client';

/**
 * datetime_picker_range-mantine-T04: Secondary schedule: set range among two composite groups
 *
 * Layout: form_section centered with low clutter. Light theme, comfortable spacing, default scale.
 * There are two composite date-time range groups that look alike: "Primary schedule" (Start/End pre-filled) and "Secondary schedule" (Start/End empty).
 * Each group is composed of two Mantine DateTimePicker fields (Start and End).
 * Other controls (a Name text input and a Timezone select) are present but irrelevant to success.
 *
 * Success: The "Secondary schedule" composite equals start=2026-04-01T13:00:00, end=2026-04-01T16:30:00 (local time).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack, TextInput, Select, Divider } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  // Primary schedule (pre-filled)
  const [primaryStart] = useState<Date | null>(
    dayjs('2026-04-01 09:00', 'YYYY-MM-DD HH:mm').toDate()
  );
  const [primaryEnd] = useState<Date | null>(
    dayjs('2026-04-01 12:00', 'YYYY-MM-DD HH:mm').toDate()
  );

  // Secondary schedule (empty, target)
  const [secondaryStart, setSecondaryStart] = useState<Date | null>(null);
  const [secondaryEnd, setSecondaryEnd] = useState<Date | null>(null);

  // Clutter controls
  const [name, setName] = useState('My Schedule');
  const [timezone, setTimezone] = useState<string | null>('UTC');

  useEffect(() => {
    if (secondaryStart && secondaryEnd) {
      const startMatch = dayjs(secondaryStart).format('YYYY-MM-DD HH:mm') === '2026-04-01 13:00';
      const endMatch = dayjs(secondaryEnd).format('YYYY-MM-DD HH:mm') === '2026-04-01 16:30';
      if (startMatch && endMatch) {
        onSuccess();
      }
    }
  }, [secondaryStart, secondaryEnd, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Text fw={600} size="lg" mb="md">Schedules</Text>

      {/* Clutter controls */}
      <Stack gap="sm" mb="md">
        <TextInput
          label="Name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
        <Select
          label="Timezone"
          value={timezone}
          onChange={setTimezone}
          data={['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo']}
        />
      </Stack>

      <Divider my="md" />

      {/* Primary schedule (pre-filled) */}
      <div data-cb-instance="Primary schedule" style={{ marginBottom: 16 }}>
        <Text fw={500} size="sm" mb="xs">Primary schedule</Text>
        <Stack gap="sm">
          <DateTimePicker
            label="Start"
            value={primaryStart}
            disabled
            valueFormat="YYYY-MM-DD HH:mm"
          />
          <DateTimePicker
            label="End"
            value={primaryEnd}
            disabled
            valueFormat="YYYY-MM-DD HH:mm"
          />
        </Stack>
      </div>

      <Divider my="md" />

      {/* Secondary schedule (empty, target) */}
      <div data-cb-instance="Secondary schedule">
        <Text fw={500} size="sm" mb="xs">Secondary schedule</Text>
        <Stack gap="sm">
          <DateTimePicker
            label="Start"
            value={secondaryStart}
            onChange={setSecondaryStart}
            placeholder="Pick date and time"
            data-testid="dt-range-secondary-start"
            valueFormat="YYYY-MM-DD HH:mm"
          />
          <DateTimePicker
            label="End"
            value={secondaryEnd}
            onChange={setSecondaryEnd}
            placeholder="Pick date and time"
            data-testid="dt-range-secondary-end"
            valueFormat="YYYY-MM-DD HH:mm"
          />
        </Stack>
      </div>
    </Card>
  );
}
