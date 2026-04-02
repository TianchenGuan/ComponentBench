'use client';

/**
 * context_menu-antd-v2-T12: Secondary draft — Duplicate from crowded shelf
 */

import React, { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'antd';
import { FileOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../../types';

const DOCS = ['Primary spec', 'Secondary draft', 'Notes', 'Archive copy'] as const;

export default function T12({ onSuccess }: TaskComponentProps) {
  const [path, setPath] = useState<string[] | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (path?.length === 1 && path[0] === 'Duplicate') {
      successFired.current = true;
      onSuccess();
    }
  }, [path, onSuccess]);

  const items: MenuProps['items'] = [
    { key: 'Open', label: 'Open' },
    { key: 'Duplicate', label: 'Duplicate' },
    { key: 'Rename', label: 'Rename' },
    { key: 'Delete', label: 'Delete', danger: true },
  ];

  const onClick: MenuProps['onClick'] = ({ key }) => setPath([String(key)]);

  return (
    <div style={{ width: 400, fontSize: 11 }}>
      <div style={{ color: '#888', marginBottom: 6 }}>Document shelf</div>
      <div
        style={{
          maxHeight: 200,
          overflow: 'auto',
          border: '1px solid #e8e8e8',
          borderRadius: 8,
          padding: 8,
        }}
        data-testid="shelf-scroll"
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {DOCS.map((title) =>
            title === 'Secondary draft' ? (
              <Dropdown key={title} menu={{ items, onClick }} trigger={['contextMenu']}>
                <div
                  style={{
                    width: 160,
                    padding: 8,
                    border: '1px solid #d9d9d9',
                    borderRadius: 6,
                    cursor: 'context-menu',
                    background: '#fafafa',
                  }}
                  data-instance-label={title}
                  data-testid="tile-secondary-draft"
                >
                  <FileOutlined style={{ fontSize: 20, color: '#1677ff' }} />
                  <div style={{ fontWeight: 600, marginTop: 4 }}>{title}</div>
                  <div style={{ fontSize: 9, color: '#999', marginTop: 2 }}>Draft · 2h ago</div>
                  <div style={{ fontSize: 9, color: '#ccc', marginTop: 4, lineHeight: 1.3 }}>
                    Lorem ipsum dolor sit amet, consectetur elit…
                  </div>
                </div>
              </Dropdown>
            ) : (
              <div
                key={title}
                style={{
                  width: 160,
                  padding: 8,
                  border: '1px solid #eee',
                  borderRadius: 6,
                  opacity: 0.85,
                }}
                onContextMenu={(e) => e.preventDefault()}
              >
                <FileOutlined style={{ fontSize: 20, color: '#999' }} />
                <div style={{ fontWeight: 600, marginTop: 4 }}>{title}</div>
                <div style={{ fontSize: 9, color: '#999', marginTop: 2 }}>Preview…</div>
              </div>
            ),
          )}
        </div>
      </div>
      <div style={{ marginTop: 6, color: '#999', fontSize: 10 }} data-testid="last-path">
        {path?.[0] ?? '—'}
      </div>
    </div>
  );
}
