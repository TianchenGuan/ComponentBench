'use client';

/**
 * toast_snackbar-antd-T02: Show info message: Link copied
 *
 * setup_description:
 * Scene is an isolated card titled "Share". The card contains two adjacent buttons:
 * 1) "Copy share link" (target) and 2) "Copy invite code" (distractor).
 * Clicking "Copy share link" triggers an Ant Design **message.info** toast with the exact text "Link copied to clipboard."
 * Clicking the distractor triggers a different message ("Invite code copied.").
 * The toast auto-dismisses; there is no close button or action button.
 *
 * success_trigger: A toast/snackbar is visible with message text exactly equal to "Link copied to clipboard."
 */

import React, { useEffect, useRef } from 'react';
import { Card, Button, Space, message } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkToast = () => {
      const messageNode = document.querySelector('.ant-message-notice-content');
      if (messageNode && messageNode.textContent?.includes('Link copied to clipboard.')) {
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

  const handleCopyShareLink = () => {
    messageApi.info({
      content: <span data-testid="toast-text">Link copied to clipboard.</span>,
      duration: 3,
    });
  };

  const handleCopyInviteCode = () => {
    messageApi.info({
      content: 'Invite code copied.',
      duration: 3,
    });
  };

  return (
    <>
      {contextHolder}
      <Card title="Share" style={{ width: 400 }}>
        <Space>
          <Button type="primary" onClick={handleCopyShareLink} data-testid="copy-share-link-btn">
            Copy share link
          </Button>
          <Button onClick={handleCopyInviteCode} data-testid="copy-invite-code-btn">
            Copy invite code
          </Button>
        </Space>
      </Card>
    </>
  );
}
