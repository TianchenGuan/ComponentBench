'use client';

/**
 * toast_snackbar-antd-T01: Show success message: Profile saved
 *
 * setup_description:
 * Scene is an isolated card labeled "Profile". In the middle of the page there is a single primary button labeled "Save profile".
 * When the button is clicked, an Ant Design global **message** toast appears near the top of the viewport (standard message placement)
 * with success styling and the exact text "Profile saved." The message auto-dismisses after a short duration.
 * No other toast-producing controls are present; the page contains no additional forms or navigation.
 *
 * success_trigger: A toast/snackbar is visible with message text exactly equal to "Profile saved."
 */

import React, { useEffect, useRef } from 'react';
import { Card, Button, message } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const successCalledRef = useRef(false);

  useEffect(() => {
    const checkToast = () => {
      const messageNode = document.querySelector('.ant-message-notice-content');
      if (messageNode && messageNode.textContent?.includes('Profile saved.')) {
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

  const handleSaveProfile = () => {
    messageApi.success({
      content: <span data-testid="toast-text">Profile saved.</span>,
      duration: 3,
    });
  };

  return (
    <>
      {contextHolder}
      <Card title="Profile" style={{ width: 400 }}>
        <Button type="primary" onClick={handleSaveProfile} data-testid="save-profile-btn">
          Save profile
        </Button>
      </Card>
    </>
  );
}
