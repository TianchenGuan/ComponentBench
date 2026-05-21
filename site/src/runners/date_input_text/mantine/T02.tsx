'use client';

/**
 * date_input_text-mantine-T02: Mantine overwrite an existing date value
 * 
 * Layout: isolated_card centered in the viewport.
 * Component: one Mantine DateInput labeled "Renewal date" with valueFormat YYYY-MM-DD.
 * Initial state: pre-filled with 2026-03-01.
 * Sub-controls: calendar icon is present but optional; editing can be done via typing.
 * Distractors: none.
 * Feedback: once a valid date is committed, the input displays the new value and any internal error state remains clear.
 * 
 * Success: The "Renewal date" DateInput value equals 2026-03-31.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Date | null>(new Date('2026-03-01'));

  useEffect(() => {
    if (value && dayjs(value).format('YYYY-MM-DD') === '2026-03-31') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Subscription</Text>
      
      <div>
        <Text component="label" htmlFor="renewal-date" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
          Renewal date
        </Text>
        <DateInput
          id="renewal-date"
          value={value}
          onChange={setValue}
          valueFormat="YYYY-MM-DD"
          placeholder="YYYY-MM-DD"
          data-testid="renewal-date"
        />
      </div>
    </Card>
  );
}
