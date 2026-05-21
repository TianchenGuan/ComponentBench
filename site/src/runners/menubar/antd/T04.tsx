'use client';

/**
 * menubar-antd-T04: Open Tools menu (leave it open)
 * 
 * Layout: isolated_card anchored at the top-left of the viewport (placement=top_left).
 * The card contains an Ant Design horizontal Menu with items: Dashboard, Tools (SubMenu), Account.
 * - Tools dropdown items: Import…, Export…, Extensions.
 * - Interaction: Tools opens on click (triggerSubMenuAction='click') for predictability.
 * - Initial state: no dropdown is open; Dashboard is the active item.
 * - No clutter elements.
 * 
 * Success: The Tools submenu dropdown is open/expanded (open_path includes "Tools").
 */

import React, { useState, useEffect } from 'react';
import { Menu, Card } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (openKeys.includes('Tools') && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [openKeys, successTriggered, onSuccess]);

  const menuItems: MenuProps['items'] = [
    { key: 'Dashboard', label: 'Dashboard' },
    {
      key: 'Tools',
      label: 'Tools',
      children: [
        { key: 'Import', label: 'Import…' },
        { key: 'Export', label: 'Export…' },
        { key: 'Extensions', label: 'Extensions' },
      ],
    },
    { key: 'Account', label: 'Account' },
  ];

  const handleOpenChange: MenuProps['onOpenChange'] = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <Card style={{ width: 450 }} data-testid="menubar-card">
      <div style={{ fontSize: 12, color: '#999', marginBottom: 8, fontWeight: 500 }}>
        Tools menu dropdown should be open (items: Import…, Export…, Extensions)
      </div>
      <Menu
        mode="horizontal"
        selectedKeys={['Dashboard']}
        openKeys={openKeys}
        items={menuItems}
        onOpenChange={handleOpenChange}
        triggerSubMenuAction="click"
        data-testid="menubar-main"
      />
    </Card>
  );
}
