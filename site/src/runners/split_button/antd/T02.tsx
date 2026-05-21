'use client';

/**
 * split_button-antd-T02: Publish: open split-button dropdown menu
 *
 * Layout: isolated card titled "Release controls" centered in the viewport.
 * Target component: one Ant Design `Dropdown.Button` split button with:
 * - Left segment label: "Publish".
 * - Right segment: chevron/arrow that opens the dropdown menu on click.
 *
 * Menu contents: "Publish now", "Schedule…", "Unpublish" (disabled), "Preview"
 * Initial state: Menu is closed.
 *
 * Success: Menu overlay is open (menuOpen=true)
 */

import React, { useState } from 'react';
import { Card, Dropdown, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasTriggeredSuccess, setHasTriggeredSuccess] = useState(false);

  const menuItems: MenuProps['items'] = [
    { key: 'publish_now', label: 'Publish now' },
    { key: 'schedule', label: 'Schedule…' },
    { key: 'unpublish', label: 'Unpublish', disabled: true },
    { key: 'preview', label: 'Preview' },
  ];

  const handleOpenChange = (open: boolean) => {
    setMenuOpen(open);
    if (open && !hasTriggeredSuccess) {
      setHasTriggeredSuccess(true);
      onSuccess();
    }
  };

  return (
    <Card title="Release controls" style={{ width: 400 }}>
      {/* Static distractor */}
      <div style={{ marginBottom: 16, color: '#666', fontSize: 13 }}>
        Status: <span style={{ color: '#faad14', fontWeight: 500 }}>Draft</span>
      </div>

      <div
        data-testid="split-button-root"
        data-menu-open={menuOpen}
      >
        <Dropdown.Button
          menu={{ items: menuItems }}
          onOpenChange={handleOpenChange}
          open={menuOpen}
          icon={<DownOutlined />}
        >
          Publish
        </Dropdown.Button>
      </div>
    </Card>
  );
}
