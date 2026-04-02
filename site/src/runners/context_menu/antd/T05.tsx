'use client';

/**
 * context_menu-antd-T05: Duplicate the Secondary document
 *
 * Scene: theme=light, spacing=comfortable, layout=isolated_card, placement=center, scale=default, instances=2.
 *
 * Instances: TWO document tiles are shown side-by-side inside the card, each supports its own
 * context menu on right-click:
 * - "Primary document" (left tile)
 * - "Secondary document" (right tile)
 *
 * Target instance: Secondary document.
 *
 * Context menu: each tile is wrapped with an AntD Dropdown trigger=['contextMenu'].
 * Menu items for both tiles: Open, Duplicate, Rename, Delete.
 *
 * Success: The activated item path equals ['Duplicate'] on the context menu instance labeled 'Secondary document'.
 */

import React, { useState, useEffect } from 'react';
import { Dropdown, Card } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

const menuItems: MenuProps['items'] = [
  { key: 'Open', label: 'Open' },
  { key: 'Duplicate', label: 'Duplicate' },
  { key: 'Rename', label: 'Rename' },
  { key: 'Delete', label: 'Delete' },
];

interface DocumentTileProps {
  name: string;
  onMenuClick: (key: string) => void;
  lastActivated: string | null;
}

function DocumentTile({ name, onMenuClick, lastActivated }: DocumentTileProps) {
  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    onMenuClick(key);
  };

  return (
    <Dropdown
      menu={{ items: menuItems, onClick: handleMenuClick }}
      trigger={['contextMenu']}
    >
      <div
        style={{
          flex: 1,
          padding: 24,
          background: '#fafafa',
          border: '1px solid #e8e8e8',
          borderRadius: 8,
          textAlign: 'center',
          cursor: 'context-menu',
        }}
        data-testid={`doc-tile-${name.toLowerCase().replace(' ', '-')}`}
        data-last-activated={lastActivated}
      >
        <FileTextOutlined style={{ fontSize: 48, color: '#1677ff' }} />
        <div style={{ marginTop: 12, fontWeight: 500 }}>{name}</div>
        <div style={{ marginTop: 4, fontSize: 12, color: '#999' }}>
          Right-click for options
        </div>
      </div>
    </Dropdown>
  );
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const [primaryLastActivated, setPrimaryLastActivated] = useState<string | null>(null);
  const [secondaryLastActivated, setSecondaryLastActivated] = useState<string | null>(null);
  const [successTriggered, setSuccessTriggered] = useState(false);

  useEffect(() => {
    if (secondaryLastActivated === 'Duplicate' && !successTriggered) {
      setSuccessTriggered(true);
      onSuccess();
    }
  }, [secondaryLastActivated, successTriggered, onSuccess]);

  return (
    <Card title="Documents" style={{ width: 500 }}>
      <div style={{ display: 'flex', gap: 16 }}>
        <DocumentTile
          name="Primary document"
          onMenuClick={(key) => setPrimaryLastActivated(key)}
          lastActivated={primaryLastActivated}
        />
        <DocumentTile
          name="Secondary document"
          onMenuClick={(key) => setSecondaryLastActivated(key)}
          lastActivated={secondaryLastActivated}
        />
      </div>
      <div style={{ marginTop: 16, fontSize: 12, color: '#666' }}>
        <div>Primary last action: <strong data-testid="primary-last-action">{primaryLastActivated || 'None'}</strong></div>
        <div>Secondary last action: <strong data-testid="secondary-last-action">{secondaryLastActivated || 'None'}</strong></div>
      </div>
    </Card>
  );
}
