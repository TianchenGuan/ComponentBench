'use client';

/**
 * toggle_button_group_multi-mantine-T23: Select recurring meeting days
 *
 * Layout: isolated_card centered in the viewport.
 *
 * A single card titled "Meeting days" contains a Mantine Chip.Group with 
 * multiple selection enabled.
 *
 * Chips:
 * - Monday
 * - Tuesday
 * - Wednesday
 * - Thursday
 * - Friday
 *
 * Initial state:
 * - Thursday is selected.
 * - All other days are unselected.
 *
 * No Apply/Save button; changes apply instantly.
 *
 * Success: Selected options equal exactly: Tuesday, Thursday
 */

import React, { useState, useEffect } from 'react';
import { Card, Text, Chip, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TARGET_SET = new Set(['Tuesday', 'Thursday']);

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(['Thursday']);

  useEffect(() => {
    const currentSet = new Set(selected);
    if (currentSet.size === TARGET_SET.size && 
        Array.from(TARGET_SET).every(v => currentSet.has(v))) {
      onSuccess();
    }
  }, [selected, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 450 }}>
      <Text fw={500} size="lg" mb="sm">Meeting days</Text>
      <Text size="sm" c="dimmed" mb="md">
        Select Tuesday and Thursday.
      </Text>

      <Chip.Group multiple value={selected} onChange={setSelected} data-testid="meeting-days-group">
        <Group gap="sm">
          {DAYS.map(day => (
            <Chip key={day} value={day} data-testid={`day-${day.toLowerCase()}`}>
              {day}
            </Chip>
          ))}
        </Group>
      </Chip.Group>
    </Card>
  );
}
