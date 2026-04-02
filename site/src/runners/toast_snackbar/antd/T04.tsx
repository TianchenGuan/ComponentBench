'use client';

/**
 * toast_snackbar-antd-T04: Trigger notification: Backup started
 *
 * setup_description:
 * Scene is an isolated card titled "Backups" in the center of the page. The card has one primary button labeled "Run backup test".
 * Clicking the button opens an Ant Design **notification** (default placement) with:
 * - Title: "Backup started"
 * - Description: "We'll notify you when it's done."
 * The notification includes the standard close (×) icon and auto-closes after a normal duration.
 * No other notifications are present initially.
 *
 * success_trigger: A notification toast is visible with title exactly "Backup started".
 */

import React, { useEffect, useRef } from 'react';
import { Card, Button, notification } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [api, contextHolder] = notification.useNotification();
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkNotification = () => {
      const notificationTitle = document.querySelector('.ant-notification-notice-message');
      if (notificationTitle?.textContent === 'Backup started') {
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

  const handleRunBackup = () => {
    api.info({
      message: <span data-testid="toast-title">Backup started</span>,
      description: <span data-testid="toast-text">We&apos;ll notify you when it&apos;s done.</span>,
      placement: 'topRight',
    });
  };

  return (
    <>
      {contextHolder}
      <Card title="Backups" style={{ width: 400 }}>
        <Button type="primary" onClick={handleRunBackup} data-testid="run-backup-btn">
          Run backup test
        </Button>
      </Card>
    </>
  );
}
