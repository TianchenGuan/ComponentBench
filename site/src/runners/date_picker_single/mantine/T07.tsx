'use client';

/**
 * date_picker_single-mantine-T07: Choose a far past date on an inline calendar
 *
 * Scene: Centered isolated card, light theme, comfortable spacing.
 *
 * Target component: A Mantine DatePicker rendered inline (always visible calendar, not inside an input).
 * - Initial state: no date selected; the calendar initially shows a near-term month/year.
 * - Interaction: The user must use the calendar header controls to navigate across years to reach December 1998, then click day 31.
 * - Because the calendar is inline, there is no popover open/close step; all complexity comes from within-component navigation.
 *
 * Distractors: None.
 *
 * Feedback: Clicking a day highlights the selection immediately within the calendar.
 *
 * Success: Date picker must have selected date = 1998-12-31.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Date | null>(null);

  useEffect(() => {
    if (value && dayjs(value).format('YYYY-MM-DD') === '1998-12-31') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={600} size="lg" mb="md">Company founding date</Text>
      <Text size="sm" c="dimmed" mb="md">
        On the inline calendar, select the date 1998-12-31.
      </Text>
      
      <DatePicker
        value={value}
        onChange={setValue}
        data-testid="founding-date"
      />
    </Card>
  );
}
