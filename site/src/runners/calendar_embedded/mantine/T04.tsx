'use client';

/**
 * calendar_embedded-mantine-T04: Select three availability dates (multi-select)
 *
 * Layout: isolated_card centered (light theme, comfortable spacing, default scale).
 * The card contains one Mantine Calendar showing February 2026.
 * This calendar is configured as a custom multi-select: clicking a day toggles its selected state, and up to 3 dates can be selected at once.
 * Initially, no dates are selected.
 * A small panel below the calendar lists selected dates as chips in ISO format (YYYY-MM-DD), in sorted order.
 * There are no other interactive elements (clutter: none).
 *
 * Success: The set of selected dates equals {2026-02-03, 2026-02-10, 2026-02-17}.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Badge, Group } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

const TARGET_DATES = ['2026-02-03', '2026-02-10', '2026-02-17'];

export default function T04({ onSuccess }: TaskComponentProps) {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  useEffect(() => {
    const selectedIso = selectedDates.map((d) => dayjs(d).format('YYYY-MM-DD')).sort();
    const targetSorted = [...TARGET_DATES].sort();
    if (
      selectedIso.length === targetSorted.length &&
      selectedIso.every((d, i) => d === targetSorted[i])
    ) {
      onSuccess();
    }
  }, [selectedDates, onSuccess]);

  const handleDayClick = (date: Date) => {
    const dateStr = dayjs(date).format('YYYY-MM-DD');
    const isSelected = selectedDates.some((d) => dayjs(d).format('YYYY-MM-DD') === dateStr);

    if (isSelected) {
      setSelectedDates(selectedDates.filter((d) => dayjs(d).format('YYYY-MM-DD') !== dateStr));
    } else if (selectedDates.length < 3) {
      setSelectedDates([...selectedDates, date]);
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 380 }} data-testid="calendar-card">
      <Text size="sm" mb="sm" fw={500}>
        Availability (pick 3): 2026-02-03, 2026-02-10, 2026-02-17
      </Text>
      <Calendar
        defaultDate={new Date(2026, 1, 1)}
        getDayProps={(date) => ({
          selected: selectedDates.some((d) => dayjs(d).isSame(date, 'day')),
          onClick: () => handleDayClick(date),
        })}
        data-testid="calendar-embedded"
      />
      <Group mt="md" gap="xs">
        <Text size="sm" fw={500}>Selected:</Text>
        {selectedDates
          .sort((a, b) => a.getTime() - b.getTime())
          .map((date) => (
            <Badge key={dayjs(date).format('YYYY-MM-DD')} variant="light" data-testid="selected-chip">
              {dayjs(date).format('YYYY-MM-DD')}
            </Badge>
          ))}
        {selectedDates.length === 0 && (
          <Text size="sm" c="dimmed">—</Text>
        )}
      </Group>
    </Card>
  );
}
