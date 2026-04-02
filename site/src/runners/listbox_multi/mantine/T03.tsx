'use client';

/**
 * listbox_multi-mantine-T03: Clear selected interests
 *
 * Layout: isolated_card centered titled "Interests".
 * Target component: Mantine Checkbox.Group labeled "Interests" with 10 options.
 * Initial state: Music, Travel, and Tech are preselected.
 * A small button labeled "Reset" appears at the bottom of the card.
 * No overlays and no scrolling.
 * Feedback: after reset, all checkmarks clear and the "Current value" text becomes "–".
 *
 * Success: The target listbox has no selected items (all options are unchecked).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Checkbox, Stack, Button, Group } from '@mantine/core';
import type { TaskComponentProps } from '../types';
import { setsEqual } from '../types';

const options = ['Art', 'Music', 'Travel', 'Sports', 'Cooking', 'Reading', 'Gaming', 'Photography', 'Fitness', 'Tech'];
const targetSet: string[] = [];
const initialSelected = ['Music', 'Travel', 'Tech'];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected);
  const successFired = useRef(false);

  useEffect(() => {
    if (!successFired.current && setsEqual(selected, targetSet)) {
      successFired.current = true;
      onSuccess();
    }
  }, [selected, onSuccess]);

  const handleReset = () => {
    setSelected([]);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="xs">
        Interests
      </Text>
      <Text size="sm" c="dimmed" mb="md">
        Interests (you can reset).
      </Text>
      <Checkbox.Group
        data-testid="listbox-interests"
        value={selected}
        onChange={setSelected}
      >
        <Stack gap="xs">
          {options.map((opt) => (
            <Checkbox key={opt} value={opt} label={opt} />
          ))}
        </Stack>
      </Checkbox.Group>
      <Group justify="space-between" mt="md">
        <Text size="sm" c="dimmed">
          Current value: {selected.join(', ') || '–'}
        </Text>
        <Button variant="subtle" size="xs" onClick={handleReset}>
          Reset
        </Button>
      </Group>
    </Card>
  );
}
