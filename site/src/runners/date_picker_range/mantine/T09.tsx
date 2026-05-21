'use client';

/**
 * date_picker_range-mantine-T09: Match a highlighted reference range (visual)
 *
 * An isolated card centered in the viewport with two elements:
 * 1) A 'Reference B' mini-calendar for March 2026 that highlights a contiguous
 *    date range using a colored background band. The reference card intentionally does
 *    not print the start/end as text; the only cue is the highlight on the mini-calendar.
 * 2) A Mantine DatePickerInput (type='range') labeled 'Selected window', initially empty.
 * The agent must visually read the highlighted start and end days from the reference
 * mini-calendar and then select the same range in the DatePickerInput.
 *
 * Success: Start date = 2026-03-07, End date = 2026-03-12
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Box, Grid, SimpleGrid } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../types';

// Simple mini-calendar component showing March 2026 with highlight
function MiniCalendar() {
  // March 2026 starts on Sunday (day 0)
  // We need to show the days with 7-12 highlighted
  const daysInMonth = 31;
  const firstDayOfWeek = 0; // Sunday
  
  const days = [];
  // Empty cells for days before the 1st
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(<Box key={`empty-${i}`} style={{ width: 24, height: 24 }} />);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const isHighlighted = day >= 7 && day <= 12;
    days.push(
      <Box
        key={day}
        style={{
          width: 24,
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          background: isHighlighted ? '#228be6' : 'transparent',
          color: isHighlighted ? '#fff' : '#333',
          borderRadius: day === 7 ? '4px 0 0 4px' : day === 12 ? '0 4px 4px 0' : 0,
        }}
      >
        {day}
      </Box>
    );
  }

  return (
    <Box>
      <Text size="xs" fw={500} mb={4} ta="center">March 2026</Text>
      <SimpleGrid cols={7} spacing={0}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <Box key={i} style={{ width: 24, height: 20, textAlign: 'center', fontSize: 10, color: '#999' }}>
            {d}
          </Box>
        ))}
        {days}
      </SimpleGrid>
    </Box>
  );
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);

  useEffect(() => {
    if (
      value[0] &&
      value[1] &&
      dayjs(value[0]).format('YYYY-MM-DD') === '2026-03-07' &&
      dayjs(value[1]).format('YYYY-MM-DD') === '2026-03-12'
    ) {
      onSuccess();
    }
  }, [value, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 600 }}>
      <Text fw={600} size="lg" mb="md">Match the highlighted reference</Text>
      
      <Grid>
        {/* Reference card */}
        <Grid.Col span={5}>
          <Box
            p="md"
            style={{
              border: '2px solid #228be6',
              borderRadius: 8,
              background: '#e7f5ff',
            }}
            data-testid="reference-b-card"
          >
            <Text size="sm" fw={500} c="blue" mb="sm">Reference B (highlighted)</Text>
            <MiniCalendar />
            <Text size="xs" c="dimmed" mt="sm" ta="center">
              Match the blue highlighted range
            </Text>
          </Box>
        </Grid.Col>

        {/* Picker */}
        <Grid.Col span={7}>
          <Box>
            <Text component="label" fw={500} size="sm" mb={4} style={{ display: 'block' }}>
              Selected window
            </Text>
            <DatePickerInput
              type="range"
              value={value}
              onChange={setValue}
              valueFormat="YYYY-MM-DD"
              placeholder="Pick dates range"
              defaultDate={new Date(2026, 2, 1)} // March 2026
              data-testid="selected-window-range"
            />
          </Box>
        </Grid.Col>
      </Grid>
    </Card>
  );
}
