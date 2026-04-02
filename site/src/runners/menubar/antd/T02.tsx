'use client';

/**
 * menubar-antd-T02: Choose Help → Keyboard shortcuts
 * 
 * Layout: isolated_card, centered.
 * The header card contains an Ant Design horizontal Menu with items: Home, Projects, Reports, Settings, and a SubMenu labeled "Help".
 * - Clicking "Help" opens a dropdown submenu directly under the menubar.
 * - Submenu items (in order): Documentation, Keyboard shortcuts, Contact support.
 * - Initial state: "Home" active; no menus open.
 * - Selecting a submenu item highlights it as the current selection and closes the dropdown.
 * - No other clutter.
 * 
 * Success: The selected menu path is Help → Keyboard shortcuts.
 */

import React, { useState, useEffect } from 'react';
import { Menu, Card } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [selectedKey, setSelectedKey] = useState<string>('Home');
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (
      selectedPath.length === 2 &&
      selectedPath[0] === 'Help' &&
      selectedPath[1] === 'Keyboard shortcuts' &&
      !successTriggered
    ) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedPath, successTriggered, onSuccess]);

  const menuItems: MenuProps['items'] = [
    { key: 'Home', label: 'Home' },
    { key: 'Projects', label: 'Projects' },
    { key: 'Reports', label: 'Reports' },
    { key: 'Settings', label: 'Settings' },
    {
      key: 'Help',
      label: 'Help',
      children: [
        { key: 'Documentation', label: 'Documentation' },
        { key: 'Keyboard shortcuts', label: 'Keyboard shortcuts' },
        { key: 'Contact support', label: 'Contact support' },
      ],
    },
  ];

  const handleClick: MenuProps['onClick'] = ({ key, keyPath }) => {
    setSelectedKey(key);
    // keyPath is reversed: [leaf, parent, grandparent, ...]
    const path = [...keyPath].reverse();
    setSelectedPath(path);
  };

  return (
    <Card style={{ width: 650 }} data-testid="menubar-card">
      <div style={{ fontSize: 12, color: '#999', marginBottom: 8, fontWeight: 500 }}>
        Help menu contains: Documentation, Keyboard shortcuts, Contact support
      </div>
      <Menu
        mode="horizontal"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={handleClick}
        triggerSubMenuAction="click"
        data-testid="menubar-main"
      />
    </Card>
  );
}
