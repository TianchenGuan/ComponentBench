'use client';

/**
 * menubar-antd-T10: Admin → Permissions → Role templates (hover submenus, dark+compact)
 * 
 * Layout: isolated_card, centered.
 * Theme: dark. Spacing: compact (reduced padding and smaller hit areas).
 * The Ant Design horizontal Menu includes top-level items: Dashboard, Admin (SubMenu), Help.
 * - Admin dropdown (level 1) items: Users, Teams, Permissions (SubMenu), Audit log.
 * - Permissions submenu (level 2) items: Roles, Role templates (target), API scopes.
 * - Interaction: submenus use the common "hover to open" behavior (triggerSubMenuAction='hover') so the second-level submenu opens when the pointer moves over "Permissions".
 * - Initial state: Dashboard is active; no dropdowns open.
 * - No other clutter; difficulty comes from compact spacing + hover-driven multi-level layering.
 * 
 * Success: The selected menu path is Admin → Permissions → Role templates.
 */

import React, { useState, useEffect } from 'react';
import { Menu, Card, ConfigProvider, theme } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (
      selectedPath.length === 3 &&
      selectedPath[0] === 'Admin' &&
      selectedPath[1] === 'Permissions' &&
      selectedPath[2] === 'Role templates' &&
      !successTriggered
    ) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedPath, successTriggered, onSuccess]);

  const menuItems: MenuProps['items'] = [
    { key: 'Dashboard', label: 'Dashboard' },
    {
      key: 'Admin',
      label: 'Admin',
      children: [
        { key: 'Users', label: 'Users' },
        { key: 'Teams', label: 'Teams' },
        {
          key: 'Permissions',
          label: 'Permissions',
          children: [
            { key: 'Roles', label: 'Roles' },
            { key: 'Role templates', label: 'Role templates' },
            { key: 'API scopes', label: 'API scopes' },
          ],
        },
        { key: 'Audit log', label: 'Audit log' },
      ],
    },
    { key: 'Help', label: 'Help' },
  ];

  const handleClick: MenuProps['onClick'] = ({ keyPath }) => {
    // keyPath is reversed: [leaf, parent, grandparent, ...]
    const path = [...keyPath].reverse();
    setSelectedPath(path);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          padding: 8,
          paddingXS: 4,
        },
      }}
    >
      <Card 
        style={{ width: 450, background: '#1f1f1f', borderColor: '#333' }} 
        data-testid="menubar-card"
      >
        <div style={{ fontSize: 12, color: '#888', marginBottom: 8, fontWeight: 500 }}>
          Admin menu contains a nested Permissions submenu; choose Role templates
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={selectedPath.length > 0 ? [selectedPath[selectedPath.length - 1]] : ['Dashboard']}
          items={menuItems}
          onClick={handleClick}
          triggerSubMenuAction="hover"
          style={{ background: 'transparent', borderBottom: '1px solid #333' }}
          data-testid="menubar-main"
        />
      </Card>
    </ConfigProvider>
  );
}
