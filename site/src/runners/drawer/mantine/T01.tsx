'use client';

/**
 * drawer-mantine-T01: Open Settings drawer
 *
 * Layout: isolated_card centered with comfortable spacing.
 *
 * On the card:
 * - A Mantine Button labeled "Open settings".
 *
 * Target component: Mantine Drawer.
 * - Initial state: CLOSED.
 * - When opened, it slides in from the right and shows the title "Settings" in the header.
 * - An overlay dims the rest of the page; a close (X) button is present in the header.
 *
 * Drawer contents (not required for success):
 * - A short list of settings descriptions rendered as plain text.
 *
 * Feedback:
 * - Drawer opening animation and overlay make the open state clear.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Text, Drawer, Stack } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
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
        Application
      </Text>
      <Button
        onClick={() => setOpened(true)}
        data-testid="open-settings-drawer"
      >
        Open settings
      </Button>

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
          <Text size="sm">
            <Text span fw={500}>Account:</Text> Update account information
          </Text>
        </Stack>
      </Drawer>
    </Card>
  );
}
