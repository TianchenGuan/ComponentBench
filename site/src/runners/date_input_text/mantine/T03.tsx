'use client';

/**
 * date_input_text-mantine-T03: Mantine clear a date with clearable button
 * 
 * Layout: isolated_card centered in the viewport.
 * Component: one Mantine DateInput labeled "Reminder date" with clearable enabled (clear button appears in the right section when a value exists).
 * Initial state: pre-filled with 2026-04-10.
 * Sub-controls: calendar icon + clear (✕) button within the input's right section.
 * Distractors: none.
 * Feedback: clearing removes the value and restores the placeholder "YYYY-MM-DD".
 * 
 * Success: The "Reminder date" DateInput value is empty/null (no date selected).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, CloseButton } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Date | null>(new Date('2026-04-10'));
  const initialRender = useRef(true);

  useEffect(() => {
    // Skip initial render
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    if (value === null) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Reminders</Text>
      
      <div>
        <Text component="label" htmlFor="reminder-date" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
          Reminder date
        </Text>
        <DateInput
          id="reminder-date"
          value={value}
          onChange={setValue}
          valueFormat="YYYY-MM-DD"
          placeholder="YYYY-MM-DD"
          clearable
          data-testid="reminder-date"
          rightSection={
            value ? (
              <CloseButton
                size="sm"
                onClick={() => setValue(null)}
                data-testid="reminder-date-clear"
              />
            ) : null
          }
        />
      </div>
    </Card>
  );
}
