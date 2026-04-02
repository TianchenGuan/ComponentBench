'use client';

/**
 * drawer-mantine-T04: Open a top-position drawer in dark theme
 *
 * Theme: DARK mode. Layout: isolated_card anchored to the top-left of the viewport (not centered) with comfortable spacing.
 *
 * On the card:
 * - A Mantine Button labeled "Open shortcuts".
 *
 * Target component: Mantine Drawer configured with position="top".
 * - Initial state: CLOSED.
 * - When opened, it slides down from the top edge and shows the title "Shortcuts".
 * - An overlay dims the rest of the page; the header includes a close (X) button.
 *
 * Distractors:
 * - A second button labeled "Open help" is disabled (visual distractor only).
 *
 * Feedback:
 * - The top-down slide animation and overlay indicate the drawer is open.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Text, Drawer, Stack, Group, Kbd } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (opened && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [opened, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={500} size="lg" mb="md">
        Quick Actions
      </Text>
      <Group>
        <Button onClick={() => setOpened(true)} data-testid="open-shortcuts">
          Open shortcuts
        </Button>
        <Button disabled>Open help</Button>
      </Group>

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Shortcuts"
        position="top"
        size="sm"
        data-testid="drawer-shortcuts"
      >
        <Stack gap="sm">
          <Group justify="space-between">
            <Text size="sm">Save</Text>
            <Group gap={4}>
              <Kbd>Ctrl</Kbd>+<Kbd>S</Kbd>
            </Group>
          </Group>
          <Group justify="space-between">
            <Text size="sm">Copy</Text>
            <Group gap={4}>
              <Kbd>Ctrl</Kbd>+<Kbd>C</Kbd>
            </Group>
          </Group>
          <Group justify="space-between">
            <Text size="sm">Paste</Text>
            <Group gap={4}>
              <Kbd>Ctrl</Kbd>+<Kbd>V</Kbd>
            </Group>
          </Group>
          <Group justify="space-between">
            <Text size="sm">Undo</Text>
            <Group gap={4}>
              <Kbd>Ctrl</Kbd>+<Kbd>Z</Kbd>
            </Group>
          </Group>
        </Stack>
      </Drawer>
    </Card>
  );
}
