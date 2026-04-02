'use client';

/**
 * context_menu-antd-v2-T02: Shard 3 — Move → Under Archive → As child
 */

import React, { useEffect, useRef, useState } from 'react';
import { Dropdown, Switch, Alert, Space } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../../types';

const LABEL: Record<string, string> = {
  move: 'Move',
  'under-archive': 'Under Archive',
  'as-sibling': 'As sibling',
  'as-child': 'As child',
  rename: 'Rename',
  inspect: 'Inspect',
};

const menuItems: MenuProps['items'] = [
  {
    key: 'move',
    label: 'Move',
    children: [
      {
        key: 'under-archive',
        label: 'Under Archive',
        children: [
          { key: 'as-sibling', label: 'As sibling' },
          { key: 'as-child', label: 'As child' },
        ],
      },
    ],
  },
  { key: 'rename', label: 'Rename' },
  { key: 'inspect', label: 'Inspect' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [path, setPath] = useState<string[] | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      path &&
      path.length === 3 &&
      path[0] === 'Move' &&
      path[1] === 'Under Archive' &&
      path[2] === 'As child'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [path, onSuccess]);

  const onClick: MenuProps['onClick'] = ({ keyPath }) => {
    const ordered = [...keyPath].reverse().map((k) => LABEL[k] ?? k);
    setPath(ordered);
  };

  const nodes = ['Cluster A', 'Shard 1', 'Shard 2', 'Shard 3', 'Archive'];

  return (
    <div style={{ width: 360, fontSize: 11 }}>
      <Alert type="info" message="Service tree" showIcon style={{ marginBottom: 8, fontSize: 11 }} />
      <Space wrap style={{ marginBottom: 8 }}>
        <span>Auto-restart</span>
        <Switch size="small" defaultChecked />
        <span>TLS</span>
        <Switch size="small" />
      </Space>
      <div style={{ border: '1px solid #d9d9d9', borderRadius: 6, padding: 8 }}>
        {nodes.map((name) =>
          name === 'Shard 3' ? (
            <Dropdown
              key={name}
              menu={{ items: menuItems, onClick }}
              trigger={['contextMenu']}
            >
              <div
                style={{ padding: '4px 0', cursor: 'context-menu' }}
                data-instance-label="Shard 3"
                data-testid="shard-3-node"
              >
                ◇ {name}
              </div>
            </Dropdown>
          ) : (
            <div
              key={name}
              style={{ padding: '4px 0', color: '#666' }}
              onContextMenu={(e) => e.preventDefault()}
            >
              ◇ {name}
            </div>
          ),
        )}
      </div>
      <div style={{ marginTop: 6, color: '#999', fontSize: 10 }} data-testid="last-path">
        {path?.join(' → ') ?? '—'}
      </div>
    </div>
  );
}
