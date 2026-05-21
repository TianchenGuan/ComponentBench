'use client';

/**
 * context_menu-antd-T06: Share → Copy link
 *
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1.
 *
 * Target element: a single file row labeled "Design spec" with a file icon.
 * Right-clicking the row opens a context menu.
 *
 * Context menu: AntD Dropdown trigger=['contextMenu'] with a nested AntD Menu.
 * Menu structure:
 * - Open
 * - Share ▸ (submenu)
 *     - Copy link
 *     - Send email
 * - Rename
 * - Delete
 *
 * Success: The activated item path equals ['Share', 'Copy link'] for the Design spec context menu.
 */

import React, { useState, useEffect } from 'react';
import { Dropdown, Card } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [lastActivatedPath, setLastActivatedPath] = useState<string[] | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (
      lastActivatedPath &&
      lastActivatedPath.length === 2 &&
      lastActivatedPath[0] === 'Share' &&
      lastActivatedPath[1] === 'Copy link' &&
      !successTriggered
    ) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [lastActivatedPath, successTriggered, onSuccess]);

  const menuItems: MenuProps['items'] = [
    { key: 'Open', label: 'Open' },
    {
      key: 'Share',
      label: 'Share',
      children: [
        { key: 'Copy link', label: 'Copy link' },
        { key: 'Send email', label: 'Send email' },
      ],
    },
    { key: 'Rename', label: 'Rename' },
    { key: 'Delete', label: 'Delete' },
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key, keyPath }) => {
    // keyPath is reversed: [leaf, ..., parent]
    setLastActivatedPath([...keyPath].reverse());
  };

  return (
    <Card title="Files" style={{ width: 400 }}>
      <Dropdown
        menu={{ items: menuItems, onClick: handleMenuClick }}
        trigger={['contextMenu']}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: 16,
            background: '#fafafa',
            border: '1px solid #e8e8e8',
            borderRadius: 8,
            cursor: 'context-menu',
          }}
          data-testid="file-row"
          data-last-activated-path={lastActivatedPath ? lastActivatedPath.join(' → ') : 'None'}
        >
          <FileTextOutlined style={{ fontSize: 24, color: '#1677ff' }} />
          <div>
            <div style={{ fontWeight: 500 }}>Design spec</div>
            <div style={{ fontSize: 12, color: '#999' }}>Modified 2 days ago</div>
          </div>
        </div>
      </Dropdown>
      <div style={{ marginTop: 16, fontSize: 12, color: '#666' }}>
        Last action path: <strong data-testid="last-action-path">{lastActivatedPath ? lastActivatedPath.join(' → ') : 'None'}</strong>
      </div>
    </Card>
  );
}
