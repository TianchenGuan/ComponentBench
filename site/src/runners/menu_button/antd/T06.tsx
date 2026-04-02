'use client';

/**
 * menu_button-antd-T06: Select Email and SMS notification channels
 * 
 * Layout: settings_panel centered titled "Notifications".
 * There is one menu button labeled "Notification channels (0 selected)" that opens a Dropdown
 * containing a checkable AntD Menu (multiple selection enabled).
 * Menu items: "Email", "SMS", "Push", "In-app".
 * 
 * Selecting items does not close the dropdown (so multiple items can be toggled).
 * Initial state: none selected.
 * Clutter (medium): the panel also contains unrelated switches for "Send weekly summary" 
 * and "Quiet hours", but they do not affect success.
 * 
 * Success: The selected set is exactly {Email, SMS}.
 */

import React, { useState, useEffect } from 'react';
import { Button, Card, Dropdown, Switch } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const channels = [
  { key: 'email', label: 'Email' },
  { key: 'sms', label: 'SMS' },
  { key: 'push', label: 'Push' },
  { key: 'inapp', label: 'In-app' },
];

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [successTriggered, setSuccessTriggered] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const isExactMatch =
      selectedChannels.length === 2 &&
      selectedChannels.includes('email') &&
      selectedChannels.includes('sms');
    
    if (isExactMatch && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedChannels, successTriggered, onSuccess]);

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedChannels(prev => {
      if (prev.includes(key)) {
        return prev.filter(k => k !== key);
      } else {
        return [...prev, key];
      }
    });
  };

  const menuItems = channels.map(ch => ({
    key: ch.key,
    label: (
      <span>
        {selectedChannels.includes(ch.key) ? '✓ ' : '  '}
        {ch.label}
      </span>
    ),
  }));

  return (
    <Card title="Notifications" style={{ width: 450 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
            Notification channels
          </div>
          <Dropdown
            menu={{ items: menuItems, onClick: handleMenuClick }}
            trigger={['click']}
            open={open}
            onOpenChange={setOpen}
          >
            <Button data-testid="menu-button-notification-channels" style={{ width: '100%', textAlign: 'left' }}>
              Notification channels ({selectedChannels.length} selected) <DownOutlined style={{ float: 'right', marginTop: 4 }} />
            </Button>
          </Dropdown>
          <div style={{ marginTop: 4, fontSize: 12, color: '#999' }}>
            Select channels
          </div>
        </div>

        {/* Clutter: unrelated switches */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#666' }}>Send weekly summary</span>
          <Switch size="small" />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#666' }}>Quiet hours</span>
          <Switch size="small" />
        </div>
      </div>
    </Card>
  );
}
