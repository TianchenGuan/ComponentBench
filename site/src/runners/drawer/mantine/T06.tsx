'use client';

/**
 * drawer-mantine-T06: Close a compact-spacing drawer via header close button
 *
 * Layout: isolated_card centered, but with COMPACT spacing (reduced padding and tighter spacing).
 *
 * Initial state:
 * - A Mantine Drawer titled "Account" is OPEN on page load.
 * - The overlay behind the drawer is visible.
 *
 * Target component configuration:
 * - closeOnClickOutside = false (clicking the overlay does NOT close the drawer).
 * - closeOnEscape = true (Escape could close, but the prompt asks for the header close button).
 * - Header includes a small close (X) button on the right.
 *
 * Drawer contents:
 * - A compact list of account options as read-only text (not required).
 *
 * Feedback:
 * - Clicking the close icon closes the drawer and removes the overlay.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Text, Drawer, Stack } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [opened, setOpened] = useState(true); // Start open
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (!opened && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [opened, onSuccess]);

  return (
    <Card shadow="sm" padding="sm" radius="md" withBorder style={{ width: 300 }}>
      <Text fw={500} size="sm" mb="xs">
        User Settings
      </Text>
      <Text size="xs" c="dimmed">
        Close the drawer using the X button in the header.
      </Text>

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="Account"
        position="right"
        closeOnClickOutside={false}
        closeOnEscape={true}
        size="sm"
        data-testid="drawer-account"
      >
        <Stack gap="xs">
          <Text size="sm">Profile Information</Text>
          <Text size="sm">Security Settings</Text>
          <Text size="sm">Notification Preferences</Text>
          <Text size="sm">Connected Apps</Text>
          <Text size="sm">Data & Privacy</Text>
        </Stack>
      </Drawer>
    </Card>
  );
}
