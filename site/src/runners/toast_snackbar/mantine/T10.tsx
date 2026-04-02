'use client';

/**
 * toast_snackbar-mantine-T10: Clear all notifications using an in-toast action button
 *
 * setup_description:
 * Scene is an isolated card titled "Alert center".
 * Four persistent Mantine notifications are visible at load (instances=4). They are stacked in one corner:
 * 1) Title: "Too many alerts" (target) — contains a prominent button labeled "Clear all" and a smaller button labeled "Dismiss only this" (distractor).
 * 2) Title: "CPU usage high"
 * 3) Title: "New login detected"
 * 4) Title: "Backup overdue"
 * Clicking "Clear all" inside the "Too many alerts" notification calls `notifications.clean()` and removes all notifications from the screen.
 *
 * success_trigger: All notification toasts are dismissed (no notifications visible).
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Text, Button, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type { TaskComponentProps } from '../types';

const ALERT_NOTIFICATION_ID = 'too-many-alerts';
const CPU_NOTIFICATION_ID = 'cpu-usage';
const LOGIN_NOTIFICATION_ID = 'new-login';
const BACKUP_NOTIFICATION_ID = 'backup-overdue';

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);
  const [allCleared, setAllCleared] = useState(false);

  const handleClearAll = () => {
    notifications.clean();
    setAllCleared(true);
  };

  const handleDismissOnlyThis = () => {
    notifications.hide(ALERT_NOTIFICATION_ID);
  };

  // Show all four notifications on mount
  useEffect(() => {
    const timer = setTimeout(() => {
        // Notification 1: "Too many alerts" (target with actions)
        notifications.show({
          id: ALERT_NOTIFICATION_ID,
          title: 'Too many alerts',
          message: (
            <div>
              <Text size="sm" mb="xs">You have multiple pending alerts.</Text>
              <Group gap="xs">
                <Button
                  size="xs"
                  onClick={handleClearAll}
                  data-testid="toast-action-clear-all"
                >
                  Clear all
                </Button>
                <Button
                  size="xs"
                  variant="subtle"
                  onClick={handleDismissOnlyThis}
                  data-testid="toast-action-dismiss-this"
                >
                  Dismiss only this
                </Button>
              </Group>
            </div>
          ),
          position: 'top-right',
          autoClose: false,
          withCloseButton: true,
          color: 'orange',
        });

        // Notification 2: "CPU usage high"
        setTimeout(() => {
          notifications.show({
            id: CPU_NOTIFICATION_ID,
            title: 'CPU usage high',
            message: 'Server load at 95%',
            position: 'top-right',
            autoClose: false,
            withCloseButton: true,
            color: 'red',
          });
        }, 100);

        // Notification 3: "New login detected"
        setTimeout(() => {
          notifications.show({
            id: LOGIN_NOTIFICATION_ID,
            title: 'New login detected',
            message: 'From unknown device',
            position: 'top-right',
            autoClose: false,
            withCloseButton: true,
            color: 'yellow',
          });
        }, 200);

        // Notification 4: "Backup overdue"
        setTimeout(() => {
          notifications.show({
            id: BACKUP_NOTIFICATION_ID,
            title: 'Backup overdue',
            message: 'Last backup was 7 days ago',
            position: 'top-right',
            autoClose: false,
            withCloseButton: true,
            color: 'blue',
          });
        }, 300);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Check success condition
  useEffect(() => {
    if (allCleared && !successCalledRef.current) {
      // Small delay to ensure notifications are actually removed from DOM
      setTimeout(() => {
        const remainingNotifications = document.querySelectorAll('.mantine-Notification-root');
        if (remainingNotifications.length === 0 && !successCalledRef.current) {
          successCalledRef.current = true;
          onSuccess();
        }
      }, 300);
    }
  }, [allCleared, onSuccess]);

  // Also monitor DOM for all notifications being removed
  useEffect(() => {
    const checkAllDismissed = () => {
      const remainingNotifications = document.querySelectorAll('.mantine-Notification-root');
      if (remainingNotifications.length === 0 && !successCalledRef.current) {
        successCalledRef.current = true;
        onSuccess();
      }
    };

    // Delay observer to allow initial notifications to appear
    const timeout = setTimeout(() => {
      const observer = new MutationObserver(checkAllDismissed);
      observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    }, 500);

    return () => clearTimeout(timeout);
  }, [onSuccess]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={600} size="lg" mb="md">Alert center</Text>
      <Text size="sm" c="dimmed">
        Manage system alerts and notifications from this dashboard.
      </Text>
    </Card>
  );
}
