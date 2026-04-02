'use client';

/**
 * button-antd-T09: Enable Do Not Disturb (toggle-style button)
 * 
 * Isolated notification card (bottom-left placement).
 * Two buttons: "Do Not Disturb" (toggle) and "Send test notification" (primary).
 * Task: Click "Do Not Disturb" to turn it ON (aria-pressed=true).
 */

import React, { useState } from 'react';
import { Button, Card, Space } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [dndEnabled, setDndEnabled] = useState(false);

  const handleDndToggle = () => {
    const newState = !dndEnabled;
    setDndEnabled(newState);
    if (newState) {
      onSuccess();
    }
  };

  const handleTestNotification = () => {
    // Does nothing for this task
  };

  return (
    <Card title="Notifications" style={{ width: 350 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <Button
            type={dndEnabled ? 'primary' : 'default'}
            onClick={handleDndToggle}
            aria-pressed={dndEnabled}
            data-testid="antd-btn-dnd-toggle"
            style={{ width: '100%' }}
          >
            Do Not Disturb
          </Button>
          {dndEnabled && (
            <div style={{ marginTop: 8, fontSize: 12, color: '#52c41a' }}>
              DND is ON
            </div>
          )}
        </div>
        
        <Button
          type="primary"
          onClick={handleTestNotification}
          data-testid="antd-btn-test-notification"
          style={{ width: '100%' }}
        >
          Send test notification
        </Button>
      </Space>
    </Card>
  );
}
