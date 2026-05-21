'use client';

/**
 * calendar_embedded-mantine-T09: Select five workweek dates in a dashboard
 *
 * Layout: dashboard (light theme, comfortable spacing, default scale) with medium clutter.
 * The page is a small scheduling dashboard: a left sidebar has navigation links (Overview, Teams, Reports) and the main area contains a calendar card.
 * The calendar card contains a Mantine Calendar showing June 2026.
 * The calendar is configured for multi-select (click to toggle selected). Multiple dates may be selected.
 * A selected-dates panel under the calendar shows chips for all currently selected dates in ISO format.
 * Distractors: the sidebar links and a top "Search" input are clickable but do not affect task success.
 * The calendar is the only stateful component used for checking success.
 *
 * Success: The set of selected dates equals {2026-06-15, 2026-06-16, 2026-06-17, 2026-06-18, 2026-06-19}.
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, TextInput, Badge, Group, Stack, Box, NavLink } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import { IconSearch, IconHome, IconUsers, IconChartBar } from '@tabler/icons-react';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

const TARGET_DATES = ['2026-06-15', '2026-06-16', '2026-06-17', '2026-06-18', '2026-06-19'];

export default function T09({ onSuccess }: TaskComponentProps) {
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
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  return (
    <Box style={{ display: 'flex', width: 700, gap: 16 }} data-testid="dashboard">
      {/* Sidebar */}
      <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 180 }}>
        <Stack gap="xs">
          <NavLink label="Overview" leftSection={<IconHome size={16} />} data-testid="nav-overview" />
          <NavLink label="Teams" leftSection={<IconUsers size={16} />} data-testid="nav-teams" />
          <NavLink label="Reports" leftSection={<IconChartBar size={16} />} data-testid="nav-reports" />
        </Stack>
      </Card>

      {/* Main content */}
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ flex: 1 }}>
        <TextInput
          placeholder="Search..."
          leftSection={<IconSearch size={16} />}
          mb="md"
          data-testid="search-input"
        />

        <Text fw={600} mb="xs">Dashboard — select workweek dates (5)</Text>

        <Calendar
          defaultDate={new Date(2026, 5, 1)}
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
    </Box>
  );
}
