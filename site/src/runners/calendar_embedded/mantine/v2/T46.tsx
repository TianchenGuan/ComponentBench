'use client';

/**
 * calendar_embedded-mantine-v2-T46: Planning sidebar scroll, level change, Save planning date
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Button, Badge, Group, Stack, Box } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import dayjs from 'dayjs';
import type { TaskComponentProps } from '../../types';

const TARGET = '2035-11-23';

export default function T46({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<Date | null>(null);
  const [saved, setSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (saved && dayjs(saved).format('YYYY-MM-DD') === TARGET) {
      onSuccess();
    }
  }, [saved, onSuccess]);

  return (
    <Box
      component="aside"
      w={320}
      mih={200}
      mah={420}
      style={{ overflowY: 'auto', border: '1px solid var(--mantine-color-gray-3)', borderRadius: 8, padding: 12 }}
      data-testid="planning-sidebar"
    >
      <Text size="sm" c="dimmed" mb="sm">
        Planning notes: align roadmap milestones with dependency locks. Filters below narrow visible initiatives; scroll to
        reach the calendar when the sidebar content overflows.
      </Text>
      <Group gap="xs" mb="md">
        <Badge size="sm" variant="light">
          Roadmap
        </Badge>
        <Badge size="sm" variant="outline">
          Dependencies
        </Badge>
        <Badge size="sm" variant="light" color="gray">
          Locked
        </Badge>
      </Group>
      <Card padding="sm" radius="md" withBorder mb="md">
        <Text fw={600} size="sm" mb="xs">
          Planning calendar
        </Text>
        <Calendar
          defaultDate={new Date(2026, 1, 1)}
          maxLevel="decade"
          minLevel="month"
          size="sm"
          getDayProps={(date) => ({
            selected: selected ? dayjs(date).isSame(selected, 'day') : false,
            onClick: () => setSelected(date),
          })}
          data-testid="calendar-embedded"
        />
      </Card>
      <Button size="xs" onClick={() => setSaved(selected)} data-testid="save-planning-date">
        Save planning date
      </Button>
      <Text size="xs" c="dimmed" mt="xs" data-testid="saved-planning-readout">
        Saved: {saved ? dayjs(saved).format('YYYY-MM-DD') : '—'}
      </Text>
    </Box>
  );
}
