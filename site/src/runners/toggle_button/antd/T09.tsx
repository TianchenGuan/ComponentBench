'use client';

/**
 * toggle_button-antd-T09: Pin a specific row from a table (top-right placement)
 *
 * Layout: table_cell scene anchored toward the top-right of the viewport.
 * Theme is light with comfortable spacing and default scale. Clutter is high.
 *
 * The page contains:
 * - A small filter bar above the table (Search input, Status dropdown, Export button) — distractors only.
 * - An AntD Table with 3 rows: "Invoice #1031", "Invoice #1032", "Invoice #1033".
 * - The last column is "Pin" and contains an AntD Button styled as a toggle button for each row.
 *
 * Toggle semantics per row:
 * - Each "Pin" button has aria-pressed reflecting its state.
 * - Off = default/outline; On = primary/filled.
 *
 * Initial state: all three row Pin toggles are Off.
 * Target instance: the Pin toggle in the row labeled "Invoice #1032" (middle row).
 */

import React, { useState } from 'react';
import { Card, Button, Table, Input, Select, Space } from 'antd';
import { SearchOutlined, ExportOutlined, PushpinOutlined, CheckOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

interface InvoiceRow {
  key: string;
  invoice: string;
  amount: string;
  status: string;
  pinned: boolean;
}

export default function T09({ onSuccess }: TaskComponentProps) {
  const [data, setData] = useState<InvoiceRow[]>([
    { key: '1031', invoice: 'Invoice #1031', amount: '$1,200.00', status: 'Paid', pinned: false },
    { key: '1032', invoice: 'Invoice #1032', amount: '$850.00', status: 'Pending', pinned: false },
    { key: '1033', invoice: 'Invoice #1033', amount: '$2,100.00', status: 'Paid', pinned: false },
  ]);

  const handlePin = (key: string) => {
    setData(prev => prev.map(row => {
      if (row.key === key) {
        const newPinned = !row.pinned;
        // Only trigger success for Invoice #1032 when pinned
        if (key === '1032' && newPinned) {
          onSuccess();
        }
        return { ...row, pinned: newPinned };
      }
      return row;
    }));
  };

  const columns = [
    {
      title: 'Invoice',
      dataIndex: 'invoice',
      key: 'invoice',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Pin',
      key: 'pin',
      render: (_: unknown, record: InvoiceRow) => (
        <Button
          type={record.pinned ? 'primary' : 'default'}
          size="small"
          icon={record.pinned ? <CheckOutlined /> : <PushpinOutlined />}
          onClick={() => handlePin(record.key)}
          aria-pressed={record.pinned}
          data-testid={`pin-${record.key}`}
        >
          Pin
        </Button>
      ),
    },
  ];

  return (
    <Card title="Invoices" style={{ width: 650 }}>
      {/* Filter bar (distractors) */}
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search invoices..."
          prefix={<SearchOutlined />}
          style={{ width: 200 }}
        />
        <Select
          placeholder="Status"
          style={{ width: 120 }}
          options={[
            { value: 'all', label: 'All' },
            { value: 'paid', label: 'Paid' },
            { value: 'pending', label: 'Pending' },
          ]}
        />
        <Button icon={<ExportOutlined />}>Export</Button>
      </Space>

      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        size="middle"
      />
    </Card>
  );
}
