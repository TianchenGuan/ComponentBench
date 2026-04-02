'use client';

/**
 * menu_button-antd-T02: Set sort order to Newest first
 * 
 * Layout: isolated_card centered. The card header reads "Results".
 * There is one menu button labeled "Sort: Default" (AntD Button + Dropdown).
 * Clicking opens a Menu with three radio-style items: "Default", "Newest first", "Oldest first".
 * Selecting an item immediately closes the menu and updates the button label.
 * 
 * Initial state: "Default" is selected.
 * Success: The selected value is "Newest first".
 */

import React, { useState, useEffect } from 'react';
import { Button, Card, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const sortOptions = [
  { key: 'default', label: 'Default' },
  { key: 'newest', label: 'Newest first' },
  { key: 'oldest', label: 'Oldest first' },
];

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [selectedSort, setSelectedSort] = useState('Default');
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (selectedSort === 'Newest first' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedSort, successTriggered, onSuccess]);

  const handleMenuClick = ({ key }: { key: string }) => {
    const option = sortOptions.find(o => o.key === key);
    if (option) {
      setSelectedSort(option.label);
    }
  };

  const menuItems = sortOptions.map(opt => ({
    key: opt.key,
    label: opt.label,
  }));

  return (
    <Card title="Results" style={{ width: 400 }}>
      <Dropdown
        menu={{
          items: menuItems,
          onClick: handleMenuClick,
          selectable: true,
          selectedKeys: [sortOptions.find(o => o.label === selectedSort)?.key || 'default'],
        }}
        trigger={['click']}
      >
        <Button data-testid="menu-button-sort">
          Sort: {selectedSort} <DownOutlined />
        </Button>
      </Dropdown>
    </Card>
  );
}
