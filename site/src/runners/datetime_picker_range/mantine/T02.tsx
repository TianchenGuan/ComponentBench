'use client';

/**
 * datetime_picker_range-mantine-T02: Clear a prefilled composite range
 *
 * Layout: isolated_card centered. Light theme, comfortable spacing.
 * Composite range group "Maintenance window" contains two Mantine DateTimePicker inputs (Start and End),
 * both configured with clearable=true so each field shows a clear (✕) control when it has a value.
 * Initial state: Start=2026-03-10 01:00 and End=2026-03-10 03:00. No other interactive elements.
 *
 * Success: Both start and end are empty (null).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [startValue, setStartValue] = useState<Date | null>(
    dayjs('2026-03-10 01:00', 'YYYY-MM-DD HH:mm').toDate()
  );
  const [endValue, setEndValue] = useState<Date | null>(
    dayjs('2026-03-10 03:00', 'YYYY-MM-DD HH:mm').toDate()
  );

  useEffect(() => {
    if (startValue === null && endValue === null) {
      onSuccess();
    }
  }, [startValue, endValue, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }} data-cb-instance="Maintenance window">
      <Text fw={600} size="lg" mb="md">Maintenance Window</Text>
      <Text size="sm" c="dimmed" mb="md">
        (Clear ✕ buttons are shown in each field.)
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
            clearable
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
            clearable
            data-testid="dt-range-end"
            valueFormat="YYYY-MM-DD HH:mm"
          />
        </div>
      </Stack>
    </Card>
  );
}
