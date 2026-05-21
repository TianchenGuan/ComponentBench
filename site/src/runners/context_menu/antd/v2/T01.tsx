'use client';

/**
 * context_menu-antd-v2-T01: Gamma cell — scroll to Export as CSV from compact table menu
 */

import React, { useEffect, useRef, useState } from 'react';
import { Dropdown, Table, Space, Tag } from 'antd';
import type { MenuProps, TableColumnsType } from 'antd';
import type { TaskComponentProps } from '../../types';

interface Row {
  key: string;
  name: string;
  c1: number;
  c2: number;
  total: number;
}

const rows: Row[] = [
  { key: 'a', name: 'Alpha', c1: 10, c2: 20, total: 30 },
  { key: 'b', name: 'Beta', c1: 5, c2: 15, total: 20 },
  { key: 'g', name: 'Gamma', c1: 8, c2: 12, total: 20 },
  { key: 'd', name: 'Delta', c1: 3, c2: 7, total: 10 },
];

const longMenuItems: MenuProps['items'] = [
  { key: 'Copy', label: 'Copy' },
  { key: 'Copy as JSON', label: 'Copy as JSON' },
  { key: 'Pin column', label: 'Pin column' },
  { key: 'Hide column', label: 'Hide column' },
  { type: 'divider' },
  { key: 'Sort ascending', label: 'Sort ascending' },
  { key: 'Sort descending', label: 'Sort descending' },
  { type: 'divider' },
  { key: 'Export as PDF', label: 'Export as PDF' },
  { key: 'Export as Excel', label: 'Export as Excel' },
  { key: 'Copy as Markdown', label: 'Copy as Markdown' },
  { key: 'Aggregate values', label: 'Aggregate values' },
  { key: 'Group by column', label: 'Group by column' },
  { key: 'Filter by value', label: 'Filter by value' },
  { key: 'Clear filter', label: 'Clear filter' },
  { key: 'Unpin column', label: 'Unpin column' },
  { key: 'Show all columns', label: 'Show all columns' },
  { key: 'Clear sorting', label: 'Clear sorting' },
  { type: 'divider' },
  { key: 'Export as CSV', label: 'Export as CSV' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [lastPath, setLastPath] = useState<string[] | null>(null);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (lastPath?.length === 1 && lastPath[0] === 'Export as CSV') {
      successFired.current = true;
      onSuccess();
    }
  }, [lastPath, onSuccess]);

  const handleClick: MenuProps['onClick'] = ({ key }) => {
    setLastPath([key === 'Export as CSV' ? 'Export as CSV' : String(key)]);
  };

  const columns: TableColumnsType<Row> = [
    { title: 'Row', dataIndex: 'name', key: 'name', width: 72 },
    { title: 'A', dataIndex: 'c1', key: 'c1', align: 'right', width: 48 },
    { title: 'B', dataIndex: 'c2', key: 'c2', align: 'right', width: 48 },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      align: 'right',
      width: 56,
      render: (v: number, record) =>
        record.name === 'Gamma' ? (
          <Dropdown
            menu={{
              items: longMenuItems,
              onClick: handleClick,
              style: { maxHeight: 220, overflowY: 'auto' },
            }}
            trigger={['contextMenu']}
          >
            <span
              style={{ cursor: 'context-menu', display: 'block' }}
              data-testid="gamma-total-cell"
              data-instance-label="Gamma__Total"
            >
              {v}
            </span>
          </Dropdown>
        ) : (
          <span>{v}</span>
        ),
    },
  ];

  return (
    <div style={{ width: 420, fontSize: 11 }}>
      <Space size={4} wrap style={{ marginBottom: 6 }}>
        <Tag>Status</Tag>
        <Tag>Region</Tag>
        <Tag>Team</Tag>
      </Space>
      <div style={{ color: '#888', marginBottom: 4 }}>Summary · 4 rows · compact</div>
      <Table<Row>
        size="small"
        pagination={false}
        bordered
        dataSource={rows}
        columns={columns}
        data-testid="compact-table"
      />
      <div style={{ marginTop: 6, color: '#999', fontSize: 10 }}>
        Last: <span data-testid="last-path">{lastPath?.join(' › ') ?? '—'}</span>
      </div>
    </div>
  );
}
