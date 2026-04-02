'use client';

/**
 * notification_center-mantine-T01: Open notification center drawer
 *
 * setup_description:
 * Baseline isolated card centered in the viewport. The Notification Center launcher is a Mantine ActionIcon with a bell glyph.
 * The bell is wrapped in a Mantine Indicator showing an unread count of 4.
 * 
 * Clicking the bell opens a right-side Mantine Drawer titled "Notification Center".
 * Inside the drawer is a ScrollArea with Notification-styled rows (title, message preview, timestamp).
 * For this task, only opening the drawer is required.
 * 
 * Distractors: a second ActionIcon (gear) opens a settings drawer unrelated to notifications.
 * Feedback: drawer open state is immediate; no additional confirmation.
 *
 * success_trigger: The Notification Center drawer for the only instance is open.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, ActionIcon, Indicator, Drawer, Text, Group, Stack, ScrollArea } from '@mantine/core';
import { IconBell, IconSettings } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const notifications = [
  { id: '1', title: 'New feature available', message: 'Check out the new dashboard widgets', time: '2m ago' },
  { id: '2', title: 'System maintenance', message: 'Scheduled for tonight at 2 AM', time: '15m ago' },
  { id: '3', title: 'Task completed', message: 'Your export is ready for download', time: '1h ago' },
  { id: '4', title: 'Welcome!', message: 'Thanks for joining our platform', time: '2h ago' },
];

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (drawerOpen && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [drawerOpen, onSuccess]);

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
        <Group justify="space-between" mb="md">
          <Text fw={500} size="lg">Dashboard</Text>
          <Group gap="xs">
            <ActionIcon
              variant="subtle"
              onClick={() => setSettingsDrawerOpen(true)}
              aria-label="Settings"
              data-testid="settings-btn"
            >
              <IconSettings size={20} />
            </ActionIcon>
            <Indicator label={4} size={16} color="blue">
              <ActionIcon
                variant="subtle"
                onClick={() => setDrawerOpen(true)}
                aria-label="Notifications"
                data-testid="notif-bell-primary"
              >
                <IconBell size={20} />
              </ActionIcon>
            </Indicator>
          </Group>
        </Group>
        <Text c="dimmed" ta="center" py="xl">
          Your dashboard content goes here
        </Text>
      </Card>

      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Notification Center"
        position="right"
        size="md"
        data-testid="notif-drawer-primary"
      >
        <ScrollArea h="calc(100vh - 100px)">
          <Stack gap="sm">
            {notifications.map((notif) => (
              <Card key={notif.id} shadow="xs" padding="sm" radius="sm" withBorder>
                <Text fw={500} size="sm">{notif.title}</Text>
                <Text c="dimmed" size="xs" lineClamp={2}>{notif.message}</Text>
                <Text c="dimmed" size="xs" mt={4}>{notif.time}</Text>
              </Card>
            ))}
          </Stack>
        </ScrollArea>
      </Drawer>

      <Drawer
        opened={settingsDrawerOpen}
        onClose={() => setSettingsDrawerOpen(false)}
        title="Settings"
        position="right"
        size="sm"
      >
        <Text c="dimmed">Settings panel content</Text>
      </Drawer>
    </>
  );
}
