'use client';

/**
 * context_menu-antd-T01: Open context menu on Quick note
 *
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=1.
 *
 * Target element: a card titled "Quick note" contains a large rectangular note area (like a sticky note)
 * with a few lines of placeholder text. Right-clicking (context click) anywhere inside the note area
 * opens a custom context menu.
 *
 * Context menu: AntD Dropdown with trigger=['contextMenu'] and an AntD Menu as the overlay.
 * Menu items: Copy, Paste (disabled), Rename, Delete.
 *
 * Initial state: the context menu is closed.
 *
 * Success: The custom context menu overlay is open (visible) for the Quick note area.
 */

import React, { useState, useEffect } from 'react';
import { Dropdown, Card } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

const menuItems: MenuProps['items'] = [
  { key: 'copy', label: 'Copy' },
  { key: 'paste', label: 'Paste', disabled: true },
  { key: 'rename', label: 'Rename' },
  { key: 'delete', label: 'Delete' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (menuOpen && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [menuOpen, successTriggered, onSuccess]);

  return (
    <Card title="Quick note" style={{ width: 400 }}>
      <Dropdown
        menu={{ items: menuItems }}
        trigger={['contextMenu']}
        open={menuOpen}
        onOpenChange={setMenuOpen}
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
          data-menu-open={menuOpen}
        >
          <p style={{ margin: 0, color: '#666' }}>
            Remember to review the quarterly report before Friday.
          </p>
          <p style={{ margin: '8px 0 0', color: '#666' }}>
            Call the client to discuss next steps.
          </p>
          <p style={{ margin: '8px 0 0', color: '#999', fontSize: 12 }}>
            Right-click for options
          </p>
        </div>
      </Dropdown>
    </Card>
  );
}
