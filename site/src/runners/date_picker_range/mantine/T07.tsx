'use client';

/**
 * date_picker_range-mantine-T07: Pick a workdays-only range in a compact inline calendar
 *
 * An isolated card centered in the viewport containing an inline
 * Mantine DatePicker (not an input) configured with type='range'. The page uses
 * compact spacing and the calendar is rendered in a small size. Two months are shown
 * side-by-side (numberOfColumns=2). Weekends are disabled via excludeDate (Saturday/Sunday
 * cells appear disabled and cannot be selected). There is a small readout text below
 * the calendar showing the currently selected start and end dates in ISO form, for
 * observability. The initial value is empty.
 *
 * Success: Start date = 2026-01-12, End date = 2026-01-16
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Box } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);

  useEffect(() => {
    if (
      value[0] &&
      value[1] &&
      dayjs(value[0]).format('YYYY-MM-DD') === '2026-01-12' &&
      dayjs(value[1]).format('YYYY-MM-DD') === '2026-01-16'
    ) {
      onSuccess();
    }
  }, [value, onSuccess]);

  // Exclude weekends (Saturday = 6, Sunday = 0)
  const excludeDate = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 600 }}>
      <Text fw={600} size="md" mb="sm">Workdays-only window (weekends disabled)</Text>
      
      <Box>
        <DatePicker
          type="range"
          value={value}
          onChange={setValue}
          numberOfColumns={2}
          excludeDate={excludeDate}
          defaultDate={new Date(2026, 0, 1)} // January 2026
          size="sm"
          data-testid="workdays-only-range"
        />
        
        <Text size="xs" c="dimmed" mt="md" data-testid="selected-range-readout">
          Selected: {value[0] && value[1] 
            ? `${dayjs(value[0]).format('YYYY-MM-DD')} to ${dayjs(value[1]).format('YYYY-MM-DD')}` 
            : 'None'}
        </Text>
      </Box>
    </Card>
  );
}
