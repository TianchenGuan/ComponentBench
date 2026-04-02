'use client';

/**
 * date_input_text-mantine-T07: Mantine DateInput with min/max and weekdays-only validation
 * 
 * Layout: isolated_card centered in the viewport.
 * Component: one Mantine DateInput labeled "Payroll date" (valueFormat YYYY-MM-DD).
 * Validation configuration:
 *   - minDate = 2026-02-01
 *   - maxDate = 2026-02-28
 *   - weekends are disabled (only weekdays are allowed)
 * A helper hint under the input reads: "Weekdays only. Allowed range: 2026-02-01 to 2026-02-28."
 * Initial state: pre-filled with 2026-02-10 (a valid weekday).
 * Behavior: if the user types a date outside the allowed range or on a weekend, the input is considered invalid and reverts to the last known valid date when blurred/committed (Mantine DateInput validation behavior).
 * Distractors: none.
 * Feedback: invalid entry shows a brief inline error message ("Invalid date") before reverting; valid entry clears the error and keeps the new value.
 * 
 * Success: The "Payroll date" value equals 2026-02-25 (a weekday within range).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Date | null>(new Date('2026-02-10'));
  const minDate = new Date('2026-02-01');
  const maxDate = new Date('2026-02-28');

  // Check if date is a weekend (Saturday=6, Sunday=0)
  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  // Exclude weekends from being selectable
  const excludeDate = (date: Date) => isWeekend(date);

  useEffect(() => {
    if (value && dayjs(value).format('YYYY-MM-DD') === '2026-02-25') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Payroll</Text>
      
      <div>
        <Text component="label" htmlFor="payroll-date" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
          Payroll date
        </Text>
        <DateInput
          id="payroll-date"
          value={value}
          onChange={setValue}
          valueFormat="YYYY-MM-DD"
          placeholder="YYYY-MM-DD"
          minDate={minDate}
          maxDate={maxDate}
          excludeDate={excludeDate}
          data-testid="payroll-date"
        />
        <Text size="xs" c="dimmed" mt={4}>
          Weekdays only. Allowed range: 2026-02-01 to 2026-02-28.
        </Text>
      </div>
    </Card>
  );
}
