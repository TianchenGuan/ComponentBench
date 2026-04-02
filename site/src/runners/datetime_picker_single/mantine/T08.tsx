'use client';

/**
 * datetime_picker_single-mantine-T08: Mantine compact small far-year navigation
 *
 * Theme: light. Spacing: compact. Scale: small.
 * Layout: isolated card centered, but the picker input is small and tightly spaced.
 * Component: one Mantine DateTimePicker labeled "Retention cutoff".
 * Interaction nuance: the target year (2031) is not near the current year, so the user must use the calendar header controls to switch years and scroll/select 2031 before choosing Jan 1.
 * Time: must be exactly 12:00 AM (00:00).
 * Initial state: empty.
 *
 * Success: The "Retention cutoff" DateTimePicker equals 2031-01-01 00:00.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Date | null>(null);

  useEffect(() => {
    if (value && dayjs(value).format('YYYY-MM-DD HH:mm') === '2031-01-01 00:00') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder style={{ width: 320 }}>
      <Text fw={600} size="md" mb="sm">Data Retention</Text>
      <Stack gap="xs">
        <div>
          <Text component="label" htmlFor="dt-retention" fw={500} size="xs" mb={2} style={{ display: 'block' }}>
            Retention cutoff
          </Text>
          <DateTimePicker
            id="dt-retention"
            value={value}
            onChange={setValue}
            placeholder="Pick date and time"
            size="xs"
            data-testid="dt-retention"
          />
        </div>
      </Stack>
    </Card>
  );
}
