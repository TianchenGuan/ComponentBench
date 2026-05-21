'use client';

/**
 * datetime_picker_single-mantine-T01: Mantine basic set datetime (popover)
 *
 * Layout: isolated card centered.
 * Component: one Mantine DateTimePicker input labeled "Event date & time".
 * Dropdown behavior: default popover dropdown (dropdownType=popover). Clicking the input opens a calendar with an embedded time picker.
 * Sub-controls: calendar month navigation + time controls for hours/minutes.
 * Initial state: empty; placeholder "Pick date and time".
 * No other date/time inputs on the page.
 *
 * Success: The Mantine DateTimePicker labeled "Event date & time" equals 2026-02-07 10:00 AM (local time).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Date | null>(null);

  useEffect(() => {
    if (value && dayjs(value).format('YYYY-MM-DD HH:mm') === '2026-02-07 10:00') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Event Scheduling</Text>
      <Stack gap="md">
        <div>
          <Text component="label" htmlFor="dt-event" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
            Event date & time
          </Text>
          <DateTimePicker
            id="dt-event"
            value={value}
            onChange={setValue}
            placeholder="Pick date and time"
            data-testid="dt-event"
          />
        </div>
      </Stack>
    </Card>
  );
}
