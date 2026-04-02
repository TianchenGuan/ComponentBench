'use client';

/**
 * context_menu-antd-v2-T10: Report Q4 — Move to → Archive (bottom-right, compact)
 */

import React, { useEffect, useRef, useState } from 'react';
import { Dropdown, Space, Tag } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../../types';

const LABEL: Record<string, string> = {
  move: 'Move to',
  inbox: 'Inbox',
  archive: 'Archive',
  trash: 'Trash',
  share: 'Share',
};

const items: MenuProps['items'] = [
  { key: 'open', label: 'Open' },
  {
    key: 'move',
    label: 'Move to',
    children: [
      { key: 'inbox', label: 'Inbox' },
      { key: 'archive', label: 'Archive' },
      { key: 'trash', label: 'Trash' },
    ],
  },
  {
    key: 'share',
    label: 'Share',
    children: [{ key: 's1', label: 'Copy link' }],
  },
  { key: 'rename', label: 'Rename' },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [path, setPath] = useState<string[] | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      path &&
      path.length === 2 &&
      path[0] === 'Move to' &&
      path[1] === 'Archive'
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
        minHeight: 280,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        width: '100%',
        maxWidth: 480,
        fontSize: 11,
      }}
    >
      <Space wrap style={{ marginBottom: 8, justifyContent: 'flex-end' }}>
        <Tag>Shared</Tag>
        <Tag>Q4</Tag>
      </Space>
      <Dropdown
        menu={{ items, onClick }}
        trigger={['contextMenu']}
        placement="bottomRight"
        overlayStyle={{ fontSize: 12 }}
      >
        <div
          style={{
            padding: '8px 12px',
            border: '1px solid #d9d9d9',
            borderRadius: 6,
            cursor: 'context-menu',
            marginBottom: 4,
          }}
          data-testid="report-q4-row"
        >
          Report Q4
        </div>
      </Dropdown>
      <div style={{ color: '#999', fontSize: 10 }} data-testid="last-path">
        {path?.join(' → ') ?? '—'}
      </div>
    </div>
  );
}
