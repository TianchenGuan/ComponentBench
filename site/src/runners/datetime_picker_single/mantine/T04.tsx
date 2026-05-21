'use client';

/**
 * datetime_picker_single-mantine-T04: Mantine modal dropdown set datetime
 *
 * Layout: isolated card centered.
 * Component: Mantine DateTimePicker labeled "Lock time".
 * Variant: dropdownType=modal (picker opens in a modal overlay instead of a popover).
 * Within the modal: calendar for date selection and time controls for hours/minutes; closing the modal (outside click or close button) leaves the chosen value in the field.
 * Initial state: empty.
 *
 * Success: The "Lock time" DateTimePicker equals 2026-03-03 18:15.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<Date | null>(null);

  useEffect(() => {
    if (value && dayjs(value).format('YYYY-MM-DD HH:mm') === '2026-03-03 18:15') {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Security Settings</Text>
      <Stack gap="md">
        <div>
          <Text component="label" htmlFor="dt-lock" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
            Lock time
          </Text>
          <DateTimePicker
            id="dt-lock"
            value={value}
            onChange={setValue}
            placeholder="Pick date and time"
            dropdownType="modal"
            data-testid="dt-lock"
          />
        </div>
      </Stack>
    </Card>
  );
}
