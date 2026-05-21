'use client';

/**
 * date_picker_single-mantine-T06: Set a small launch date picker in the top-right
 *
 * Scene: An isolated card anchored near the top-right of the viewport (placement=top_right).
 * Light theme, comfortable spacing. The DatePickerInput uses a small size variant (scale=small) to mimic a compact toolbar form.
 *
 * Target component: One Mantine DatePickerInput labeled "Launch date".
 * - Initial state: empty.
 * - Interaction: Clicking the small input opens the popover calendar.
 *
 * Distractors: None.
 *
 * Feedback: Selecting a day sets the value immediately and closes the popover.
 *
 * Success: Date picker must have selected date = 2026-02-14.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Date | null>(null);

  useEffect(() => {
    if (value && dayjs(value).format('YYYY-MM-DD') === '2026-02-14') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 300 }}>
      <Text fw={600} size="md" mb="sm">Marketing</Text>
      
      <div>
        <Text component="label" htmlFor="launch-date" fw={500} size="xs" mb={2} style={{ display: 'block' }}>
          Launch date
        </Text>
        <DatePickerInput
          id="launch-date"
          value={value}
          onChange={setValue}
          valueFormat="YYYY-MM-DD"
          placeholder="Pick date"
          size="xs"
          data-testid="launch-date"
        />
      </div>
    </Card>
  );
}
