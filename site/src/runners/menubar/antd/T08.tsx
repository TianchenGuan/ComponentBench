'use client';

/**
 * menubar-antd-T08: Secondary menubar: Help → About
 * 
 * Layout: isolated_card, centered.
 * Two Ant Design horizontal menubars are visible one above the other, each with a label directly above it:
 * 1) "Primary (Header)" menubar
 * 2) "Secondary (Preview)" menubar   ← target instance
 * Both menubars have similar top-level items and a Help submenu.
 * - Secondary (Preview) Help submenu items: Documentation, About (target), Report a bug.
 * - Primary (Header) Help submenu items: Documentation, Release notes, Contact.
 * - Initial state: both menubars have "Home" active; no dropdowns open.
 * - There are no other page controls; the challenge is choosing the correct labeled menubar instance.
 * 
 * Success: In the menubar instance labeled "Secondary (Preview)", the selected path is Help → About.
 */

import React, { useState, useEffect } from 'react';
import { Menu, Card } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T08({ onSuccess }: TaskComponentProps) {
  const [primarySelectedPath, setPrimarySelectedPath] = useState<string[]>([]);
  const [secondarySelectedPath, setSecondarySelectedPath] = useState<string[]>([]);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (
      secondarySelectedPath.length === 2 &&
      secondarySelectedPath[0] === 'Help' &&
      secondarySelectedPath[1] === 'About' &&
      !successTriggered
    ) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [secondarySelectedPath, successTriggered, onSuccess]);

  const primaryMenuItems: MenuProps['items'] = [
    { key: 'Home', label: 'Home' },
    { key: 'Projects', label: 'Projects' },
    { key: 'Settings', label: 'Settings' },
    {
      key: 'Help',
      label: 'Help',
      children: [
        { key: 'Documentation', label: 'Documentation' },
        { key: 'Release notes', label: 'Release notes' },
        { key: 'Contact', label: 'Contact' },
      ],
    },
  ];

  const secondaryMenuItems: MenuProps['items'] = [
    { key: 'Home', label: 'Home' },
    { key: 'Projects', label: 'Projects' },
    { key: 'Settings', label: 'Settings' },
    {
      key: 'Help',
      label: 'Help',
      children: [
        { key: 'Documentation', label: 'Documentation' },
        { key: 'About', label: 'About' },
        { key: 'Report a bug', label: 'Report a bug' },
      ],
    },
  ];

  const handlePrimaryClick: MenuProps['onClick'] = ({ keyPath }) => {
    const path = [...keyPath].reverse();
    setPrimarySelectedPath(path);
  };

  const handleSecondaryClick: MenuProps['onClick'] = ({ keyPath }) => {
    const path = [...keyPath].reverse();
    setSecondarySelectedPath(path);
  };

  return (
    <Card style={{ width: 600 }} data-testid="menubar-card">
      <div style={{ fontSize: 12, color: '#999', marginBottom: 16, fontWeight: 500 }}>
        Menubar labels: Primary (Header) and Secondary (Preview). Use Secondary (Preview).
      </div>
      
      {/* Primary menubar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#333' }}>
          Primary (Header)
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={primarySelectedPath.length > 0 ? [primarySelectedPath[primarySelectedPath.length - 1]] : ['Home']}
          items={primaryMenuItems}
          onClick={handlePrimaryClick}
          triggerSubMenuAction="click"
          data-testid="menubar-primary"
        />
      </div>

      {/* Secondary menubar */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#333' }}>
          Secondary (Preview)
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={secondarySelectedPath.length > 0 ? [secondarySelectedPath[secondarySelectedPath.length - 1]] : ['Home']}
          items={secondaryMenuItems}
          onClick={handleSecondaryClick}
          triggerSubMenuAction="click"
          data-testid="menubar-secondary"
        />
      </div>
    </Card>
  );
}
