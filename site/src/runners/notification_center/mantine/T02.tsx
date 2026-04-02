'use client';

/**
 * notification_center-mantine-T02: Switch to Unread tab
 *
 * setup_description:
 * Baseline isolated card centered in the viewport with an inline Notification Center (no drawer).
 * At the top are Mantine Tabs with labels: "All", "Unread", "Archived". Initial tab is "All".
 * 
 * The list below updates based on the active tab. Unread notifications have a dot indicator and bold title.
 * Switching to "Unread" should show only unread notifications.
 * 
 * Distractors: the card header also contains a "Refresh" button that reloads the list but does not change the active tab.
 * Feedback: the active tab indicator moves to "Unread" and list contents change instantly.
 *
 * success_trigger: The active Notification Center tab/view is 'Unread'.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Tabs, Text, Group, Button, Stack, Badge, Box } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import type { TaskComponentProps } from '../types';

const notifications = [
  { id: '1', title: 'New deployment', time: '5m ago', unread: true },
  { id: '2', title: 'Test passed', time: '15m ago', unread: false },
  { id: '3', title: 'PR approved', time: '30m ago', unread: true },
  { id: '4', title: 'Build completed', time: '1h ago', unread: false },
  { id: '5', title: 'Security scan', time: '2h ago', unread: true },
  { id: '6', title: 'Backup finished', time: '3h ago', unread: false },
];

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [activeTab, setActiveTab] = useState<string | null>('All');
  const successCalledRef = useRef(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    if (activeTab === 'Unread' && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [activeTab, onSuccess]);

  const filteredNotifications = activeTab === 'Unread'
    ? notifications.filter(n => n.unread)
    : activeTab === 'Archived'
    ? []
    : notifications;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <Text fw={500} size="lg">Notification Center</Text>
          <Badge color="blue">{unreadCount}</Badge>
        </Group>
        <Button variant="subtle" leftSection={<IconRefresh size={16} />} size="xs">
          Refresh
        </Button>
      </Group>

      <Tabs value={activeTab} onChange={setActiveTab} data-testid="notif-tabs">
        <Tabs.List>
          <Tabs.Tab value="All">All</Tabs.Tab>
          <Tabs.Tab value="Unread" data-testid="notif-tab-unread">Unread</Tabs.Tab>
          <Tabs.Tab value="Archived">Archived</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={activeTab || 'All'} pt="md">
          {filteredNotifications.length === 0 ? (
            <Text c="dimmed" ta="center" py="md">No notifications</Text>
          ) : (
            <Stack gap="xs">
              {filteredNotifications.map((notif) => (
                <Box
                  key={notif.id}
                  p="xs"
                  style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}
                >
                  <Group gap="xs">
                    {notif.unread && (
                      <Box
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: 'var(--mantine-color-blue-6)',
                        }}
                      />
                    )}
                    <div>
                      <Text fw={notif.unread ? 600 : 400} size="sm">{notif.title}</Text>
                      <Text c="dimmed" size="xs">{notif.time}</Text>
                    </div>
                  </Group>
                </Box>
              ))}
            </Stack>
          )}
        </Tabs.Panel>
      </Tabs>
    </Card>
  );
}
