'use client';

/**
 * split_button-antd-T04: Email: reset split-button to default Send email
 *
 * Layout: isolated card titled "Email campaign" centered in the viewport.
 * Target component: one `Dropdown.Button` split button in the card footer.
 *
 * Initial state:
 * - The split button is currently set to "Schedule send" (left segment shows "Schedule send").
 * - A small helper text under the button reads: "Default action: Send email".
 *
 * Menu items: "Send email" (default), "Schedule send", "Send test email", Divider, "Reset to default" (secondary text: "Send email")
 *
 * Success: selectedAction equals "send_email"
 */

import React, { useState } from 'react';
import { Card, Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [selectedAction, setSelectedAction] = useState('schedule_send');
  const [hasTriggeredSuccess, setHasTriggeredSuccess] = useState(false);

  const menuItems: MenuProps['items'] = [
    { key: 'send_email', label: 'Send email' },
    { key: 'schedule_send', label: 'Schedule send' },
    { key: 'send_test', label: 'Send test email' },
    { type: 'divider' },
    { 
      key: 'reset_default', 
      label: (
        <span>
          Reset to default <span style={{ color: '#999', fontSize: 12 }}>(Send email)</span>
        </span>
      )
    },
  ];

  const getActionLabel = (key: string) => {
    const labels: Record<string, string> = {
      'send_email': 'Send email',
      'schedule_send': 'Schedule send',
      'send_test': 'Send test email',
    };
    return labels[key] || key;
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'reset_default') {
      setSelectedAction('send_email');
      if (!hasTriggeredSuccess) {
        setHasTriggeredSuccess(true);
        onSuccess();
      }
    } else {
      setSelectedAction(e.key);
      if (e.key === 'send_email' && !hasTriggeredSuccess) {
        setHasTriggeredSuccess(true);
        onSuccess();
      }
    }
  };

  return (
    <Card title="Email campaign" style={{ width: 400 }}>
      {/* Non-interactive campaign summary */}
      <div style={{ marginBottom: 16, color: '#666', fontSize: 13 }}>
        <div>Recipients: 1,234 contacts</div>
        <div>Subject: Monthly newsletter</div>
        <div>Status: Ready to send</div>
      </div>

      <div
        data-testid="split-button-root"
        data-selected-action={selectedAction}
        style={{ display: 'flex', alignItems: 'center', gap: 12 }}
      >
        <Dropdown.Button
          menu={{ items: menuItems, onClick: handleMenuClick }}
          icon={<DownOutlined />}
        >
          {getActionLabel(selectedAction)}
        </Dropdown.Button>

        {/* Disabled Preview button (distractor) */}
        <Button disabled>Preview</Button>
      </div>

      <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
        Default action: Send email
      </div>
    </Card>
  );
}
