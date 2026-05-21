'use client';

/**
 * datetime_picker_range-mantine-T01: Reservation window: set start and end (composite)
 *
 * Layout: isolated_card centered. Light theme, comfortable spacing, default scale.
 * Mantine does not provide a single native date-time range picker; this implementation is a composite range group:
 * two Mantine DateTimePicker inputs labeled "Start" and "End" under the section title "Reservation window".
 * Each DateTimePicker opens a popover with a calendar and a time picker.
 * Time selection is configured with dropdowns for hour/minute (easier than free-form).
 * Initial state: both Start and End are empty. No other UI elements.
 *
 * Success: start=2026-02-14T09:30:00, end=2026-02-14T11:00:00 (local time).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack, Group } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [startValue, setStartValue] = useState<Date | null>(null);
  const [endValue, setEndValue] = useState<Date | null>(null);

  useEffect(() => {
    if (startValue && endValue) {
      const startMatch = dayjs(startValue).format('YYYY-MM-DD HH:mm') === '2026-02-14 09:30';
      const endMatch = dayjs(endValue).format('YYYY-MM-DD HH:mm') === '2026-02-14 11:00';
      if (startMatch && endMatch) {
        onSuccess();
      }
    }
  }, [startValue, endValue, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }} data-cb-instance="Reservation window">
      <Text fw={600} size="lg" mb="md">Reservation Window</Text>
      <Text size="sm" c="dimmed" mb="md">
        Display format: YYYY-MM-DD HH:mm
      </Text>
      <Stack gap="md">
        <div>
          <Text component="label" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
            Start
          </Text>
          <DateTimePicker
            value={startValue}
            onChange={setStartValue}
            placeholder="Pick date and time"
            data-testid="dt-range-start"
            valueFormat="YYYY-MM-DD HH:mm"
          />
        </div>
        <div>
          <Text component="label" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
            End
          </Text>
          <DateTimePicker
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
