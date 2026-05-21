'use client';

/**
 * button-antd-T07: Open More actions menu (small icon button in toolbar)
 * 
 * Dashboard-style header toolbar (top-right placement).
 * Two icon-only buttons: Refresh and More actions (three dots).
 * Task: Click "More actions" to open its dropdown menu.
 */

import React, { useState } from 'react';
import { Button, Dropdown, Space, Tooltip, Card } from 'antd';
import { ReloadOutlined, MoreOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';
import type { MenuProps } from 'antd';

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuOpenChange = (open: boolean) => {
    setMenuOpen(open);
    if (open) {
      onSuccess();
    }
  };

  const menuItems: MenuProps['items'] = [
    { key: 'export', label: 'Export data' },
    { key: 'import', label: 'Import data' },
    { type: 'divider' },
    { key: 'settings', label: 'Settings' },
    { key: 'help', label: 'Help & Support' },
  ];

  return (
    <Card style={{ width: 300 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 500 }}>Dashboard</span>
        <Space size="small">
          <Tooltip title="Refresh">
            <Button
              type="text"
              size="small"
              icon={<ReloadOutlined />}
              data-testid="antd-btn-refresh"
            />
          </Tooltip>
          <Dropdown
            menu={{ items: menuItems }}
            trigger={['click']}
            open={menuOpen}
            onOpenChange={handleMenuOpenChange}
          >
            <Tooltip title="More actions">
              <Button
                type="text"
                size="small"
                icon={<MoreOutlined />}
                data-testid="antd-btn-more-actions"
                data-overlay-id="antd-dropdown-more-actions"
              />
            </Tooltip>
          </Dropdown>
        </Space>
      </div>
    </Card>
  );
}
