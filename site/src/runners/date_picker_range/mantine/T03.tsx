'use client';

/**
 * date_picker_range-mantine-T03: Clear a preselected range with clear button
 *
 * Isolated card centered in the viewport with one Mantine DatePickerInput
 * configured as a range picker (type='range') and labeled 'Availability'. The field
 * is prefilled with a range (Jan 23, 2026 – Jan 30, 2026) and has clearable=true,
 * which shows a small clear (×) button in the right section of the input when hovered/focused.
 * Clicking the clear button resets both start and end to null.
 *
 * Success: Start date is empty (null), End date is empty (null).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[Date | null, Date | null]>([
    new Date(2026, 0, 23), // Jan 23, 2026
    new Date(2026, 0, 30), // Jan 30, 2026
  ]);

  useEffect(() => {
    if (!value[0] && !value[1]) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={600} size="lg" mb="md">Availability</Text>
      
      <div>
        <Text component="label" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
          Availability
        </Text>
        <DatePickerInput
          type="range"
          value={value}
          onChange={setValue}
          valueFormat="MMM DD, YYYY"
          placeholder="Pick dates range"
          clearable
          data-testid="availability-range"
        />
        <Text size="xs" c="dimmed" mt={8}>
          Current: {value[0] && value[1] 
            ? `${dayjs(value[0]).format('MMM DD, YYYY')} – ${dayjs(value[1]).format('MMM DD, YYYY')}` 
            : 'Empty'}
        </Text>
      </div>
    </Card>
  );
}
