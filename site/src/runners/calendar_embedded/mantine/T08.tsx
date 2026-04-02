'use client';

/**
 * calendar_embedded-mantine-T08: Use level change to reach 2035-11-23 in a compact small calendar
 *
 * Layout: isolated_card centered (light theme) with compact spacing and small scale.
 * The page contains one Mantine Calendar rendered in a smaller-than-default container.
 * The calendar supports level changes: clicking the month/year label toggles between day view → month picker → year picker.
 * The calendar starts in day view around February 2026 with no selection.
 * To reach the target, the user can open the year picker, choose 2035, then choose November in the month picker, then select day 23 in the day grid.
 * A small readout under the calendar shows "Selected date:" in YYYY-MM-DD after a day is selected.
 * No other controls are present (clutter: none).
 *
 * Success: The selected date equals 2035-11-23.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 1, 1));

  useEffect(() => {
    if (
      selectedDate &&
      dayjs(selectedDate).format('YYYY-MM-DD') === '2035-11-23' &&
      dayjs(currentDate).format('YYYY-MM') === '2035-11'
    ) {
      onSuccess();
    }
  }, [selectedDate, currentDate, onSuccess]);

  return (
    <Card
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
      style={{ width: 300 }}
      data-testid="calendar-card"
    >
      <Calendar
        date={currentDate}
        onDateChange={setCurrentDate}
        size="xs"
        getDayProps={(date) => ({
          selected: selectedDate ? dayjs(date).isSame(selectedDate, 'day') : false,
          onClick: () => {
            setSelectedDate(date);
            setCurrentDate(date);
          },
        })}
        minDate={new Date(1900, 0, 1)}
        maxDate={new Date(2099, 11, 31)}
        data-testid="calendar-embedded"
      />
      <Text size="xs" mt="sm">
        <Text component="span" fw={500}>Selected date: </Text>
        <Text component="span" data-testid="selected-date">
          {selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : '—'}
        </Text>
      </Text>
    </Card>
  );
}
