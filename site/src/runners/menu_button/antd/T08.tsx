'use client';

/**
 * menu_button-antd-T08: Export as PDF from submenu
 * 
 * Layout: isolated_card placed near the bottom-right of the viewport.
 * Spacing is compact (tighter padding and smaller gaps).
 * There is one menu button labeled "Export".
 * Clicking opens a dropdown menu with: "Quick export", a submenu labeled "Export as", "Export settings".
 * Hovering or clicking "Export as" opens a nested submenu with: "CSV", "PDF", "PNG".
 * 
 * Selecting a leaf item closes all menus and updates the trigger to show the last export type.
 * Initial state: no export type selected yet (trigger shows just "Export").
 * 
 * Success: The selected path equals ["Export as", "PDF"].
 */

import React, { useState, useEffect } from 'react';
import { Button, Card, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';
import type { MenuProps } from 'antd';

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [exportType, setExportType] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (exportType === 'PDF' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [exportType, successTriggered, onSuccess]);

  const handleMenuClick: MenuProps['onClick'] = ({ key, keyPath }) => {
    // keyPath comes in reverse order: ['pdf', 'export-as']
    if (keyPath.includes('export-as') && ['csv', 'pdf', 'png'].includes(key)) {
      const format = key.toUpperCase();
      setExportType(format);
    }
  };

  const menuItems: MenuProps['items'] = [
    { key: 'quick-export', label: 'Quick export' },
    {
      key: 'export-as',
      label: 'Export as',
      children: [
        { key: 'csv', label: 'CSV' },
        { key: 'pdf', label: 'PDF' },
        { key: 'png', label: 'PNG' },
      ],
    },
    { key: 'export-settings', label: 'Export settings' },
  ];

  return (
    <Card title="Document" style={{ width: 300 }} styles={{ body: { padding: 12 } }}>
      <Dropdown
        menu={{ items: menuItems, onClick: handleMenuClick }}
        trigger={['click']}
      >
        <Button size="small" data-testid="menu-button-export">
          {exportType ? `Export (${exportType})` : 'Export'} <DownOutlined />
        </Button>
      </Dropdown>
    </Card>
  );
}
