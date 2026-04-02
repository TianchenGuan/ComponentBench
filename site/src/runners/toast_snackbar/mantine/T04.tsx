'use client';

/**
 * toast_snackbar-mantine-T04: Dismiss persistent notification: Offline mode enabled
 *
 * setup_description:
 * Scene is an isolated card titled "Connectivity".
 * A Mantine notification is visible on load. It is configured with `autoClose: false` (persistent) and `withCloseButton: true`.
 * - Title: "Offline mode enabled"
 * - Message: "Some features are unavailable."
 * The close button is a small icon button within the toast. No other notifications are visible.
 *
 * success_trigger: The notification titled "Offline mode enabled" is no longer visible.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type { TaskComponentProps } from '../types';

const NOTIFICATION_ID = 'offline-mode-notification';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);
  const [wasShown, setWasShown] = useState(false);

  // Show persistent notification on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      notifications.show({
        id: NOTIFICATION_ID,
        title: 'Offline mode enabled',
        message: 'Some features are unavailable.',
        autoClose: false,
        withCloseButton: true,
        onClose: () => {
          if (!successCalledRef.current) {
            successCalledRef.current = true;
            onSuccess();
          }
        },
      });
      setWasShown(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [onSuccess]);

  // Also monitor DOM for notification removal
  useEffect(() => {
    if (!wasShown) return;

    const checkDismissed = () => {
      const notificationTitle = document.querySelector('.mantine-Notification-title');
      if (!notificationTitle || notificationTitle.textContent !== 'Offline mode enabled') {
        if (!successCalledRef.current) {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkDismissed);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => observer.disconnect();
  }, [wasShown, onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Connectivity</Text>
      <Text size="sm" c="dimmed">
        Your connection status is monitored automatically.
      </Text>
    </Card>
  );
}
