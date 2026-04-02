'use client';

/**
 * context_menu-antd-v2-T13: press-kit.zip — Share → Copy public link (globe icon)
 */

import React, { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { GlobalOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../../types';

const PKGS = ['deps.tar', 'press-kit.zip', 'assets.zip'];

const LABEL: Record<string, string> = {
  share: 'Share',
  public: 'Copy public link',
  private: 'Copy private link',
  email: 'Email link',
};

export default function T13({ onSuccess }: TaskComponentProps) {
  const [path, setPath] = useState<string[] | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (path?.length === 2 && path[0] === 'Share' && path[1] === 'Copy public link') {
      successFired.current = true;
      onSuccess();
    }
  }, [path, onSuccess]);

  const items: MenuProps['items'] = [
    { key: 'open', label: 'Open' },
    {
      key: 'share',
      label: 'Share',
      children: [
        { key: 'public', label: 'Copy public link', icon: <GlobalOutlined /> },
        { key: 'private', label: 'Copy private link', icon: <LockOutlined /> },
        { key: 'email', label: 'Email link', icon: <MailOutlined /> },
      ],
    },
    { key: 'rename', label: 'Rename' },
    { key: 'delete', label: 'Delete', danger: true },
  ];

  const onClick: MenuProps['onClick'] = ({ keyPath }) => {
    const ordered = [...keyPath].reverse().map((k) => LABEL[k] ?? k);
    setPath(ordered);
  };

  return (
    <div style={{ width: 380, fontSize: 11 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 10px',
          background: '#f5f5f5',
          borderRadius: 6,
          marginBottom: 8,
        }}
        data-testid="reference-globe"
      >
        <GlobalOutlined />
        <span>Copy public link</span>
      </div>
      {PKGS.map((name) =>
        name === 'press-kit.zip' ? (
          <Dropdown key={name} menu={{ items, onClick }} trigger={['contextMenu']}>
            <div
              style={{
                padding: '10px 8px',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'context-menu',
              }}
              data-instance-label={name}
              data-testid="pkg-press-kit"
            >
              {name}
            </div>
          </Dropdown>
        ) : (
          <div
            key={name}
            style={{ padding: '10px 8px', borderBottom: '1px solid #f0f0f0', color: '#999' }}
            onContextMenu={(e) => e.preventDefault()}
          >
            {name}
          </div>
        ),
      )}
      <div style={{ marginTop: 6, color: '#999', fontSize: 10 }} data-testid="last-path">
        {path?.join(' → ') ?? '—'}
      </div>
    </div>
  );
}
