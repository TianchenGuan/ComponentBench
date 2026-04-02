'use client';

/**
 * split_button-antd-T01: Compose: run Save draft primary action
 *
 * Layout: isolated card titled "Compose message" centered in the viewport.
 * Target component: one Ant Design split button implemented with `Dropdown.Button`.
 * The left button shows the currently selected action label; the right segment is a chevron that opens a dropdown menu.
 *
 * Configuration and initial state:
 * - Split button label (left segment): "Save draft".
 * - Dropdown trigger: click on the chevron segment.
 * - Menu items (in order): "Save draft", "Send now", "Schedule…", "Discard".
 * - The currently selected/default action is "Save draft".
 *
 * Success: lastInvokedAction equals "save_draft"
 */

import React, { useState } from 'react';
import { Card, Dropdown, Button, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [selectedAction, setSelectedAction] = useState('save_draft');
  const [lastInvokedAction, setLastInvokedAction] = useState<string | null>(null);

  const menuItems: MenuProps['items'] = [
    { key: 'save_draft', label: 'Save draft' },
    { key: 'send_now', label: 'Send now' },
    { key: 'schedule', label: 'Schedule…' },
    { key: 'discard', label: 'Discard' },
  ];

  const getActionLabel = (key: string) => {
    const item = menuItems.find(i => i?.key === key);
    return (item as { label: string })?.label || key;
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setSelectedAction(e.key);
  };

  const handlePrimaryClick = () => {
    if (lastInvokedAction) return; // Prevent double-click
    setLastInvokedAction(selectedAction);
    if (selectedAction === 'save_draft') {
      onSuccess();
    }
  };

  return (
    <Card title="Compose message" style={{ width: 400 }}>
      {/* Non-interactive message body preview (distractor) */}
      <div style={{ marginBottom: 16, padding: 12, background: '#fafafa', borderRadius: 4 }}>
        <div style={{ fontWeight: 500, marginBottom: 4 }}>Subject: Project Update</div>
        <div style={{ color: '#666', fontSize: 13 }}>
          Hi team, I wanted to share some updates regarding...
        </div>
      </div>

      <div
        data-testid="split-button-root"
        data-selected-action={selectedAction}
        data-last-invoked-action={lastInvokedAction}
      >
        <Dropdown.Button
          menu={{ items: menuItems, onClick: handleMenuClick }}
          onClick={handlePrimaryClick}
          icon={<DownOutlined />}
        >
          {getActionLabel(selectedAction)}
        </Dropdown.Button>

        {/* Status line */}
        <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
          Last action: {lastInvokedAction ? getActionLabel(lastInvokedAction) : '—'}
        </div>
      </div>
    </Card>
  );
}
