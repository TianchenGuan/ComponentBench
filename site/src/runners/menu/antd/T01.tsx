'use client';

/**
 * menu-antd-T01: Navigate to Reports in sidebar menu
 * 
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1.
 *
 * The page shows an isolated card centered in the viewport with a typical "app shell" mock:
 * - Left side: a vertical Ant Design Menu labeled "Sidebar navigation".
 * - Right side: a read-only content panel that mirrors the currently active menu item as text: "Current section: …".
 *
 * Menu configuration:
 * - Mode: inline (vertical), light theme, comfortable spacing, default size.
 * - Items (top to bottom): Home (initially selected), Billing, Reports, Settings.
 * - Clicking an item changes the menu selected key and updates the mirrored "Current section" text.
 *
 * Success: The sidebar menu's selected item is "Reports" (selected_path == ["Reports"]).
 */

import React, { useState, useEffect } from 'react';
import { Menu, Card } from 'antd';
import type { TaskComponentProps } from '../types';

const menuItems = [
  { key: 'Home', label: 'Home' },
  { key: 'Billing', label: 'Billing' },
  { key: 'Reports', label: 'Reports' },
  { key: 'Settings', label: 'Settings' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selectedKey, setSelectedKey] = useState<string>('Home');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (selectedKey === 'Reports' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedKey, successTriggered, onSuccess]);

  return (
    <Card style={{ width: 600 }}>
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: '0 0 200px' }}>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 8, fontWeight: 500 }}>
            Sidebar navigation
          </div>
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={({ key }) => setSelectedKey(key)}
            style={{ borderRight: 'none' }}
            data-testid="menu-sidebar"
          />
        </div>
        <div style={{ flex: 1, padding: '16px', background: '#fafafa', borderRadius: 4 }}>
          <div style={{ fontSize: 14, color: '#666' }}>
            Current section: <strong data-testid="current-section">{selectedKey}</strong>
          </div>
        </div>
      </div>
    </Card>
  );
}
