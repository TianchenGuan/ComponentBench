'use client';

/**
 * notification_center-mantine-T05: Hide read notifications
 *
 * setup_description:
 * Compact spacing mode is enabled (dense controls and list).
 * The Notification Center is an inline card with a small settings strip at the top.
 * 
 * In the settings strip there is a switch labeled "Show read notifications".
 * Initial state: switch is ON, so both read and unread notifications are visible in the list.
 * 
 * The task is to turn the switch OFF.
 * Distractors: another switch labeled "Play sound" is next to it; it must not be changed.
 * Feedback: after turning off, read notifications disappear from the list; the switch visibly changes to the off position immediately.
 *
 * success_trigger: Notification Center setting 'show_read' is disabled.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Switch, Group, Stack, Box } from '@mantine/core';
import type { TaskComponentProps } from '../types';

const notifications = [
  { id: '1', title: 'New alert', read: false },
  { id: '2', title: 'System update', read: true },
  { id: '3', title: 'Task completed', read: false },
  { id: '4', title: 'Backup finished', read: true },
  { id: '5', title: 'Report generated', read: true },
  { id: '6', title: 'Meeting reminder', read: false },
];

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [showRead, setShowRead] = useState(true);
  const [playSound, setPlaySound] = useState(true);
  const successCalledRef = useRef(false);

  useEffect(() => {
    if (!showRead && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [showRead, onSuccess]);

  const visibleNotifications = showRead
    ? notifications
    : notifications.filter(n => !n.read);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="sm">Notification Center</Text>

      {/* Settings strip */}
      <Group
        gap="md"
        mb="md"
        p="xs"
        style={{
          backgroundColor: 'var(--mantine-color-gray-0)',
          borderRadius: 4,
        }}
      >
        <Switch
          label="Show read notifications"
          checked={showRead}
          onChange={(e) => setShowRead(e.currentTarget.checked)}
          size="sm"
          data-testid="show-read-switch"
        />
        <Switch
          label="Play sound"
          checked={playSound}
          onChange={(e) => setPlaySound(e.currentTarget.checked)}
          size="sm"
          data-testid="play-sound-switch"
        />
      </Group>

      <Stack gap={4}>
        {visibleNotifications.length === 0 ? (
          <Text c="dimmed" ta="center" py="md" size="sm">No notifications to show</Text>
        ) : (
          visibleNotifications.map((notif) => (
            <Box
              key={notif.id}
              p={6}
              style={{ borderBottom: '1px solid var(--mantine-color-gray-2)' }}
            >
              <Group gap={6}>
                {!notif.read && (
                  <Box
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: 'var(--mantine-color-blue-6)',
                    }}
                  />
                )}
                <Text fw={notif.read ? 400 : 600} size="sm">{notif.title}</Text>
              </Group>
            </Box>
          ))
        )}
      </Stack>
    </Card>
  );
}
