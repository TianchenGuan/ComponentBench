'use client';

/**
 * context_menu-antd-v2-T14: Rectangle 1 — Transform → Rotate → 90° clockwise
 */

import React, { useEffect, useRef, useState } from 'react';
import { Dropdown, Space, Tag } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../../types';

const LABEL: Record<string, string> = {
  transform: 'Transform',
  rotate: 'Rotate',
  cw: '90° clockwise',
  ccw: '90° counterclockwise',
  deg180: '180°',
  flip: 'Flip',
  fh: 'Horizontal',
  fv: 'Vertical',
};

const items: MenuProps['items'] = [
  { key: 'dup', label: 'Duplicate' },
  {
    key: 'transform',
    label: 'Transform',
    children: [
      {
        key: 'rotate',
        label: 'Rotate',
        children: [
          { key: 'cw', label: '90° clockwise' },
          { key: 'ccw', label: '90° counterclockwise' },
          { key: 'deg180', label: '180°' },
        ],
      },
      {
        key: 'flip',
        label: 'Flip',
        children: [
          { key: 'fh', label: 'Horizontal' },
          { key: 'fv', label: 'Vertical' },
        ],
      },
    ],
  },
  { key: 'del', label: 'Delete', danger: true },
];

export default function T14({ onSuccess }: TaskComponentProps) {
  const [path, setPath] = useState<string[] | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      path &&
      path.length === 3 &&
      path[0] === 'Transform' &&
      path[1] === 'Rotate' &&
      path[2] === '90° clockwise'
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [path, onSuccess]);

  const onClick: MenuProps['onClick'] = ({ keyPath }) => {
    const ordered = [...keyPath].reverse().map((k) => LABEL[k] ?? k);
    setPath(ordered);
  };

  return (
    <div
      style={{
        width: 400,
        minHeight: 220,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        fontSize: 11,
      }}
    >
      <Space style={{ marginBottom: 8 }}>
        <Tag>Vector</Tag>
        <span style={{ color: '#888' }}>x: 12 · y: 88</span>
      </Space>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <Tag>Layer 1</Tag>
        <Tag>Layer 2</Tag>
      </div>
      <Dropdown menu={{ items, onClick }} trigger={['contextMenu']}>
        <div
          style={{
            width: 72,
            height: 48,
            background: '#91caff',
            border: '1px solid #1677ff',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            fontWeight: 600,
            cursor: 'context-menu',
          }}
          data-testid="shape-rectangle-1"
        >
          Rectangle 1
        </div>
      </Dropdown>
      <div style={{ marginTop: 8, color: '#999', fontSize: 10 }} data-testid="last-path">
        {path?.join(' → ') ?? '—'}
      </div>
    </div>
  );
}
