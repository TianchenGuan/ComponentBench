'use client';

/**
 * context_menu-antd-v2-T16: Build 217 — scroll to Compare with previous snapshot
 */

import React, { useEffect, useRef, useState } from 'react';
import { Dropdown, Space, Tag } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../../types';

const BUILDS = [213, 214, 215, 216, 217, 218, 219, 220];

const items: MenuProps['items'] = [
  {
    type: 'group',
    label: 'Build',
    children: [
      { key: 'Open build', label: 'Open build' },
      { key: 'Copy SHA', label: 'Copy SHA' },
      { key: 'View logs', label: 'View logs' },
    ],
  },
  {
    type: 'group',
    label: 'Compare',
    children: [
      { key: 'Diff to baseline', label: 'Diff to baseline' },
      { key: 'Compare with latest', label: 'Compare with latest' },
      { key: 'Open build 2', label: 'Open build in new tab' },
      { key: 'Download artifacts', label: 'Download artifacts' },
      { key: 'Tag release', label: 'Tag release' },
      { key: 'Compare with previous snapshot', label: 'Compare with previous snapshot' },
      { key: 'Re-run', label: 'Re-run' },
      { key: 'Archive', label: 'Archive' },
    ],
  },
];

export default function T16({ onSuccess }: TaskComponentProps) {
  const [path, setPath] = useState<string[] | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (path?.length === 1 && path[0] === 'Compare with previous snapshot') {
      successFired.current = true;
      onSuccess();
    }
  }, [path, onSuccess]);

  const onClick: MenuProps['onClick'] = ({ key }) => setPath([String(key)]);

  return (
    <div style={{ width: 440, fontSize: 11, display: 'flex', gap: 12 }}>
      <div style={{ flex: 1, color: '#888', fontSize: 10, lineHeight: 1.5 }}>
        Deployment summary · staging · 3 active · last sync 2m
      </div>
      <div
        style={{
          width: 200,
          maxHeight: 240,
          overflow: 'auto',
          border: '1px solid #e8e8e8',
          borderRadius: 8,
          padding: 4,
        }}
        data-testid="build-panel-scroll"
      >
        <div style={{ fontWeight: 600, padding: '4px 6px' }}>Build history</div>
        <Space wrap size={4} style={{ margin: '4px 6px 8px' }}>
          <Tag>main</Tag>
          <Tag>feat</Tag>
        </Space>
        {BUILDS.map((n) => {
          const label = `Build ${n}`;
          return n === 217 ? (
            <Dropdown
              key={n}
              menu={{
                items,
                onClick,
                style: { maxHeight: 180, overflowY: 'auto' },
              }}
              trigger={['contextMenu']}
            >
              <div
                style={{
                  padding: '8px 6px',
                  cursor: 'context-menu',
                  borderRadius: 4,
                  background: '#f5f5f5',
                }}
                data-instance-label={label}
                data-testid="build-217-row"
              >
                {label} · passed
              </div>
            </Dropdown>
          ) : (
            <div
              key={n}
              style={{ padding: '8px 6px', color: '#999' }}
              onContextMenu={(e) => e.preventDefault()}
            >
              {label} · passed
            </div>
          );
        })}
      </div>
    </div>
  );
}
