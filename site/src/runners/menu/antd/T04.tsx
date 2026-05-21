'use client';

/**
 * menu-antd-T04: Clear the status filter selection
 * 
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1.
 *
 * Component:
 * - A vertical Ant Design Menu titled "Status filter".
 * - The menu is selectable (single selection).
 *
 * Items (top to bottom):
 * - All
 * - Open (initially selected)
 * - In progress
 * - Closed
 * - Divider
 * - Clear selection (action item)
 *
 * Feedback:
 * - A text line under the menu shows the effective filter, e.g., "Current filter: Open".
 * - Clicking "Clear selection" removes any selected menu item and updates the text to "Current filter: None".
 *
 * Success: No status item is selected in the Status filter menu (selected_path is empty).
 */

import React, { useState, useEffect } from 'react';
import { Menu, Card } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T04({ onSuccess }: TaskComponentProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>('Open');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (selectedKey === null && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedKey, successTriggered, onSuccess]);

  const handleClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'clear') {
      setSelectedKey(null);
    } else {
      setSelectedKey(key);
    }
  };

  const menuItems: MenuProps['items'] = [
    { key: 'All', label: 'All' },
    { key: 'Open', label: 'Open' },
    { key: 'In progress', label: 'In progress' },
    { key: 'Closed', label: 'Closed' },
    { type: 'divider' },
    { 
      key: 'clear', 
      label: 'Clear selection', 
      icon: <CloseCircleOutlined />,
      danger: true,
    },
  ];

  return (
    <Card style={{ width: 300 }}>
      <div style={{ fontSize: 12, color: '#999', marginBottom: 8, fontWeight: 500 }}>
        Status filter
      </div>
      <Menu
        mode="inline"
        selectedKeys={selectedKey ? [selectedKey] : []}
        items={menuItems}
        onClick={handleClick}
        style={{ borderRight: 'none' }}
        data-testid="menu-status-filter"
      />
      <div style={{ marginTop: 16, fontSize: 14, color: '#666', borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
        Current filter: <strong data-testid="current-filter">{selectedKey || 'None'}</strong>
      </div>
    </Card>
  );
}
