'use client';

/**
 * menu-antd-T09: Select exactly three notification channels in a multi-select menu
 * 
 * Scene: theme=light, spacing=comfortable, layout=settings_panel, placement=center, scale=default, instances=1.
 *
 * Component:
 * - A vertical Ant Design Menu titled "Notification channels".
 * - The menu is configured for multiple selection: each selected item shows a check indicator.
 *
 * Items (with intentionally similar distractors):
 * - Email (selected initially)
 * - Email digest
 * - SMS
 * - Push
 * - Push (silent)
 * - In-app
 * - Webhook
 *
 * Goal state:
 * - Exactly Email, SMS, and Push are selected.
 *
 * Success: The Notification channels menu has exactly the selected set {Email, SMS, Push}.
 */

import React, { useState, useEffect } from 'react';
import { Menu, Card, Input } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const channelOptions = [
  'Email',
  'Email digest',
  'SMS',
  'Push',
  'Push (silent)',
  'In-app',
  'Webhook',
];

const targetSet = new Set(['Email', 'SMS', 'Push']);

export default function T09({ onSuccess }: TaskComponentProps) {
  const [selectedChannels, setSelectedChannels] = useState<Set<string>>(new Set(['Email']));
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    // Check if selected set equals target set
    const isEqual = 
      selectedChannels.size === targetSet.size &&
      Array.from(targetSet).every((item) => selectedChannels.has(item));
    
    if (isEqual && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedChannels, successTriggered, onSuccess]);

  const handleClick = (key: string) => {
    setSelectedChannels((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const menuItems = channelOptions.map((channel) => ({
    key: channel,
    label: channel,
    icon: selectedChannels.has(channel) 
      ? <CheckOutlined style={{ color: '#52c41a' }} /> 
      : <span style={{ width: 14, display: 'inline-block' }} />,
    'data-checked': selectedChannels.has(channel),
  }));

  return (
    <Card style={{ width: 500 }}>
      {/* Settings panel clutter */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>Workspace name</div>
        <Input value="Production Environment" disabled />
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>Default timezone</div>
        <Input value="UTC-5 (Eastern)" disabled />
      </div>

      {/* Target menu */}
      <div style={{ fontSize: 12, color: '#999', marginBottom: 8, fontWeight: 500 }}>
        Notification channels
      </div>
      <Menu
        mode="inline"
        selectable={false}
        items={menuItems}
        onClick={({ key }) => handleClick(key)}
        style={{ borderRight: 'none' }}
        data-testid="menu-notification-channels"
      />
      <div style={{ marginTop: 16, fontSize: 12, color: '#666', borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
        Selected: <strong data-testid="selected-channels">{Array.from(selectedChannels).sort().join(', ') || 'None'}</strong>
      </div>
    </Card>
  );
}
