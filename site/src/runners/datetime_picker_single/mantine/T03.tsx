'use client';

/**
 * datetime_picker_single-mantine-T03: Mantine clear an existing datetime
 *
 * Layout: isolated card centered.
 * Component: one Mantine DateTimePicker labeled "Snooze until".
 * Configuration: clearable=true (shows a clear icon inside the input when a value is set).
 * Initial state: pre-filled with "2026-02-04 07:30".
 * Behavior: clearing immediately sets the component value to null/empty (no confirm).
 *
 * Success: The "Snooze until" DateTimePicker is cleared (null/empty).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Date | null>(new Date('2026-02-04T07:30:00'));

  useEffect(() => {
    if (value === null) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Notifications</Text>
      <Stack gap="md">
        <div>
          <Text component="label" htmlFor="dt-snooze" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
            Snooze until
          </Text>
          <DateTimePicker
            id="dt-snooze"
            value={value}
            onChange={setValue}
            placeholder="Pick date and time"
            clearable
            data-testid="dt-snooze"
          />
        </div>
      </Stack>
    </Card>
  );
}
