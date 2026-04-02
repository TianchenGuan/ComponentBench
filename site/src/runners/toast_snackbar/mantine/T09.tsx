'use client';

/**
 * toast_snackbar-mantine-T09: Dismiss one of three similar sync notifications (dark, compact)
 *
 * setup_description:
 * Scene is an isolated card titled "Sync status" rendered in **dark theme**, with **compact spacing** and **small scale**.
 * Three persistent Mantine notifications are visible at load and stacked in the same corner. Each has a close button:
 * 1) Title: "Sync failed"  ← target
 * 2) Title: "Sync failure"
 * 3) Title: "Sync failed (retrying)"
 * All three share the same body text "Background sync status." to increase confusability. Only the exact-title "Sync failed" should be dismissed.
 *
 * success_trigger:
 * - The notification titled "Sync failed" is not visible.
 * - The notifications titled "Sync failure" and "Sync failed (retrying)" remain visible.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type { TaskComponentProps } from '../types';

const NOTIFICATION_1_ID = 'sync-failed-notification';
const NOTIFICATION_2_ID = 'sync-failure-notification';
const NOTIFICATION_3_ID = 'sync-failed-retrying-notification';

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const successCalledRef = useRef(false);
  const [notification1Visible, setNotification1Visible] = useState(true);
  const [notification2Visible, setNotification2Visible] = useState(true);
  const [notification3Visible, setNotification3Visible] = useState(true);

  // Show all three notifications on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      notifications.show({
        id: NOTIFICATION_1_ID,
        title: 'Sync failed',
        message: 'Background sync status.',
        color: 'red',
        position: 'top-left',
        autoClose: false,
        withCloseButton: true,
        onClose: () => setNotification1Visible(false),
      });

      setTimeout(() => {
        notifications.show({
          id: NOTIFICATION_2_ID,
          title: 'Sync failure',
          message: 'Background sync status.',
          color: 'red',
          position: 'top-left',
          autoClose: false,
          withCloseButton: true,
          onClose: () => setNotification2Visible(false),
        });
      }, 100);

      setTimeout(() => {
        notifications.show({
          id: NOTIFICATION_3_ID,
          title: 'Sync failed (retrying)',
          message: 'Background sync status.',
          color: 'red',
          position: 'top-left',
          autoClose: false,
          withCloseButton: true,
          onClose: () => setNotification3Visible(false),
        });
      }, 200);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Check success condition
  useEffect(() => {
    if (!notification1Visible && notification2Visible && notification3Visible && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [notification1Visible, notification2Visible, notification3Visible, onSuccess]);

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={600} size="md" mb="xs">Sync status</Text>
      <Text size="sm" c="dimmed">
        Monitoring synchronization across all connected services.
      </Text>
    </Card>
  );
}
