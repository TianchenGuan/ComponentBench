'use client';

/**
 * toast_snackbar-antd-T03: Trigger top-right notification: New comment
 *
 * setup_description:
 * Scene is an isolated card titled "Comments". The card contains a primary button labeled "Notify me"
 * and a secondary text button labeled "Preview" (does not trigger a toast).
 * Clicking "Notify me" opens an Ant Design **notification** in the viewport corner using the library default placement (top-right).
 * The notification has:
 * - Title: "New comment"
 * - Description: "Nina: Looks good to me."
 * - Standard close (×) icon.
 * The notification auto-closes after the default duration unless closed earlier.
 *
 * success_trigger: A notification toast is visible with title exactly "New comment" and description "Nina: Looks good to me."
 */

import React, { useEffect, useRef } from 'react';
import { Card, Button, Space, notification } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [api, contextHolder] = notification.useNotification();
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkNotification = () => {
      const notificationTitle = document.querySelector('.ant-notification-notice-message');
      const notificationDescription = document.querySelector('.ant-notification-notice-description');
      if (
        notificationTitle?.textContent === 'New comment' &&
        notificationDescription?.textContent === 'Nina: Looks good to me.'
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

  const handleNotifyMe = () => {
    api.info({
      message: <span data-testid="toast-title">New comment</span>,
      description: <span data-testid="toast-text">Nina: Looks good to me.</span>,
      placement: 'topRight',
    });
  };

  const handlePreview = () => {
    // Does nothing - distractor button
  };

  return (
    <>
      {contextHolder}
      <Card title="Comments" style={{ width: 400 }}>
        <Space>
          <Button type="primary" onClick={handleNotifyMe} data-testid="notify-me-btn">
            Notify me
          </Button>
          <Button type="text" onClick={handlePreview} data-testid="preview-btn">
            Preview
          </Button>
        </Space>
      </Card>
    </>
  );
}
