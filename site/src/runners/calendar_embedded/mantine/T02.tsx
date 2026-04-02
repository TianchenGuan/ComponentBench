'use client';

/**
 * calendar_embedded-mantine-T02: Navigate to July 2026 (Mantine Calendar)
 *
 * Layout: isolated_card centered (light theme, comfortable spacing, default scale).
 * The page contains a single Mantine Calendar showing February 2026 initially.
 * The header provides previous/next month chevrons and a central month/year label.
 * Day selection is enabled but not required for this task.
 * A small label above the calendar reads "Viewing:" and mirrors the current visible month as YYYY-MM.
 * No other widgets are present (clutter: none).
 *
 * Success: The calendar's visible month equals 2026-07 (July 2026).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 1, 1));

  useEffect(() => {
    if (dayjs(currentDate).format('YYYY-MM') === '2026-07') {
      onSuccess();
    }
  }, [currentDate, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 380 }} data-testid="calendar-card">
      <Text size="sm" mb="sm">
        <Text component="span" fw={500}>Viewing: </Text>
        <Text component="span" data-testid="viewing-month">
          {dayjs(currentDate).format('YYYY-MM')}
        </Text>
      </Text>
      <Calendar
        date={currentDate}
        onDateChange={setCurrentDate}
        data-testid="calendar-embedded"
      />
    </Card>
  );
}
