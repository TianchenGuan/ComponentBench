'use client';

/**
 * calendar_embedded-mantine-T03: Clear the selected date (Mantine Calendar)
 *
 * Layout: isolated_card centered (light theme, comfortable spacing, default scale).
 * The card contains a Mantine Calendar showing February 2026.
 * One date is pre-selected on load: 2026-02-12 (the cell is highlighted as selected).
 * Under the calendar, a readout displays "Selected date: 2026-02-12".
 * Next to the readout is a button labeled "Clear selection" that resets the selection to empty (no selected date).
 * There are no other interactive elements (clutter: none).
 *
 * Success: The calendar has no selected date (null/empty selection).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Button, Group } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 1, 12));

  useEffect(() => {
    if (selectedDate === null) {
      onSuccess();
    }
  }, [selectedDate, onSuccess]);

  const handleClear = () => {
    setSelectedDate(null);
  };

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
      <Group mt="md" gap="md">
        <Text size="sm">
          <Text component="span" fw={500}>Selected date: </Text>
          <Text component="span" data-testid="selected-date">
            {selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : '(none)'}
          </Text>
        </Text>
        <Button variant="subtle" size="xs" onClick={handleClear} data-testid="clear-selection">
          Clear selection
        </Button>
      </Group>
    </Card>
  );
}
