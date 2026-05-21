'use client';

/**
 * calendar_embedded-mantine-T05: Select a date range (start and end)
 *
 * Layout: isolated_card centered (light theme, comfortable spacing, default scale).
 * The card contains one Mantine Calendar initially showing March 2026.
 * The calendar is configured for range selection:
 *   - First click sets the range start (start date).
 *   - Second click sets the range end.
 *   - Days between start and end are highlighted as an in-range band.
 * The initial state has no start and no end selected.
 * Below the calendar, a readout shows "Range start:" and "Range end:" in YYYY-MM-DD (empty until chosen).
 * There are no other interactive elements on the page (clutter: none).
 *
 * Success: The selected range start equals 2026-03-10 and the selected range end equals 2026-03-14.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Stack } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import type { TaskComponentProps } from '../types';

dayjs.extend(isBetween);

export default function T05({ onSuccess }: TaskComponentProps) {
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd, setRangeEnd] = useState<Date | null>(null);

  useEffect(() => {
    if (
      rangeStart &&
      rangeEnd &&
      dayjs(rangeStart).format('YYYY-MM-DD') === '2026-03-10' &&
      dayjs(rangeEnd).format('YYYY-MM-DD') === '2026-03-14'
    ) {
      onSuccess();
    }
  }, [rangeStart, rangeEnd, onSuccess]);

  const handleDayClick = (date: Date) => {
    if (!rangeStart || (rangeStart && rangeEnd)) {
      // Start fresh or reset
      setRangeStart(date);
      setRangeEnd(null);
    } else {
      // Set end date
      if (dayjs(date).isBefore(rangeStart)) {
        // Clicked before start, swap
        setRangeEnd(rangeStart);
        setRangeStart(date);
      } else {
        setRangeEnd(date);
      }
    }
  };

  const isInRange = (date: Date) => {
    if (!rangeStart || !rangeEnd) return false;
    return dayjs(date).isBetween(rangeStart, rangeEnd, 'day', '[]');
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 380 }} data-testid="calendar-card">
      <Text size="sm" mb="sm" fw={500}>
        Select range: 2026-03-10 → 2026-03-14
      </Text>
      <Calendar
        defaultDate={new Date(2026, 2, 1)}
        getDayProps={(date) => ({
          selected:
            (rangeStart !== null && dayjs(date).isSame(rangeStart, 'day')) ||
            (rangeEnd !== null && dayjs(date).isSame(rangeEnd, 'day')),
          onClick: () => handleDayClick(date),
          style: isInRange(date)
            ? { backgroundColor: 'var(--mantine-color-blue-1)' }
            : undefined,
        })}
        data-testid="calendar-embedded"
      />
      <Stack gap={4} mt="md">
        <Text size="sm">
          <Text component="span" fw={500}>Range start: </Text>
          <Text component="span" data-testid="range-start">
            {rangeStart ? dayjs(rangeStart).format('YYYY-MM-DD') : '—'}
          </Text>
        </Text>
        <Text size="sm">
          <Text component="span" fw={500}>Range end: </Text>
          <Text component="span" data-testid="range-end">
            {rangeEnd ? dayjs(rangeEnd).format('YYYY-MM-DD') : '—'}
          </Text>
        </Text>
      </Stack>
    </Card>
  );
}
