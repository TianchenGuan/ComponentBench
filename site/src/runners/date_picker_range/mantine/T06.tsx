'use client';

/**
 * date_picker_range-mantine-T06: Select a single-day range
 *
 * Isolated card centered in the viewport with one Mantine DatePickerInput
 * labeled 'One-day outage'. It is configured as a range picker (type='range') and
 * allowSingleDateInRange=true, so a range of length 1 day is valid. The input starts
 * empty. The calendar dropdown opens in a popover showing April 2026. To create
 * a single-day range, the user selects April 8, 2026 as both start and end (e.g.,
 * by selecting the same date twice or completing the range on the same day).
 *
 * Success: Start date = 2026-04-08, End date = 2026-04-08
 */

import React, { useState, useEffect } from 'react';
import { Card, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);

  useEffect(() => {
    if (
      value[0] &&
      value[1] &&
      dayjs(value[0]).format('YYYY-MM-DD') === '2026-04-08' &&
      dayjs(value[1]).format('YYYY-MM-DD') === '2026-04-08'
    ) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">One-day outage — single-day range allowed</Text>
      
      <div>
        <Text component="label" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
          One-day outage
        </Text>
        <DatePickerInput
          type="range"
          value={value}
          onChange={setValue}
          valueFormat="YYYY-MM-DD"
          placeholder="Pick dates range"
          allowSingleDateInRange
          defaultDate={new Date(2026, 3, 1)} // April 2026
          data-testid="one-day-outage-range"
        />
        <Text size="xs" c="dimmed" mt={8}>
          Select April 8, 2026 as both start and end
        </Text>
      </div>
    </Card>
  );
}
