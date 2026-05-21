'use client';

/**
 * context_menu-antd-T07: Move to → Archive in compact small menu
 *
 * Scene: theme=light, spacing=compact, layout=isolated_card, placement=center, scale=small, instances=1.
 *
 * Target element: a single file row labeled "Report Q4". Right-clicking opens the context menu.
 *
 * Context menu: AntD Dropdown trigger=['contextMenu'] + nested AntD Menu.
 * COMPACT spacing mode and SMALL size tier (reduced padding and font size).
 *
 * Menu structure:
 * - Open
 * - Move to ▸ (submenu)
 *     - Inbox
 *     - Archive
 *     - Trash
 * - Rename
 *
 * Success: The activated item path equals ['Move to', 'Archive'] for the Report Q4 context menu.
 */

import React, { useState, useEffect } from 'react';
import { Dropdown, Card, ConfigProvider } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T07({ onSuccess }: TaskComponentProps) {
  const [lastActivatedPath, setLastActivatedPath] = useState<string[] | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (
      lastActivatedPath &&
      lastActivatedPath.length === 2 &&
      lastActivatedPath[0] === 'Move to' &&
      lastActivatedPath[1] === 'Archive' &&
      !successTriggered
    ) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [lastActivatedPath, successTriggered, onSuccess]);

  const menuItems: MenuProps['items'] = [
    { key: 'Open', label: 'Open' },
    {
      key: 'Move to',
      label: 'Move to',
      children: [
        { key: 'Inbox', label: 'Inbox' },
        { key: 'Archive', label: 'Archive' },
        { key: 'Trash', label: 'Trash' },
      ],
    },
    { key: 'Rename', label: 'Rename' },
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key, keyPath }) => {
    setLastActivatedPath([...keyPath].reverse());
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: 12,
          padding: 8,
          paddingXS: 4,
          paddingSM: 6,
        },
      }}
    >
      <Card
        title="Files"
        size="small"
        style={{ width: 320 }}
        styles={{ body: { padding: 12 } }}
      >
        <Dropdown
          menu={{ items: menuItems, onClick: handleMenuClick }}
          trigger={['contextMenu']}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: 10,
              background: '#fafafa',
              border: '1px solid #e8e8e8',
              borderRadius: 6,
              cursor: 'context-menu',
              fontSize: 12,
            }}
            data-testid="file-row"
            data-last-activated-path={lastActivatedPath ? lastActivatedPath.join(' → ') : 'None'}
          >
            <FileTextOutlined style={{ fontSize: 18, color: '#1677ff' }} />
            <div>
              <div style={{ fontWeight: 500 }}>Report Q4</div>
              <div style={{ fontSize: 10, color: '#999' }}>Modified yesterday</div>
            </div>
          </div>
        </Dropdown>
        <div style={{ marginTop: 10, fontSize: 10, color: '#666' }}>
          Last action path: <strong data-testid="last-action-path">{lastActivatedPath ? lastActivatedPath.join(' → ') : 'None'}</strong>
        </div>
      </Card>
    </ConfigProvider>
  );
}
