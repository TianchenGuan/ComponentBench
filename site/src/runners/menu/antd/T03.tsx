'use client';

/**
 * menu-antd-T03: Expand Analytics submenu
 * 
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1.
 *
 * Component:
 * - A vertical Ant Design Menu labeled "Sidebar navigation".
 * - The menu contains two top-level SubMenus, each with a caret/arrow disclosure affordance:
 *   1) Analytics (collapsed initially) with children: Traffic, Conversions
 *   2) Operations (collapsed initially) with children: Jobs, Logs
 *
 * Initial state:
 * - Both top-level sections are collapsed; only the two top-level rows are visible.
 *
 * Success: The "Analytics" SubMenu is expanded (its child items are rendered/visible).
 *   open_submenus == ["Analytics"] (only Analytics should be open)
 */

import React, { useState, useEffect } from 'react';
import { Menu, Card } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
  {
    key: 'Analytics',
    label: 'Analytics',
    children: [
      { key: 'Traffic', label: 'Traffic' },
      { key: 'Conversions', label: 'Conversions' },
    ],
  },
  {
    key: 'Operations',
    label: 'Operations',
    children: [
      { key: 'Jobs', label: 'Jobs' },
      { key: 'Logs', label: 'Logs' },
    ],
  },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    // Success when Analytics is expanded AND Operations is not expanded
    const analyticsOpen = openKeys.includes('Analytics');
    const operationsOpen = openKeys.includes('Operations');
    
    if (analyticsOpen && !operationsOpen && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [openKeys, successTriggered, onSuccess]);

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  return (
    <Card style={{ width: 400 }}>
      <div style={{ fontSize: 12, color: '#999', marginBottom: 8, fontWeight: 500 }}>
        Sidebar navigation
      </div>
      <Menu
        mode="inline"
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        items={menuItems}
        style={{ borderRight: 'none' }}
        data-testid="menu-sidebar"
      />
    </Card>
  );
}
