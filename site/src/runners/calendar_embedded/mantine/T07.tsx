'use client';

/**
 * calendar_embedded-mantine-T07: Select the neon-marked target day (dark theme)
 *
 * Layout: isolated_card centered in dark theme (comfortable spacing, default scale).
 * The card contains a single Mantine Calendar showing May 2026.
 * Above the calendar is a small legend showing a neon green ring icon labeled "Target".
 * In the calendar grid, exactly one day cell has a neon green ring around the day number (no text label with the date is provided).
 * Several other days have subtle gray dots (non-target markers) to increase confusability.
 * The calendar does not show a persistent selected-date text readout; selection is indicated only by the cell highlight style.
 * No other interactive elements are present (clutter: none).
 *
 * Success: The selected date equals the day with the neon green Target ring (2026-05-09).
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Group, Box } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

const TARGET_DATE = '2026-05-09';
const GRAY_DOT_DATES = ['2026-05-03', '2026-05-11', '2026-05-18', '2026-05-22', '2026-05-27'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (selectedDate && dayjs(selectedDate).format('YYYY-MM-DD') === TARGET_DATE) {
      onSuccess();
    }
  }, [selectedDate, onSuccess]);

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{ width: 380, background: '#1f1f1f', color: '#fff' }}
      data-testid="calendar-card"
    >
      {/* Legend */}
      <Group gap="xs" mb="sm">
        <Box
          style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            border: '2px solid #39ff14',
          }}
        />
        <Text size="sm" c="gray.4">Target</Text>
      </Group>

      <Calendar
        defaultDate={new Date(2026, 4, 1)}
        getDayProps={(date) => {
          const dateStr = dayjs(date).format('YYYY-MM-DD');
          const isTarget = dateStr === TARGET_DATE;
          const isGrayDot = GRAY_DOT_DATES.includes(dateStr);

          return {
            selected: selectedDate ? dayjs(date).isSame(selectedDate, 'day') : false,
            onClick: () => setSelectedDate(date),
            style: {
              position: 'relative',
            },
            children: (
              <>
                {isTarget && (
                  <Box
                    style={{
                      position: 'absolute',
                      inset: 2,
                      borderRadius: '50%',
                      border: '2px solid #39ff14',
                      pointerEvents: 'none',
                    }}
                    data-marker="target"
                  />
                )}
                {isGrayDot && (
                  <Box
                    style={{
                      position: 'absolute',
                      bottom: 2,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      backgroundColor: '#666',
                      pointerEvents: 'none',
                    }}
                    data-marker="gray-dot"
                  />
                )}
              </>
            ),
          };
        }}
        styles={{
          day: {
            color: '#fff',
            '&[data-selected]': {
              backgroundColor: 'var(--mantine-color-blue-6)',
            },
          },
          weekday: {
            color: '#999',
          },
          calendarHeaderLevel: {
            color: '#fff',
          },
          calendarHeaderControl: {
            color: '#fff',
          },
        }}
        data-testid="calendar-embedded"
      />
    </Card>
  );
}
