'use client';

/**
 * context_menu-antd-v2-T06: bundle.tar.gz — Copy signed URL (Ctrl+Shift+U reference)
 */

import React, { useEffect, useRef, useState } from 'react';
import { Dropdown, Space } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../../types';

const FILES = ['notes.md', 'bundle.tar.gz', 'config.json'];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [path, setPath] = useState<string[] | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (path?.length === 1 && path[0] === 'Copy signed URL') {
      successFired.current = true;
      onSuccess();
    }
  }, [path, onSuccess]);

  const items: MenuProps['items'] = [
    { key: 'copy', label: 'Copy', extra: <span style={{ opacity: 0.45 }}>Ctrl+C</span> },
    { key: 'copy-path', label: 'Copy path', extra: <span style={{ opacity: 0.45 }}>Ctrl+Shift+P</span> },
    {
      key: 'copy-signed',
      label: 'Copy signed URL',
      extra: <span style={{ opacity: 0.45 }}>Ctrl+Shift+U</span>,
    },
    { key: 'copy-md', label: 'Copy as Markdown', extra: <span style={{ opacity: 0.45 }}>Ctrl+M</span> },
    { key: 'open-tab', label: 'Open in new tab', extra: <span style={{ opacity: 0.45 }}>Ctrl+Enter</span> },
  ];

  const onClick: MenuProps['onClick'] = ({ key }) => {
    const map: Record<string, string> = {
      copy: 'Copy',
      'copy-path': 'Copy path',
      'copy-signed': 'Copy signed URL',
      'copy-md': 'Copy as Markdown',
      'open-tab': 'Open in new tab',
    };
    setPath([map[key] ?? key]);
  };

  return (
    <div style={{ width: 380, fontSize: 11 }}>
      <div
        style={{
          display: 'inline-block',
          padding: '4px 10px',
          borderRadius: 12,
          background: '#f5f5f5',
          marginBottom: 8,
          fontSize: 10,
        }}
        data-testid="reference-pill"
      >
        Reference · Ctrl+Shift+U · Copy signed URL
      </div>
      <Space direction="vertical" style={{ width: '100%' }} size={4}>
        {FILES.map((name) =>
          name === 'bundle.tar.gz' ? (
            <Dropdown key={name} menu={{ items, onClick }} trigger={['contextMenu']}>
              <div
                style={{
                  padding: '8px 10px',
                  border: '1px solid #d9d9d9',
                  borderRadius: 6,
                  cursor: 'context-menu',
                }}
                data-instance-label={name}
                data-testid="file-bundle"
              >
                {name} <span style={{ color: '#999', marginLeft: 8 }}>12 MB</span>
              </div>
            </Dropdown>
          ) : (
            <div
              key={name}
              style={{ padding: '8px 10px', border: '1px solid #eee', borderRadius: 6, color: '#999' }}
              onContextMenu={(e) => e.preventDefault()}
            >
              {name}
            </div>
          ),
        )}
      </Space>
      <div style={{ marginTop: 6, color: '#999', fontSize: 10 }} data-testid="last-path">
        {path?.join(' › ') ?? '—'}
      </div>
    </div>
  );
}
