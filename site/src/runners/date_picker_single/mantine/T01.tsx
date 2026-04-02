'use client';

/**
 * date_picker_single-mantine-T01: Pick event date with DatePickerInput
 *
 * Scene: Centered isolated card, light theme, comfortable spacing, default scale.
 *
 * Target component: One Mantine DatePickerInput labeled "Event date" (single-date default type).
 * - Initial state: empty input with placeholder "Pick date".
 * - Interaction: Clicking the input opens a popover calendar (Mantine Popover). Selecting a day sets the value.
 * - The selected date is displayed in the input in a readable format and also stored as a Date value.
 *
 * Distractors: None.
 *
 * Feedback: Selecting a day updates the input immediately and closes the popover.
 *
 * Success: Date picker must have selected date = 2026-03-05.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Date | null>(null);

  useEffect(() => {
    if (value && dayjs(value).format('YYYY-MM-DD') === '2026-03-05') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Event date</Text>
      
      <div>
        <Text component="label" htmlFor="event-date" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
          Event date
        </Text>
        <DatePickerInput
          id="event-date"
          value={value}
          onChange={setValue}
          valueFormat="YYYY-MM-DD"
          placeholder="Pick date"
          data-testid="event-date"
        />
      </div>
    </Card>
  );
}
