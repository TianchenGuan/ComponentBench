'use client';

/**
 * datetime_picker_range-mantine-T09: Compact + small: set tight-minute range in composite inputs
 *
 * Layout: isolated_card centered. Light theme, but compact spacing mode and small-sized inputs.
 * Composite range group "Blackout window" contains Start and End Mantine DateTimePicker fields rendered in small size.
 * Time selection uses fine-grained minutes (no coarse stepping), making it easy to pick a nearby but incorrect minute.
 * Initial state: empty.
 *
 * Success: start=2026-07-04T09:07:00, end=2026-07-04T09:59:00 (local time).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T09({ onSuccess }: TaskComponentProps) {
  const [startValue, setStartValue] = useState<Date | null>(null);
  const [endValue, setEndValue] = useState<Date | null>(null);

  useEffect(() => {
    if (startValue && endValue) {
      const startMatch = dayjs(startValue).format('YYYY-MM-DD HH:mm') === '2026-07-04 09:07';
      const endMatch = dayjs(endValue).format('YYYY-MM-DD HH:mm') === '2026-07-04 09:59';
      if (startMatch && endMatch) {
        onSuccess();
      }
    }
  }, [startValue, endValue, onSuccess]);

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder style={{ width: 400 }} data-cb-instance="Blackout window">
      <Text fw={600} size="md" mb="sm">Blackout Window (compact)</Text>
      <Stack gap="xs">
        <div>
          <Text component="label" fw={500} size="xs" mb={2} style={{ display: 'block' }}>
            Start (small)
          </Text>
          <DateTimePicker
            size="xs"
            value={startValue}
            onChange={setStartValue}
            placeholder="Pick date and time"
            data-testid="dt-range-start"
            valueFormat="YYYY-MM-DD HH:mm"
          />
        </div>
        <div>
          <Text component="label" fw={500} size="xs" mb={2} style={{ display: 'block' }}>
            End (small)
          </Text>
          <DateTimePicker
            size="xs"
            value={endValue}
            onChange={setEndValue}
            placeholder="Pick date and time"
            data-testid="dt-range-end"
            valueFormat="YYYY-MM-DD HH:mm"
          />
        </div>
      </Stack>
    </Card>
  );
}
