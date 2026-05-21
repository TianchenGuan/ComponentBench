'use client';

/**
 * date_input_text-mantine-T01: Mantine DateInput basic typed ISO date
 * 
 * Layout: isolated_card centered in the viewport.
 * Component: one Mantine DateInput labeled "Invoice date".
 * Configuration: the input displays/accepts YYYY-MM-DD (valueFormat set accordingly) and shows placeholder "YYYY-MM-DD".
 * Initial state: empty; dropdown calendar is closed.
 * Sub-controls: a calendar icon is shown inside the input; a clear button appears only when a value exists (if clearable is enabled, but not needed here).
 * Distractors: none.
 * Feedback: after committing a valid date, the input displays the formatted value and keeps it as the canonical date state.
 * 
 * Success: The DateInput value (canonical date) equals 2026-02-14.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Date | null>(null);

  useEffect(() => {
    if (value && dayjs(value).format('YYYY-MM-DD') === '2026-02-14') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Date entry</Text>
      
      <div>
        <Text component="label" htmlFor="invoice-date" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
          Invoice date
        </Text>
        <DateInput
          id="invoice-date"
          value={value}
          onChange={setValue}
          valueFormat="YYYY-MM-DD"
          placeholder="YYYY-MM-DD"
          data-testid="invoice-date"
        />
      </div>
    </Card>
  );
}
