'use client';

/**
 * toast_snackbar-antd-T05: Dismiss persistent notification: Sync paused
 *
 * setup_description:
 * Scene is an isolated card titled "Sync status". The main content of the card is informational and does not affect success.
 * On initial load, an Ant Design **notification** is already visible (configured as persistent with duration disabled). It has:
 * - Title: "Sync paused"
 * - Description: "Reconnect to continue syncing."
 * - A small close (×) icon in the notification header.
 * No other notifications are shown.
 *
 * success_trigger: The notification with title "Sync paused" is no longer visible (dismissed).
 */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Typography, notification } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [api, contextHolder] = notification.useNotification();
  const successCalledRef = useRef(false);
  const notificationShownRef = useRef(false);
  const [notificationVisible, setNotificationVisible] = useState(true);

  // Show persistent notification on mount
  useEffect(() => {
    if (!notificationShownRef.current) {
      notificationShownRef.current = true;
      api.warning({
        key: 'sync-paused',
        message: <span data-testid="toast-title">Sync paused</span>,
        description: <span data-testid="toast-text">Reconnect to continue syncing.</span>,
        placement: 'topRight',
        duration: 0, // persistent
        onClose: () => {
          setNotificationVisible(false);
        },
      });
    }
  }, [api]);

  // Check if notification was dismissed
  useEffect(() => {
    if (!notificationVisible && !successCalledRef.current) {
      successCalledRef.current = true;
      onSuccess();
    }
  }, [notificationVisible, onSuccess]);

  // Also watch DOM for notification removal
  useEffect(() => {
    const checkDismissed = () => {
      const notificationTitle = document.querySelector('.ant-notification-notice-message');
      if (!notificationTitle || notificationTitle.textContent !== 'Sync paused') {
        if (notificationShownRef.current && !successCalledRef.current) {
          // Small delay to ensure it was truly dismissed
          setTimeout(() => {
            const stillExists = document.querySelector('.ant-notification-notice-message');
            if (!stillExists || stillExists.textContent !== 'Sync paused') {
              if (!successCalledRef.current) {
                successCalledRef.current = true;
                onSuccess();
              }
            }
          }, 100);
        }
      }
    };

    const observer = new MutationObserver(checkDismissed);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => observer.disconnect();
  }, [onSuccess]);

  return (
    <>
      {contextHolder}
      <Card title="Sync status" style={{ width: 400 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Text>Last synced: 2 hours ago</Text>
          <Text type="secondary">Files pending: 12</Text>
        </div>
      </Card>
    </>
  );
}
