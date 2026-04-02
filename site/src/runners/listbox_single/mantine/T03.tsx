'use client';

/**
 * listbox_single-mantine-T03: Default view: reset to none
 *
 * Scene: light theme, comfortable spacing, isolated_card layout, placed at center of the viewport.
 * Component scale is default. Page contains 1 instance(s) of this listbox type; guidance is text; clutter is low.
 * A centered isolated card titled "Default view" contains a composite listbox made from Mantine NavLink rows:
 * "List", "Board", "Calendar", "Kanban". The "Kanban" row is initially active. Above the list is a subtle
 * Mantine Button labeled "Reset to none" that clears the active selection; when cleared, no NavLink row is
 * highlighted and a caption appears: "No default view selected". No other inputs are present.
 *
 * Success: Selected option value equals: null (no selection)
 */

import React, { useState } from 'react';
import { Card, Text, NavLink, Stack, Button, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const options = [
  { value: 'list', label: 'List' },
  { value: 'board', label: 'Board' },
  { value: 'calendar', label: 'Calendar' },
  { value: 'kanban', label: 'Kanban' },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string | null>('kanban');

  const handleSelect = (value: string) => {
    setSelected(value);
  };

  const handleReset = () => {
    setSelected(null);
    onSuccess();
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 360 }}>
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">Default view</Text>
        <Button variant="subtle" size="xs" onClick={handleReset}>
          Reset to none
        </Button>
      </Group>

      <Stack
        gap="xs"
        data-cb-listbox-root
        data-cb-selected-value={selected || 'null'}
        role="listbox"
      >
        {options.map(opt => (
          <NavLink
            key={opt.value}
            label={opt.label}
            active={selected === opt.value}
            onClick={() => handleSelect(opt.value)}
            data-cb-option-value={opt.value}
            role="option"
            aria-selected={selected === opt.value}
          />
        ))}
      </Stack>

      {selected === null && (
        <Text size="sm" c="dimmed" mt="md">
          No default view selected
        </Text>
      )}
    </Card>
  );
}
