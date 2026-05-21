'use client';

/**
 * menu-antd-T07: Select the menu item matching a visual icon reference
 * 
 * Scene: theme=light, spacing=compact, layout=isolated_card, placement=center, scale=small, instances=1.
 *
 * Left side: a "Target" card that shows ONLY a large reference icon (no label text). The icon is a bell symbol.
 *
 * Right side: a vertical Ant Design Menu titled "Tools" in compact spacing and small size.
 * Menu items (each row has a leading icon + a label):
 * - Notifications (bell icon)
 * - Calendar (calendar icon)
 * - Search (magnifying glass icon)
 * - Help (question mark icon)
 *
 * Initial state:
 * - No item is selected.
 *
 * Success: The selected Tools menu item corresponds to the bell icon reference (label "Notifications").
 */

import React, { useState, useEffect } from 'react';
import { Menu, Card } from 'antd';
import { BellOutlined, CalendarOutlined, SearchOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const menuItems = [
  { key: 'Notifications', label: 'Notifications', icon: <BellOutlined /> },
  { key: 'Calendar', label: 'Calendar', icon: <CalendarOutlined /> },
  { key: 'Search', label: 'Search', icon: <SearchOutlined /> },
  { key: 'Help', label: 'Help', icon: <QuestionCircleOutlined /> },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (selectedKey === 'Notifications' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedKey, successTriggered, onSuccess]);

  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      {/* Target Card */}
      <Card 
        size="small" 
        title="Target" 
        style={{ width: 120 }}
        styles={{ body: { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 24 } }}
      >
        <BellOutlined style={{ fontSize: 48, color: '#1677ff' }} data-testid="target-icon" />
      </Card>

      {/* Tools Menu */}
      <Card size="small" style={{ width: 200 }}>
        <div style={{ fontSize: 11, color: '#999', marginBottom: 6, fontWeight: 500 }}>
          Tools
        </div>
        <Menu
          mode="inline"
          selectedKeys={selectedKey ? [selectedKey] : []}
          items={menuItems}
          onClick={({ key }) => setSelectedKey(key)}
          style={{ borderRight: 'none', fontSize: 12 }}
          data-testid="menu-tools"
        />
        <div style={{ marginTop: 12, fontSize: 11, color: '#666', borderTop: '1px solid #f0f0f0', paddingTop: 8 }}>
          Selected tool: <strong data-testid="selected-tool">{selectedKey || 'None'}</strong>
        </div>
      </Card>
    </div>
  );
}
