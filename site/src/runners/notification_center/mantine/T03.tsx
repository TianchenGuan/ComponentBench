'use client';

/**
 * notification_center-mantine-T03: Mark all notifications as read
 *
 * setup_description:
 * Baseline isolated card centered in the viewport with an inline Notification Center.
 * The header shows an unread count indicator (3) and includes a button labeled "Mark all as read".
 * 
 * Initial state:
 *   - 3 notifications are unread (dot indicator + bold title).
 *   - Remaining notifications are already read.
 * 
 * Clicking "Mark all as read" updates all unread items to read in one action.
 * Distractors: a nearby "Mark visible as read" button exists but is disabled in this task; do not use it.
 * Feedback: unread dots disappear, titles stop being bold, and the unread indicator becomes 0.
 *
 * success_trigger: Unread count in the Notification Center is 0.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Group, Button, Stack, Badge, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

interface Notification {
  id: string;
  title: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: '1', title: 'New message', time: '5m ago', read: false },
  { id: '2', title: 'System update', time: '15m ago', read: false },
  { id: '3', title: 'Task assigned', time: '30m ago', read: false },
  { id: '4', title: 'Backup complete', time: '1h ago', read: true },
  { id: '5', title: 'Report ready', time: '2h ago', read: true },
];

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const successCalledRef = useRef(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (unreadCount === 0 && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [unreadCount, onSuccess]);

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 500 }}>
      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <Text fw={500} size="lg">Notification Center</Text>
          <Badge color="blue">{unreadCount}</Badge>
        </Group>
        <Group gap="xs">
          <Button
            variant="light"
            size="xs"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            data-testid="mark-all-read"
          >
            Mark all as read
          </Button>
          <Button variant="subtle" size="xs" disabled>
            Mark visible as read
          </Button>
        </Group>
      </Group>

      <Stack gap="xs">
        {notifications.map((notif) => (
          <Box
            key={notif.id}
            p="xs"
            style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}
            data-notif-id={notif.id}
            data-read={notif.read}
          >
            <Group gap="xs">
              {!notif.read && (
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
                <Text fw={notif.read ? 400 : 600} size="sm">{notif.title}</Text>
                <Text c="dimmed" size="xs">{notif.time}</Text>
              </div>
            </Group>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}
