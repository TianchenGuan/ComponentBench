'use client';

/**
 * date_picker_single-mantine-T03: Clear a clearable DatePickerInput
 *
 * Scene: Centered isolated card, light theme, comfortable spacing.
 *
 * Target component: One Mantine DatePickerInput labeled "Reminder".
 * - Initial state: the input contains a prefilled date "2026-01-15".
 * - Configuration: `clearable=true`, which shows a clear (x) button in the right section of the input when a value is present.
 * - Clicking the clear button removes the value and returns the input to its placeholder state.
 *
 * Distractors: None.
 *
 * Feedback: Clearing is immediate with no confirmation.
 *
 * Success: Date picker must have selected date = empty (no date).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Date | null>(new Date('2026-01-15'));

  useEffect(() => {
    if (value === null) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Reminder (prefilled)</Text>
      
      <div>
        <Text component="label" htmlFor="reminder" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
          Reminder
        </Text>
        <DatePickerInput
          id="reminder"
          value={value}
          onChange={setValue}
          valueFormat="YYYY-MM-DD"
          placeholder="Pick date"
          clearable
          data-testid="reminder"
        />
      </div>
    </Card>
  );
}
