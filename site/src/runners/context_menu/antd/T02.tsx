'use client';

/**
 * context_menu-antd-T02: Rename from context menu
 *
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1.
 *
 * Target element: the same "Quick note" card as a simple text block inside a large note area.
 * A custom context menu is available only on this note area.
 *
 * Context menu: AntD Dropdown with trigger=['contextMenu'] shows an AntD Menu at the cursor.
 * Menu items: Copy, Paste (disabled), Rename, Delete.
 *
 * Initial state: menu closed; no item has been activated yet (last_activated_item_path is null).
 *
 * Success: The activated context-menu item path equals ['Rename'] for the only menu instance.
 */

import React, { useState, useEffect } from 'react';
import { Dropdown, Card } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

export default function T02({ onSuccess }: TaskComponentProps) {
  const [lastActivatedItem, setLastActivatedItem] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (lastActivatedItem === 'Rename' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [lastActivatedItem, successTriggered, onSuccess]);

  const menuItems: MenuProps['items'] = [
    { key: 'Copy', label: 'Copy' },
    { key: 'Paste', label: 'Paste', disabled: true },
    { key: 'Rename', label: 'Rename' },
    { key: 'Delete', label: 'Delete' },
  ];

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    setLastActivatedItem(key);
  };

  return (
    <Card title="Quick note" style={{ width: 400 }}>
      <Dropdown
        menu={{ items: menuItems, onClick: handleMenuClick }}
        trigger={['contextMenu']}
      >
        <div
          style={{
            width: '100%',
            minHeight: 200,
            background: '#fffbe6',
            border: '1px solid #ffe58f',
            borderRadius: 4,
            padding: 16,
            cursor: 'context-menu',
          }}
          data-testid="context-menu-target"
          data-last-activated={lastActivatedItem}
        >
          <p style={{ margin: 0, color: '#666' }}>
            This is a simple note with some text content.
          </p>
          <p style={{ margin: '8px 0 0', color: '#999', fontSize: 12 }}>
            Right-click for options
          </p>
        </div>
      </Dropdown>
      <div style={{ marginTop: 12, fontSize: 12, color: '#666' }}>
        Last action: <strong data-testid="last-action">{lastActivatedItem || 'None'}</strong>
      </div>
    </Card>
  );
}
