'use client';

/**
 * datetime_picker_range-mantine-T05: Service window: match reference card (composite)
 *
 * Layout: isolated_card centered, light theme, comfortable spacing.
 * A 'Reference' block above the composite range group shows the target start/end as text (visual guidance).
 * The "Service window" composite group contains Start and End Mantine DateTimePicker fields (popover dropdowns for time).
 * Initial state: both fields empty. No other UI.
 *
 * Success: start=2026-08-09T10:00:00, end=2026-08-09T12:30:00 (local time).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack, Paper } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T05({ onSuccess }: TaskComponentProps) {
  const [startValue, setStartValue] = useState<Date | null>(null);
  const [endValue, setEndValue] = useState<Date | null>(null);

  useEffect(() => {
    if (startValue && endValue) {
      const startMatch = dayjs(startValue).format('YYYY-MM-DD HH:mm') === '2026-08-09 10:00';
      const endMatch = dayjs(endValue).format('YYYY-MM-DD HH:mm') === '2026-08-09 12:30';
      if (startMatch && endMatch) {
        onSuccess();
      }
    }
  }, [startValue, endValue, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }} data-cb-instance="Service window">
      <Text fw={600} size="lg" mb="md">Service Window Setup</Text>

      {/* Reference panel */}
      <Paper
        p="sm"
        mb="md"
        style={{ backgroundColor: '#e7f5ff', border: '1px solid #a5d8ff' }}
        data-testid="reference-panel"
      >
        <Text fw={600} size="sm">Reference</Text>
        <Text size="sm">2026-08-09 10:00 → 2026-08-09 12:30</Text>
      </Paper>

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
