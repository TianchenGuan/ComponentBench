'use client';

/**
 * menubar-antd-T07: Select Integrations from an overflowed menubar
 * 
 * Layout: isolated_card, centered, but the menubar container is intentionally narrow to force horizontal overflow.
 * - Spacing: compact (reduced padding between items).
 * - Ant Design horizontal Menu contains many top-level items (e.g., Overview, Projects, Teams, Analytics, Reports, Billing, Settings, Integrations, Help).
 * - When there is not enough horizontal space, AntD moves trailing items into an overflow submenu labeled "More" (overflowedIndicator).
 * - Initial state: "Overview" is active; "Integrations" is NOT visible in the top row (it is inside "More").
 * - No other clutter; focus is on locating and selecting the hidden item.
 * 
 * Success: The menubar's active item is "Integrations".
 */

import React, { useState, useEffect } from 'react';
import { Menu, Card } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const menuItems = [
  { key: 'Overview', label: 'Overview' },
  { key: 'Projects', label: 'Projects' },
  { key: 'Teams', label: 'Teams' },
  { key: 'Analytics', label: 'Analytics' },
  { key: 'Reports', label: 'Reports' },
  { key: 'Billing', label: 'Billing' },
  { key: 'Settings', label: 'Settings' },
  { key: 'Integrations', label: 'Integrations' },
  { key: 'Help', label: 'Help' },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState<string>('Overview');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (activeKey === 'Integrations' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [activeKey, successTriggered, onSuccess]);

  return (
    <Card style={{ width: 400 }} data-testid="menubar-card">
      <div style={{ fontSize: 12, color: '#999', marginBottom: 8, fontWeight: 500 }}>
        Top menu bar has many items; some may be under &quot;More&quot;
      </div>
      <Menu
        mode="horizontal"
        selectedKeys={[activeKey]}
        items={menuItems}
        onClick={({ key }) => setActiveKey(key)}
        overflowedIndicator={<EllipsisOutlined style={{ fontSize: 16 }} />}
        style={{ maxWidth: 350 }}
        data-testid="menubar-main"
      />
    </Card>
  );
}
