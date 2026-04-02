'use client';

/**
 * date_picker_single-mantine-T10: Enter a date with DD/MM/YYYY valueFormat
 *
 * Scene: Centered isolated card, light theme, comfortable spacing.
 *
 * Target component: One Mantine DateInput labeled "Invoice date".
 * - Configuration: The displayed/parsed format is set to DD/MM/YYYY (via `valueFormat` / parsing configuration in the adapter).
 * - Initial state: empty.
 * - Validation: If the user enters a string that does not match the required format, the field shows an error message "Use DD/MM/YYYY".
 *
 * Distractors: None.
 *
 * Feedback: When the input is valid and committed, the internal date value updates to the parsed canonical date.
 *
 * Success: Date picker must have selected date = 2026-11-23.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Date | null>(null);

  useEffect(() => {
    if (value && dayjs(value).format('YYYY-MM-DD') === '2026-11-23') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Invoice date</Text>
      
      <div>
        <Text component="label" htmlFor="invoice-date" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
          Invoice date
        </Text>
        <DateInput
          id="invoice-date"
          value={value}
          onChange={setValue}
          valueFormat="DD/MM/YYYY"
          placeholder="DD/MM/YYYY"
          dateParser={(input) => {
            // Parse DD/MM/YYYY format
            const parts = input.split('/');
            if (parts.length === 3) {
              const day = parseInt(parts[0], 10);
              const month = parseInt(parts[1], 10) - 1;
              const year = parseInt(parts[2], 10);
              if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                return new Date(year, month, day);
              }
            }
            return null;
          }}
          data-testid="invoice-date"
        />
        <Text size="xs" c="dimmed" mt={4}>
          Use DD/MM/YYYY
        </Text>
      </div>
    </Card>
  );
}
