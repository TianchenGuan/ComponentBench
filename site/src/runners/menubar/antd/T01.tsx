'use client';

/**
 * menubar-antd-T01: Activate Reports tab (top navigation)
 * 
 * Layout: isolated_card, centered in the viewport.
 * A header-style card contains an Ant Design horizontal Menu with five items: Home, Projects, Reports, Settings, Help.
 * - Spacing mode: comfortable; component scale: default.
 * - Behavior: clicking an item sets it as the active item (highlight + aria-current).
 * - Initial state: "Home" is active.
 * - No submenus in this task; no extra clutter elements.
 * 
 * Success: The menubar's active item is "Reports".
 */

import React, { useState, useEffect } from 'react';
import { Menu, Card } from 'antd';
import type { TaskComponentProps } from '../types';

const menuItems = [
  { key: 'Home', label: 'Home' },
  { key: 'Projects', label: 'Projects' },
  { key: 'Reports', label: 'Reports' },
  { key: 'Settings', label: 'Settings' },
  { key: 'Help', label: 'Help' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [activeKey, setActiveKey] = useState<string>('Home');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (activeKey === 'Reports' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [activeKey, successTriggered, onSuccess]);

  return (
    <Card style={{ width: 600 }} data-testid="menubar-card">
      <div style={{ fontSize: 12, color: '#999', marginBottom: 8, fontWeight: 500 }}>
        Top menu bar: Home · Projects · Reports · Settings · Help (Reports should be active)
      </div>
      <Menu
        mode="horizontal"
        selectedKeys={[activeKey]}
        items={menuItems}
        onClick={({ key }) => setActiveKey(key)}
        data-testid="menubar-main"
      />
    </Card>
  );
}
