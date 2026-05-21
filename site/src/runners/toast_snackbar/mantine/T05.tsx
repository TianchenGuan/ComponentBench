'use client';

/**
 * toast_snackbar-mantine-T05: Undo trash action from within a notification
 *
 * setup_description:
 * Scene is an isolated card titled "Files".
 * A Mantine notification is visible on load and is persistent (`autoClose: false`). It contains:
 * - Title: "File moved to Trash"
 * - Message text: "Budget.xlsx was moved to Trash."
 * - A small inline button labeled "Undo" inside the notification body (part of the message ReactNode).
 * Clicking "Undo" hides the current notification and immediately shows a success notification titled "Restored" with message "Budget.xlsx restored."
 *
 * success_trigger: A notification becomes visible with title exactly "Restored" and message "Budget.xlsx restored."
 */

import React, { useEffect, useRef } from 'react';
import { Card, Text, Button, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type { TaskComponentProps } from '../types';

const TRASH_NOTIFICATION_ID = 'file-trashed-notification';

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);

  // Check for success notification
  useEffect(() => {
    const checkNotification = () => {
      if (successCalledRef.current) return;
      const titles = Array.from(document.querySelectorAll('.mantine-Notification-title'));
      for (const titleEl of titles) {
        if (titleEl.textContent?.trim() === 'Restored') {
          const body = titleEl.closest('.mantine-Notification-root')
            ?.querySelector('.mantine-Notification-body');
          if (body?.textContent?.includes('Budget.xlsx restored.')) {
            successCalledRef.current = true;
            onSuccess();
            return;
          }
        }
      }
    };

    const observer = new MutationObserver(checkNotification);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => observer.disconnect();
  }, [onSuccess]);

  const handleUndo = () => {
    notifications.hide(TRASH_NOTIFICATION_ID);
    notifications.show({
      title: 'Restored',
      message: 'Budget.xlsx restored.',
      color: 'green',
      autoClose: 4000,
    });
  };

  // Show trash notification on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      notifications.show({
        id: TRASH_NOTIFICATION_ID,
        title: 'File moved to Trash',
        message: (
          <div>
            <Text size="sm">Budget.xlsx was moved to Trash.</Text>
            <Group mt="xs">
              <Button
                size="xs"
                variant="subtle"
                onClick={handleUndo}
                data-testid="toast-action-undo"
              >
                Undo
              </Button>
            </Group>
          </div>
        ),
        autoClose: false,
        withCloseButton: true,
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Files</Text>
      <Text size="sm" c="dimmed">
        Manage your files and folders here.
      </Text>
    </Card>
  );
}
