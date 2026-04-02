'use client';

/**
 * calendar_embedded-mantine-T01: Pick a single date (Mantine Calendar)
 *
 * Layout: isolated_card centered (light theme, comfortable spacing, default scale).
 * The card contains a single Mantine Calendar component (@mantine/dates) showing February 2026 on load.
 * The calendar header has previous/next month chevrons and a month/year label.
 * Single-date selection behavior is implemented on top of Calendar: clicking a day toggles it into the selected state (highlighted background).
 * Initially, no date is selected.
 * A readout line below the calendar shows "Selected date:" and updates to YYYY-MM-DD whenever a day is selected.
 * No other interactive elements are present (clutter: none).
 *
 * Success: The calendar's selected date equals 2026-02-05.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (selectedDate && dayjs(selectedDate).format('YYYY-MM-DD') === '2026-02-05') {
      onSuccess();
    }
  }, [selectedDate, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 380 }} data-testid="calendar-card">
      <Calendar
        defaultDate={new Date(2026, 1, 1)}
        getDayProps={(date) => ({
          selected: selectedDate ? dayjs(date).isSame(selectedDate, 'day') : false,
          onClick: () => setSelectedDate(date),
        })}
        data-testid="calendar-embedded"
      />
      <Text size="sm" mt="md">
        <Text component="span" fw={500}>Selected date: </Text>
        <Text component="span" data-testid="selected-date">
          {selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : '—'}
        </Text>
      </Text>
    </Card>
  );
}
