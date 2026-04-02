'use client';

/**
 * menu_button-antd-T05: Pick quick action by matching icon reference
 * 
 * Layout: isolated_card centered titled "Quick tools".
 * At the top of the card there is a small "Reference icon" preview (the Print icon).
 * Below it is one menu button labeled "Quick action: None".
 * Opening the menu shows four items, each with a left icon and label:
 * "Download", "Print", "Share", "Archive".
 * 
 * Guidance is visual: the user must match the menu item's icon to the reference preview.
 * Success: The selected item is "Print" (matches the reference icon).
 */

import React, { useState, useEffect } from 'react';
import { Button, Card, Dropdown } from 'antd';
import { DownOutlined, DownloadOutlined, PrinterOutlined, ShareAltOutlined, InboxOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const actionItems = [
  { key: 'download', label: 'Download', icon: <DownloadOutlined /> },
  { key: 'print', label: 'Print', icon: <PrinterOutlined /> },
  { key: 'share', label: 'Share', icon: <ShareAltOutlined /> },
  { key: 'archive', label: 'Archive', icon: <InboxOutlined /> },
];

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (selectedAction === 'Print' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [selectedAction, successTriggered, onSuccess]);

  const handleMenuClick = ({ key }: { key: string }) => {
    const item = actionItems.find(a => a.key === key);
    if (item) {
      setSelectedAction(item.label);
    }
  };

  const menuItems = actionItems.map(item => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
  }));

  return (
    <Card title="Quick tools" style={{ width: 400 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Reference icon:</div>
        <div
          style={{
            width: 48,
            height: 48,
            border: '1px solid #d9d9d9',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
          }}
          data-ref-id="icon_ref_1"
        >
          <PrinterOutlined />
        </div>
      </div>

      <Dropdown
        menu={{ items: menuItems, onClick: handleMenuClick }}
        trigger={['click']}
      >
        <Button data-testid="menu-button-quick-action">
          Quick action: {selectedAction || 'None'} <DownOutlined />
        </Button>
      </Dropdown>
    </Card>
  );
}
