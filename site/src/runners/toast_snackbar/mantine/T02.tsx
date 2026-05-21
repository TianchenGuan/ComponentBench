'use client';

/**
 * toast_snackbar-mantine-T02: Show notification: Link copied
 *
 * setup_description:
 * Scene is an isolated card titled "Share". Two buttons are present: "Copy link" (target) and "Copy code" (distractor).
 * Clicking "Copy link" triggers `notifications.show` with message text exactly "Link copied". The notification has no title (message-only notification).
 * Clicking "Copy code" triggers a different notification message ("Code copied").
 *
 * success_trigger: A notification toast is visible with message/body text exactly "Link copied".
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, Button, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type { TaskComponentProps } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkNotification = () => {
      const notificationBody = document.querySelector('.mantine-Notification-body');
      if (notificationBody?.textContent?.includes('Link copied')) {
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

  const handleCopyLink = () => {
    notifications.show({
      message: 'Link copied',
      autoClose: 4000,
    });
  };

  const handleCopyCode = () => {
    notifications.show({
      message: 'Code copied',
      autoClose: 4000,
    });
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Share</Text>
      <Group>
        <Button onClick={handleCopyLink} data-testid="copy-link-btn">
          Copy link
        </Button>
        <Button variant="outline" onClick={handleCopyCode} data-testid="copy-code-btn">
          Copy code
        </Button>
      </Group>
    </Card>
  );
}
