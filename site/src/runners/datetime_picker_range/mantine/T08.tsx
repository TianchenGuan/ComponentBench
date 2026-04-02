'use client';

/**
 * datetime_picker_range-mantine-T08: Precise timing: set range with seconds enabled (composite)
 *
 * Layout: isolated_card centered. Light theme, comfortable spacing, default scale.
 * Composite range group "Recorder window" uses two Mantine DateTimePicker fields with withSeconds enabled,
 * so time selection includes hours, minutes, and seconds.
 * Initial state: empty. No other UI elements.
 *
 * Success: start=2026-10-10T08:15:30, end=2026-10-10T09:45:10 (local time).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [startValue, setStartValue] = useState<Date | null>(null);
  const [endValue, setEndValue] = useState<Date | null>(null);

  useEffect(() => {
    if (startValue && endValue) {
      const startMatch = dayjs(startValue).format('YYYY-MM-DD HH:mm:ss') === '2026-10-10 08:15:30';
      const endMatch = dayjs(endValue).format('YYYY-MM-DD HH:mm:ss') === '2026-10-10 09:45:10';
      if (startMatch && endMatch) {
        onSuccess();
      }
    }
  }, [startValue, endValue, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }} data-cb-instance="Recorder window">
      <Text fw={600} size="lg" mb="md">Recorder Window</Text>
      <Text size="sm" c="dimmed" mb="md">
        (Seconds inputs are enabled.)
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
            withSeconds
            data-testid="dt-range-start"
            valueFormat="YYYY-MM-DD HH:mm:ss"
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
            withSeconds
            data-testid="dt-range-end"
            valueFormat="YYYY-MM-DD HH:mm:ss"
          />
        </div>
      </Stack>
    </Card>
  );
}
