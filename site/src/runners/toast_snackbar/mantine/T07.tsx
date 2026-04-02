'use client';

/**
 * toast_snackbar-mantine-T07: Dismiss the Chat notification (two positions, disambiguation)
 *
 * setup_description:
 * Scene is an isolated card titled "Notifications demo".
 * Two Mantine notifications are visible at the same time, but they are rendered in different corners using per-notification `position`:
 * 1) **System** notification (top-right): Title "System • Maintenance", Message "Scheduled at 2:00 AM."
 * 2) **Chat** notification (bottom-right): Title "Chat • New message", Message "Ava: Are you free to talk?"  ← target
 * Both notifications have close buttons. The task requires closing only the Chat notification.
 *
 * success_trigger:
 * - The notification titled "Chat • New message" is not visible.
 * - The notification titled "System • Maintenance" remains visible.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type { TaskComponentProps } from '../types';

const SYSTEM_NOTIFICATION_ID = 'system-notification';
const CHAT_NOTIFICATION_ID = 'chat-notification';

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);
  const [systemVisible, setSystemVisible] = useState(true);
  const [chatVisible, setChatVisible] = useState(true);

  // Show both notifications on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      notifications.show({
        id: SYSTEM_NOTIFICATION_ID,
        title: 'System • Maintenance',
        message: 'Scheduled at 2:00 AM.',
        position: 'top-right',
        autoClose: false,
        withCloseButton: true,
        onClose: () => setSystemVisible(false),
      });

      setTimeout(() => {
        notifications.show({
          id: CHAT_NOTIFICATION_ID,
          title: 'Chat • New message',
          message: 'Ava: Are you free to talk?',
          position: 'bottom-right',
          autoClose: false,
          withCloseButton: true,
          onClose: () => setChatVisible(false),
        });
      }, 100);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Check success condition
  useEffect(() => {
    if (!chatVisible && systemVisible && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [systemVisible, chatVisible, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Notifications demo</Text>
      <Text size="sm" c="dimmed">
        Notifications can appear in different positions on the screen.
      </Text>
    </Card>
  );
}
