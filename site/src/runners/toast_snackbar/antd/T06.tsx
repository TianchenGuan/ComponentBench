'use client';

/**
 * toast_snackbar-antd-T06: Undo archive from notification action
 *
 * setup_description:
 * Scene is an isolated card titled "Archive". The main card content is static.
 * On initial load, an Ant Design **notification** is already visible (persistent). It contains:
 * - Title: "Item archived"
 * - Description: "Q4 Report.pdf was moved to Archive."
 * - An actions area with two buttons: "Undo" (target) and "View" (distractor).
 * Clicking "Undo" immediately shows a separate Ant Design **message.success** toast that reads "Archive undone."
 * Clicking "View" does not show the success message.
 *
 * success_trigger: A success toast message becomes visible with text exactly "Archive undone."
 */

import React, { useEffect, useRef } from 'react';
import { Card, Button, Space, Typography, notification, message } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const [messageApi, messageContextHolder] = message.useMessage();
  const successCalledRef = useRef(false);
  const notificationShownRef = useRef(false);

  // Monitor for success message
  useEffect(() => {
    const checkToast = () => {
      const messageNode = document.querySelector('.ant-message-notice-content');
      if (messageNode && messageNode.textContent?.includes('Archive undone.')) {
        if (!successCalledRef.current) {
          successCalledRef.current = true;
          onSuccess();
        }
      }
    };

    const observer = new MutationObserver(checkToast);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    return () => observer.disconnect();
  }, [onSuccess]);

  // Show notification on mount
  useEffect(() => {
    if (!notificationShownRef.current) {
      notificationShownRef.current = true;
      notificationApi.info({
        key: 'item-archived',
        message: <span data-testid="toast-title">Item archived</span>,
        description: <span data-testid="toast-text">Q4 Report.pdf was moved to Archive.</span>,
        placement: 'topRight',
        duration: 0, // persistent
        btn: (
          <Space>
            <Button
              type="primary"
              size="small"
              onClick={() => {
                notificationApi.destroy('item-archived');
                messageApi.success({
                  content: <span data-testid="success-toast-text">Archive undone.</span>,
                  duration: 3,
                });
              }}
              data-testid="toast-action-undo"
            >
              Undo
            </Button>
            <Button
              size="small"
              onClick={() => {
                // Distractor - does nothing
              }}
              data-testid="toast-action-view"
            >
              View
            </Button>
          </Space>
        ),
      });
    }
  }, [notificationApi, messageApi]);

  return (
    <>
      {notificationContextHolder}
      {messageContextHolder}
      <Card title="Archive" style={{ width: 400 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Text>Recently archived items will appear here.</Text>
          <Text type="secondary">You can restore items within 30 days.</Text>
        </div>
      </Card>
    </>
  );
}
