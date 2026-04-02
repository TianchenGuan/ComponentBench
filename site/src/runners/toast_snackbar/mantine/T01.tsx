'use client';

/**
 * toast_snackbar-mantine-T01: Show notification: Draft saved
 *
 * setup_description:
 * Scene is an isolated card titled "Editor". The card contains one button labeled "Show notification".
 * Clicking the button calls `notifications.show(...)` from **@mantine/notifications**. A notification toast appears (default container position) with:
 * - Title: "Draft saved"
 * - Message: "Your changes were saved locally."
 * The notification auto-closes after a normal duration and includes a close button, but no interaction with the toast is required for success.
 *
 * success_trigger: A toast/notification is visible with title exactly "Draft saved" and message "Your changes were saved locally."
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkNotification = () => {
      const notificationTitle = document.querySelector('.mantine-Notification-title');
      const notificationBody = document.querySelector('.mantine-Notification-body');
      if (
        notificationTitle?.textContent === 'Draft saved' &&
        notificationBody?.textContent?.includes('Your changes were saved locally.')
      ) {
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

  const handleShowNotification = () => {
    notifications.show({
      title: 'Draft saved',
      message: 'Your changes were saved locally.',
      autoClose: 4000,
    });
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Editor</Text>
      <Button onClick={handleShowNotification} data-testid="show-notification-btn">
        Show notification
      </Button>
    </Card>
  );
}
