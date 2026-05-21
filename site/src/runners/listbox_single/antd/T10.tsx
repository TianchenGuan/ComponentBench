'use client';

/**
 * listbox_single-antd-T10: Invoices table: set status for Invoice #1024
 *
 * Scene: light theme, comfortable spacing, table_cell layout, placed at bottom_right of the viewport.
 * Component scale is default. Page contains 2 instance(s) of this listbox type; guidance is text; clutter is none.
 * A table_cell layout anchors a compact AntD Table near the bottom-right of the viewport. The table has two rows:
 * "Invoice #1024" and "Invoice #1025". In the "Status" column, each row contains a small inline selectable AntD Menu
 * listbox with three options: "Paid", "Pending", "Overdue". Each row's listbox has its own selection highlight.
 * Initial selections: #1024 = "Pending", #1025 = "Paid". The primary challenge is selecting the correct listbox
 * instance in the correct row.
 *
 * Success: Selected option value equals: overdue (in row Invoice #1024)
 * require_correct_instance: true, target_instance_label_or_id: "Row: Invoice #1024 / Column: Status"
 */

import React, { useState } from 'react';
import { Table, Menu, Typography } from 'antd';
import type { MenuProps } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const statusOptions = [
  { key: 'paid', label: 'Paid' },
  { key: 'pending', label: 'Pending' },
  { key: 'overdue', label: 'Overdue' },
];

interface InvoiceRow {
  key: string;
  invoice: string;
  amount: string;
  status: string;
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [statuses, setStatuses] = useState<Record<string, string>>({
    '1024': 'pending',
    '1025': 'paid',
  });

  const handleStatusChange = (invoiceId: string): MenuProps['onSelect'] => ({ key }) => {
    setStatuses(prev => ({ ...prev, [invoiceId]: key }));
    if (invoiceId === '1024' && key === 'overdue') {
      onSuccess();
    }
  };

  const columns = [
    {
      title: 'Invoice',
      dataIndex: 'invoice',
      key: 'invoice',
      render: (text: string) => <Text strong>{text}</Text>,
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
      render: (_: unknown, record: InvoiceRow) => (
        <Menu
          data-cb-listbox-root
          data-cb-instance={`invoice-${record.key}`}
          data-cb-selected-value={statuses[record.key]}
          mode="inline"
          selectedKeys={[statuses[record.key]]}
          onSelect={handleStatusChange(record.key)}
          items={statusOptions.map(opt => ({
            key: opt.key,
            label: <span style={{ fontSize: 12 }}>{opt.label}</span>,
            'data-cb-option-value': opt.key,
          }))}
          style={{ border: 'none', background: 'transparent', minWidth: 120 }}
        />
      ),
    },
  ];

  const data: InvoiceRow[] = [
    { key: '1024', invoice: 'Invoice #1024', amount: '$150.00', status: statuses['1024'] },
    { key: '1025', invoice: 'Invoice #1025', amount: '$275.00', status: statuses['1025'] },
  ];

  return (
    <div style={{ width: 500 }}>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        size="small"
      />
    </div>
  );
}
