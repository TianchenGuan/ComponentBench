'use client';

/**
 * date_picker_single-mantine-T02: Type a date into DateInput
 *
 * Scene: Centered isolated card, light theme, comfortable spacing.
 *
 * Target component: One Mantine DateInput labeled "Birthday".
 * - Initial state: empty.
 * - The input supports free-form typing as well as opening a calendar popover.
 * - A helper text under the field indicates the expected format: "YYYY-MM-DD".
 * - Invalid text shows an inline error state and does not set the underlying value.
 *
 * Distractors: None.
 *
 * Feedback: When a valid date is entered and committed (blur/Enter), the input displays the normalized value and the internal Date value is updated.
 *
 * Success: Date picker must have selected date = 2026-04-21.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Date | null>(null);

  useEffect(() => {
    if (value && dayjs(value).format('YYYY-MM-DD') === '2026-04-21') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Birthday</Text>
      
      <div>
        <Text component="label" htmlFor="birthday" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
          Birthday
        </Text>
        <DateInput
          id="birthday"
          value={value}
          onChange={setValue}
          valueFormat="YYYY-MM-DD"
          placeholder="YYYY-MM-DD"
          data-testid="birthday"
        />
        <Text size="xs" c="dimmed" mt={4}>
          Format: YYYY-MM-DD
        </Text>
      </div>
    </Card>
  );
}
