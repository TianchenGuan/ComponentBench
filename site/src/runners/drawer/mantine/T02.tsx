'use client';

/**
 * drawer-mantine-T02: Close Settings drawer with header X
 *
 * Layout: isolated_card centered with comfortable spacing.
 *
 * Initial state:
 * - A Mantine Drawer titled "Settings" is OPEN on page load.
 * - The drawer overlay is visible behind the panel.
 *
 * Close control:
 * - The drawer header includes an X icon button on the right side.
 * - Clicking the X closes the drawer.
 *
 * Drawer content:
 * - Simple read-only text blocks (no additional required actions).
 *
 * Feedback:
 * - Closing animates the drawer out and removes the overlay.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Text, Drawer, Stack } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(true); // Start open
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (!opened && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [opened, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={500} size="lg" mb="md">
        Application
      </Text>
      <Text size="sm" c="dimmed">
        Close the Settings drawer using the X button in the header.
      </Text>

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Settings"
        position="right"
        data-testid="drawer-settings"
      >
        <Stack gap="md">
          <Text size="sm">
            <Text span fw={500}>General:</Text> Configure your app preferences
          </Text>
          <Text size="sm">
            <Text span fw={500}>Notifications:</Text> Manage notification settings
          </Text>
          <Text size="sm">
            <Text span fw={500}>Privacy:</Text> Control your privacy options
          </Text>
        </Stack>
      </Drawer>
    </Card>
  );
}
