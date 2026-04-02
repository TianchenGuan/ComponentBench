'use client';

/**
 * toast_snackbar-antd-T10: Dismiss the middle toast in a three-notification stack (similar titles)
 *
 * setup_description:
 * Scene is an isolated card titled "Backups". Global spacing is set to **compact**.
 * On page load, three persistent Ant Design **notifications** are already visible and stacked in the same corner. Each notification has a close (×) icon:
 * 1) Title: "Backup complete"
 * 2) Title: "Backup completed"  ← target
 * 3) Title: "Backup completion scheduled"
 * All three share a similar description ("Nightly backup status") to increase confusability. The user must dismiss only the exact-title match.
 *
 * success_trigger:
 * - The notification titled "Backup completed" is no longer visible.
 * - The notifications titled "Backup complete" and "Backup completion scheduled" remain visible.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Typography, notification } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [api, contextHolder] = notification.useNotification();
  const successCalledRef = useRef(false);
  const notificationsShownRef = useRef(false);
  const [notification1Visible, setNotification1Visible] = useState(true);
  const [notification2Visible, setNotification2Visible] = useState(true);
  const [notification3Visible, setNotification3Visible] = useState(true);

  // Show all three notifications on mount
  useEffect(() => {
    if (!notificationsShownRef.current) {
      notificationsShownRef.current = true;

      // Notification 1: "Backup complete"
      api.info({
        key: 'notification-1',
        message: <span data-testid="toast-title-1" data-toast-title="Backup complete">Backup complete</span>,
        description: <span data-testid="toast-text-1">Nightly backup status</span>,
        placement: 'topRight',
        duration: 0,
        onClose: () => setNotification1Visible(false),
      });

      // Notification 2: "Backup completed" (target)
      setTimeout(() => {
        api.info({
          key: 'notification-2',
          message: <span data-testid="toast-title-2" data-toast-title="Backup completed">Backup completed</span>,
          description: <span data-testid="toast-text-2">Nightly backup status</span>,
          placement: 'topRight',
          duration: 0,
          onClose: () => setNotification2Visible(false),
        });
      }, 100);

      // Notification 3: "Backup completion scheduled"
      setTimeout(() => {
        api.info({
          key: 'notification-3',
          message: <span data-testid="toast-title-3" data-toast-title="Backup completion scheduled">Backup completion scheduled</span>,
          description: <span data-testid="toast-text-3">Nightly backup status</span>,
          placement: 'topRight',
          duration: 0,
          onClose: () => setNotification3Visible(false),
        });
      }, 200);
    }
  }, [api]);

  // Check success condition: notification 2 ("Backup completed") dismissed, others still visible
  useEffect(() => {
    if (!notification2Visible && notification1Visible && notification3Visible && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [notification1Visible, notification2Visible, notification3Visible, onSuccess]);

  return (
    <>
      {contextHolder}
      <Card title="Backups" style={{ width: 400 }} size="small">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Text>Backup status dashboard</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Manage your scheduled and completed backups.
          </Text>
        </div>
      </Card>
    </>
  );
}
