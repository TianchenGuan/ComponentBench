'use client';

/**
 * context_menu-antd-v2-T08: Server 2 — Lock (closed-lock icon cue)
 */

import React, { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { LockOutlined, UnlockOutlined, ReloadOutlined, PoweroffOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../../types';

const SERVERS = ['Server 1', 'Server 2', 'Server 3', 'Server 4'];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [path, setPath] = useState<string[] | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (path?.length === 1 && path[0] === 'Lock') {
      successFired.current = true;
      onSuccess();
    }
  }, [path, onSuccess]);

  const items: MenuProps['items'] = [
    { key: 'Lock', label: 'Lock', icon: <LockOutlined /> },
    { key: 'Unlock', label: 'Unlock', icon: <UnlockOutlined /> },
    { key: 'Restart', label: 'Restart', icon: <ReloadOutlined /> },
    { key: 'Shut down', label: 'Shut down', icon: <PoweroffOutlined /> },
  ];

  const onClick: MenuProps['onClick'] = ({ key }) => setPath([String(key)]);

  return (
    <div style={{ width: 360, fontSize: 11 }}>
      <div style={{ color: '#888', marginBottom: 6 }}>Deployment</div>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          borderRadius: 6,
          background: '#f5f5f5',
          marginBottom: 8,
        }}
        data-testid="reference-lock"
      >
        <LockOutlined /> <span style={{ fontSize: 10, color: '#666' }}>Reference</span>
      </div>
      {SERVERS.map((s) =>
        s === 'Server 2' ? (
          <Dropdown key={s} menu={{ items, onClick }} trigger={['contextMenu']}>
            <div
              style={{
                padding: '8px 10px',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'context-menu',
              }}
              data-instance-label={s}
              data-testid="server-2-row"
            >
              {s}
            </div>
          </Dropdown>
        ) : (
          <div
            key={s}
            style={{ padding: '8px 10px', borderBottom: '1px solid #f0f0f0', color: '#999' }}
            onContextMenu={(e) => e.preventDefault()}
          >
            {s}
          </div>
        ),
      )}
      <div style={{ marginTop: 6, color: '#999', fontSize: 10 }} data-testid="last-path">
        {path?.[0] ?? '—'}
      </div>
    </div>
  );
}
