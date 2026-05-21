'use client';

/**
 * datetime_picker_range-mantine-T03: Open the Start picker popover (composite)
 *
 * Layout: isolated_card centered. Light theme, comfortable spacing.
 * Composite range group "Event window" contains two empty Mantine DateTimePicker fields labeled Start and End.
 * Each field opens its own popover with the calendar and time picker when clicked.
 * No other UI elements; intent is to test opening the Start field overlay without setting values.
 *
 * Success: The Start DateTimePicker popover for the Event window group is open (calendar/time UI visible).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [startValue, setStartValue] = useState<Date | null>(null);
  const [endValue, setEndValue] = useState<Date | null>(null);
  const [startOpen, setStartOpen] = useState(false);

  useEffect(() => {
    if (startOpen) {
      onSuccess();
    }
  }, [startOpen, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }} data-cb-instance="Event window">
      <Text fw={600} size="lg" mb="md">Event Window</Text>
      <Text size="sm" c="dimmed" mb="md">
        (Clicking a field opens a popover.)
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
            popoverProps={{
              onOpen: () => setStartOpen(true),
              onClose: () => setStartOpen(false),
            }}
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
