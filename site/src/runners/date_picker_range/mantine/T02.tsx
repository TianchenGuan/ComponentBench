'use client';

/**
 * date_picker_range-mantine-T02: Select a February weekend trip range
 *
 * Isolated card centered in the viewport with one Mantine DatePickerInput
 * (type='range') labeled 'Trip dates'. The calendar opens in a Popover dropdown.
 * The initial visible month is February 2026. Selecting the start and end dates
 * highlights the in-between days and fills the input with the chosen range immediately
 * (no separate Apply/OK control).
 *
 * Success: Start date = 2026-02-10, End date = 2026-02-14
 */

import React, { useState, useEffect } from 'react';
import { Card, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);

  useEffect(() => {
    if (
      value[0] &&
      value[1] &&
      dayjs(value[0]).format('YYYY-MM-DD') === '2026-02-10' &&
      dayjs(value[1]).format('YYYY-MM-DD') === '2026-02-14'
    ) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">Trip dates</Text>
      
      <div>
        <Text component="label" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
          Trip dates
        </Text>
        <DatePickerInput
          type="range"
          value={value}
          onChange={setValue}
          valueFormat="YYYY-MM-DD"
          placeholder="Pick dates range"
          defaultDate={new Date(2026, 1, 1)} // February 2026
          data-testid="trip-dates-range"
        />
      </div>
    </Card>
  );
}
