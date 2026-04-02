'use client';

/**
 * datetime_picker_range-mantine-T07: Year-end window: cross-year range (dark theme, composite)
 *
 * Layout: isolated_card centered in dark theme; comfortable spacing, default scale.
 * Composite range group "Year-end window" contains Start and End Mantine DateTimePicker fields.
 * Target spans a year boundary (Dec 31 → Jan 1), requiring navigation between months/years in the calendar view for at least one of the fields.
 * Initial state: empty. No other UI elements.
 *
 * Success: start=2026-12-31T23:00:00, end=2027-01-01T01:00:00 (local time).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack, MantineProvider } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [startValue, setStartValue] = useState<Date | null>(null);
  const [endValue, setEndValue] = useState<Date | null>(null);

  useEffect(() => {
    if (startValue && endValue) {
      const startMatch = dayjs(startValue).format('YYYY-MM-DD HH:mm') === '2026-12-31 23:00';
      const endMatch = dayjs(endValue).format('YYYY-MM-DD HH:mm') === '2027-01-01 01:00';
      if (startMatch && endMatch) {
        onSuccess();
      }
    }
  }, [startValue, endValue, onSuccess]);

  return (
    <MantineProvider forceColorScheme="dark">
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        style={{ width: 450, backgroundColor: '#1a1b1e' }}
        data-cb-instance="Year-end window"
      >
        <Text fw={600} size="lg" mb="md" c="white">Year-end Window (dark mode)</Text>
        <Text size="sm" c="dimmed" mb="md">
          (Each field opens a calendar + time picker.)
        </Text>
        <Stack gap="md">
          <div>
            <Text component="label" fw={500} size="sm" mb={4} style={{ display: 'block' }} c="white">
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
            <Text component="label" fw={500} size="sm" mb={4} style={{ display: 'block' }} c="white">
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
    </MantineProvider>
  );
}
