'use client';

/**
 * datetime_picker_single-mantine-T06: Mantine typed datetime with custom valueFormat
 *
 * Layout: isolated card centered.
 * Component: one Mantine DateTimePicker labeled "Reschedule to".
 * Configuration: valueFormat is set to "DD MMM YYYY hh:mm A" (e.g., "15 Mar 2026 06:05 PM") and the input accepts typing.
 * A helper line under the field shows: "Required format: DD MMM YYYY hh:mm A".
 * Initial state: empty. Dropdown type is popover, but the task can be completed by typing.
 *
 * Success: The "Reschedule to" DateTimePicker equals 2026-03-15 18:05 (local time).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Date | null>(null);

  useEffect(() => {
    if (value && dayjs(value).format('YYYY-MM-DD HH:mm') === '2026-03-15 18:05') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Reschedule Task</Text>
      <Stack gap="md">
        <div>
          <Text component="label" htmlFor="dt-reschedule" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
            Reschedule to
          </Text>
          <DateTimePicker
            id="dt-reschedule"
            value={value}
            onChange={setValue}
            placeholder="DD MMM YYYY hh:mm A"
            valueFormat="DD MMM YYYY hh:mm A"
            data-testid="dt-reschedule"
          />
          <Text size="xs" c="dimmed" mt={4}>
            Required format: DD MMM YYYY hh:mm A
          </Text>
        </div>
      </Stack>
    </Card>
  );
}
