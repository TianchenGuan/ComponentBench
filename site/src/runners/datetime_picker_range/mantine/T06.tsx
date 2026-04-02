'use client';

/**
 * datetime_picker_range-mantine-T06: Inspection window: set range with pickers opening in modals
 *
 * Layout: modal_flow anchored near the top-right of the viewport.
 * Light theme, comfortable spacing, default scale.
 * Composite range group "Inspection window" has two Mantine DateTimePicker fields (Start/End) configured with dropdownType='modal',
 * so clicking either field opens a full modal dialog containing the calendar and time picker.
 * Initial state: empty. No extra form fields or buttons; once both Start and End are set, success is achieved.
 *
 * Success: start=2026-09-15T07:00:00, end=2026-09-15T09:00:00 (local time).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [startValue, setStartValue] = useState<Date | null>(null);
  const [endValue, setEndValue] = useState<Date | null>(null);

  useEffect(() => {
    if (startValue && endValue) {
      const startMatch = dayjs(startValue).format('YYYY-MM-DD HH:mm') === '2026-09-15 07:00';
      const endMatch = dayjs(endValue).format('YYYY-MM-DD HH:mm') === '2026-09-15 09:00';
      if (startMatch && endMatch) {
        onSuccess();
      }
    }
  }, [startValue, endValue, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }} data-cb-instance="Inspection window">
      <Text fw={600} size="lg" mb="md">Inspection Window</Text>
      <Text size="sm" c="dimmed" mb="md">
        (Each field opens in a modal.)
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
            dropdownType="modal"
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
            dropdownType="modal"
            data-testid="dt-range-end"
            valueFormat="YYYY-MM-DD HH:mm"
          />
        </div>
      </Stack>
    </Card>
  );
}
