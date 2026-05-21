'use client';

/**
 * context_menu-antd-v2-T09: Revenue heatmap — scroll to Open diagnostics
 */

import React, { useEffect, useRef, useState } from 'react';
import { Dropdown, Space, Tag } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../../types';

const items: MenuProps['items'] = [
  {
    type: 'group',
    label: 'Data',
    children: [
      { key: 'Refresh', label: 'Refresh' },
      { key: 'Export', label: 'Export slice' },
    ],
  },
  {
    type: 'group',
    label: 'Widget',
    children: [
      { key: 'Duplicate', label: 'Duplicate widget' },
      { key: 'Move up', label: 'Move up' },
      { key: 'Move down', label: 'Move down' },
      { key: 'Pin', label: 'Pin to board' },
      { key: 'Change visualization', label: 'Change visualization' },
      { key: 'Add annotation', label: 'Add annotation' },
      { key: 'Duplicate widget 2', label: 'Duplicate widget (copy)' },
      { key: 'Open settings', label: 'Open settings' },
      { key: 'Compare period', label: 'Compare period' },
      { key: 'Drill down', label: 'Drill down' },
      { key: 'Open diagnostics', label: 'Open diagnostics' },
    ],
  },
];

export default function T09({ onSuccess }: TaskComponentProps) {
  const [path, setPath] = useState<string[] | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (path?.length === 1 && path[0] === 'Open diagnostics') {
      successFired.current = true;
      onSuccess();
    }
  }, [path, onSuccess]);

  const onClick: MenuProps['onClick'] = ({ key }) => setPath([String(key)]);

  return (
    <div style={{ width: 420, fontSize: 11 }}>
      <Space wrap style={{ marginBottom: 6 }}>
        <Tag>Q3</Tag>
        <Tag>Region</Tag>
        <Tag>SKU</Tag>
      </Space>
      <div style={{ display: 'flex', gap: 8 }}>
        <div
          style={{
            flex: 1,
            height: 80,
            background: '#f5f5f5',
            borderRadius: 6,
            padding: 8,
            color: '#999',
          }}
        >
          KPI rail
        </div>
        <Dropdown
          menu={{
            items,
            onClick,
            style: { maxHeight: 200, overflowY: 'auto' },
          }}
          trigger={['contextMenu']}
        >
          <div
            style={{
              width: 160,
              height: 100,
              background: 'linear-gradient(90deg,#ffd6e7,#fff7e6)',
              borderRadius: 6,
              border: '1px solid #ffccc7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              cursor: 'context-menu',
            }}
            data-testid="revenue-heatmap"
          >
            Revenue heatmap
          </div>
        </Dropdown>
      </div>
      <div style={{ marginTop: 6, color: '#999', fontSize: 10 }} data-testid="last-path">
        {path?.[0] ?? '—'}
      </div>
    </div>
  );
}
