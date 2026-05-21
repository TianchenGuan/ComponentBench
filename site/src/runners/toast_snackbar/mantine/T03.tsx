'use client';

/**
 * toast_snackbar-mantine-T03: Show notification: Export started
 *
 * setup_description:
 * Scene is an isolated card titled "Export". It contains one button labeled "Start export".
 * Clicking the button triggers `notifications.show` (default position) with:
 * - Title: "Export started"
 * - Message: "Preparing your file…"
 * The toast includes a close button and auto-closes after a normal duration.
 *
 * success_trigger: A notification toast is visible with title exactly "Export started".
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type { TaskComponentProps } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkNotification = () => {
      const notificationTitle = document.querySelector('.mantine-Notification-title');
      if (notificationTitle?.textContent === 'Export started') {
        if (!successCalledRef.current) {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkNotification);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => observer.disconnect();
  }, [onSuccess]);

  const handleStartExport = () => {
    notifications.show({
      title: 'Export started',
      message: 'Preparing your file…',
      autoClose: 4000,
    });
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Export</Text>
      <Button onClick={handleStartExport} data-testid="start-export-btn">
        Start export
      </Button>
    </Card>
  );
}
