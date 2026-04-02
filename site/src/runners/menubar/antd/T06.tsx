'use client';

/**
 * menubar-antd-T06: Go to Settings section (dark theme header)
 * 
 * Layout: isolated_card, centered.
 * Theme: dark; spacing: comfortable; component scale: default.
 * The card contains an Ant Design horizontal Menu with items: Overview, Billing, Settings, Help.
 * - Clicking an item changes the active menu key (highlight/underline + aria-current).
 * - Initial state: "Overview" is active.
 * - No other interactive clutter; the goal is purely to activate the correct menubar item in dark theme.
 * 
 * Success: The menubar's active item is "Settings".
 */

import React, { useState, useEffect } from 'react';
import { Menu, Card, ConfigProvider, theme } from 'antd';
import type { TaskComponentProps } from '../types';

const menuItems = [
  { key: 'Overview', label: 'Overview' },
  { key: 'Billing', label: 'Billing' },
  { key: 'Settings', label: 'Settings' },
  { key: 'Help', label: 'Help' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState<string>('Overview');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (activeKey === 'Settings' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [activeKey, successTriggered, onSuccess]);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <Card 
        style={{ width: 500, background: '#1f1f1f', borderColor: '#333' }} 
        data-testid="menubar-card"
      >
        <div style={{ fontSize: 12, color: '#888', marginBottom: 8, fontWeight: 500 }}>
          Top menu bar (dark): Overview · Billing · Settings · Help
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={[activeKey]}
          items={menuItems}
          onClick={({ key }) => setActiveKey(key)}
          style={{ background: 'transparent', borderBottom: '1px solid #333' }}
          data-testid="menubar-main"
        />
      </Card>
    </ConfigProvider>
  );
}
