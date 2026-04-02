'use client';

/**
 * context_menu-antd-T03: Enable Show caption checkbox
 *
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1.
 *
 * Target element: a card titled "Photo preview" shows a small image placeholder.
 * The card body (image area) supports a custom context menu on right-click.
 *
 * Context menu: AntD Dropdown trigger=['contextMenu'] with an AntD Menu overlay.
 * One of the items is checkable and shows a checkmark when enabled.
 *
 * Menu items: Open, Show caption (checkable), Download.
 *
 * Initial state: Show caption is OFF (unchecked). The caption text under the photo is hidden.
 *
 * Success: The context menu checked state for 'Show caption' is true (ON).
 */

import React, { useState, useEffect } from 'react';
import { Dropdown, Card } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T03({ onSuccess }: TaskComponentProps) {
  const [showCaption, setShowCaption] = useState(false);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (showCaption && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [showCaption, successTriggered, onSuccess]);

  const menuItems: MenuProps['items'] = [
    { key: 'open', label: 'Open' },
    {
      key: 'show-caption',
      label: 'Show caption',
      icon: showCaption ? <CheckOutlined /> : null,
    },
    { key: 'download', label: 'Download' },
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'show-caption') {
      setShowCaption((prev) => !prev);
    }
  };

  return (
    <Card title="Photo preview" style={{ width: 350 }}>
      <Dropdown
        menu={{ items: menuItems, onClick: handleMenuClick }}
        trigger={['contextMenu']}
      >
        <div
          style={{
            width: '100%',
            height: 200,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'context-menu',
          }}
          data-testid="photo-area"
          data-show-caption={showCaption}
        >
          <span style={{ color: '#fff', fontSize: 48 }}>🖼️</span>
        </div>
      </Dropdown>
      {showCaption && (
        <div
          style={{ marginTop: 8, fontSize: 14, color: '#666', textAlign: 'center' }}
          data-testid="caption"
        >
          Sunset over the mountains - Summer 2024
        </div>
      )}
      {!showCaption && (
        <div style={{ marginTop: 8, fontSize: 12, color: '#999', textAlign: 'center' }}>
          Right-click to show caption
        </div>
      )}
    </Card>
  );
}
