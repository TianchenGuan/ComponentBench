'use client';

/**
 * menubar-antd-T03: Turn on View → Show grid
 * 
 * Layout: form_section (a mock "Editor settings" section) with a header menubar at the top of the section.
 * - The Ant Design horizontal Menu includes: File, Edit, View (SubMenu), Help.
 * - Opening "View" reveals a dropdown with three checkable items:
 *     • Show grid (initially OFF)
 *     • Show rulers (initially ON)
 *     • Snap to guides (initially OFF)
 * - Each checkable item shows a checkmark indicator when ON.
 * - Clutter (low): below the menubar there is a read-only form preview (Title input, Description textarea) but it does not affect success.
 * - Feedback: toggling updates the checkmark immediately; no Apply button.
 * 
 * Success: The toggle state for "Show grid" is ON.
 */

import React, { useState, useEffect } from 'react';
import { Menu, Card, Input } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

interface ToggleStates {
  'Show grid': boolean;
  'Show rulers': boolean;
  'Snap to guides': boolean;
}

export default function T03({ onSuccess }: TaskComponentProps) {
  const [toggles, setToggles] = useState<ToggleStates>({
    'Show grid': false,
    'Show rulers': true,
    'Snap to guides': false,
  });
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (toggles['Show grid'] && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [toggles, successTriggered, onSuccess]);

  const handleToggle = (key: keyof ToggleStates) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const viewMenuChildren: MenuProps['items'] = [
    {
      key: 'Show grid',
      label: 'Show grid',
      icon: toggles['Show grid'] ? <CheckOutlined /> : <span style={{ width: 14, display: 'inline-block' }} />,
    },
    {
      key: 'Show rulers',
      label: 'Show rulers',
      icon: toggles['Show rulers'] ? <CheckOutlined /> : <span style={{ width: 14, display: 'inline-block' }} />,
    },
    {
      key: 'Snap to guides',
      label: 'Snap to guides',
      icon: toggles['Snap to guides'] ? <CheckOutlined /> : <span style={{ width: 14, display: 'inline-block' }} />,
    },
  ];

  const menuItems: MenuProps['items'] = [
    { key: 'File', label: 'File' },
    { key: 'Edit', label: 'Edit' },
    {
      key: 'View',
      label: 'View',
      children: viewMenuChildren,
    },
    { key: 'Help', label: 'Help' },
  ];

  const handleClick: MenuProps['onClick'] = ({ key }) => {
    if (key in toggles) {
      handleToggle(key as keyof ToggleStates);
    }
  };

  return (
    <Card style={{ width: 550 }} data-testid="menubar-card">
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Editor settings</div>
      <div style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>
        View menu: Show grid [toggle], Show rulers [toggle], Snap to guides [toggle]
      </div>
      <Menu
        mode="horizontal"
        selectable={false}
        items={menuItems}
        onClick={handleClick}
        triggerSubMenuAction="click"
        data-testid="menubar-main"
      />
      
      {/* Low clutter: form preview */}
      <div style={{ marginTop: 16, padding: 16, background: '#fafafa', borderRadius: 4 }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>Title</label>
          <Input disabled value="Document Title" />
        </div>
        <div>
          <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 4 }}>Description</label>
          <Input.TextArea disabled value="A brief description of the document." rows={2} />
        </div>
      </div>
    </Card>
  );
}
