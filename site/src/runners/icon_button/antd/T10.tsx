'use client';

/**
 * icon_button-antd-T10: Pin a specific table row (Invoice #2041)
 *
 * Layout: table_cell centered in the viewport.
 * A small Ant Design table titled "Invoices" with three rows.
 * Each row has a "Pin" column with an icon-only AntD Button (pushpin icon).
 * Initial state: all rows are unpinned (aria-pressed="false").
 * 
 * Success: The pin icon button in the row "Invoice #2041" has aria-pressed="true".
 */

import React, { useState } from 'react';
import { Button, Card, Table, Tag } from 'antd';
import { PushpinOutlined, PushpinFilled } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

interface InvoiceRow {
  key: string;
  id: string;
  amount: string;
  date: string;
}

const data: InvoiceRow[] = [
  { key: '2039', id: 'Invoice #2039', amount: '$1,250.00', date: 'Jan 15, 2024' },
  { key: '2041', id: 'Invoice #2041', amount: '$3,750.00', date: 'Jan 18, 2024' },
  { key: '2042', id: 'Invoice #2042', amount: '$890.00', date: 'Jan 20, 2024' },
];

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [pinnedRows, setPinnedRows] = useState<Set<string>>(new Set());

  const handlePin = (key: string) => {
    setPinnedRows(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
        if (key === '2041') {
          onSuccess();
        }
      }
      return next;
    });
  };

  const columns = [
    {
      title: 'Invoice',
      dataIndex: 'id',
      key: 'id',
      render: (text: string, record: InvoiceRow) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>{text}</span>
          {pinnedRows.has(record.key) && (
            <Tag color="blue" style={{ margin: 0, fontSize: 10 }}>Pinned</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Pin',
      key: 'pin',
      width: 80,
      render: (_: unknown, record: InvoiceRow) => {
        const isPinned = pinnedRows.has(record.key);
        return (
          <Button
            type="text"
            size="small"
            icon={isPinned ? <PushpinFilled style={{ color: '#1677ff' }} /> : <PushpinOutlined />}
            onClick={() => handlePin(record.key)}
            aria-pressed={isPinned}
            aria-label={`Pin ${record.id}`}
            data-testid={`antd-icon-btn-pin-${record.key}`}
          />
        );
      },
    },
  ];

  return (
    <Card title="Invoices" style={{ width: 550 }}>
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        size="small"
      />
    </Card>
  );
}
