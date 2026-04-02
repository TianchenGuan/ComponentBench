'use client';

/**
 * table_static-antd-T08: Horizontal scroll to reveal a column, then select a cell
 *
 * A read-only Subscriptions table (Ant Design Table) is shown in an isolated card anchored near the bottom-right
 * of the viewport. The table is intentionally wide with many columns; only the left-most columns (Plan, Seats, Price) are
 * visible initially. A horizontal scrollbar appears at the bottom of the table; the user must scroll horizontally to the
 * right to reveal the "Renewal date" column. Row height is slightly reduced (scale=small) but spacing remains comfortable.
 * Clicking a body cell sets the table's active cell highlight. Initial state: no active cell in the body; Renewal date
 * is not visible without horizontal scrolling.
 */

import React, { useState } from 'react';
import { Table, Card } from 'antd';
import type { TaskComponentProps } from '../types';

interface SubscriptionData {
  key: string;
  plan: string;
  seats: number;
  price: string;
  status: string;
  startDate: string;
  renewalDate: string;
  billingCycle: string;
}

const subscriptionsData: SubscriptionData[] = [
  { key: 'Basic Monthly', plan: 'Basic Monthly', seats: 5, price: '$29/mo', status: 'Active', startDate: '2024-01-15', renewalDate: '2025-01-15', billingCycle: 'Monthly' },
  { key: 'Pro Annual', plan: 'Pro Annual', seats: 25, price: '$199/yr', status: 'Active', startDate: '2024-03-01', renewalDate: '2025-03-01', billingCycle: 'Annual' },
  { key: 'Team Plus', plan: 'Team Plus', seats: 50, price: '$499/mo', status: 'Active', startDate: '2024-06-10', renewalDate: '2025-01-10', billingCycle: 'Monthly' },
  { key: 'Enterprise', plan: 'Enterprise', seats: 200, price: '$1999/yr', status: 'Pending', startDate: '2024-09-01', renewalDate: '2025-09-01', billingCycle: 'Annual' },
  { key: 'Starter', plan: 'Starter', seats: 2, price: '$9/mo', status: 'Cancelled', startDate: '2024-02-20', renewalDate: 'N/A', billingCycle: 'Monthly' },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [activeCell, setActiveCell] = useState<{ rowKey: string; columnKey: string } | null>(null);

  const handleCellClick = (rowKey: string, columnKey: string) => {
    setActiveCell({ rowKey, columnKey });
    if (rowKey === 'Pro Annual' && columnKey === 'renewal_date') {
      onSuccess();
    }
  };

  const createCellProps = (record: SubscriptionData, columnKey: string) => ({
    onClick: () => handleCellClick(record.key, columnKey),
    style: {
      cursor: 'pointer',
      outline: activeCell?.rowKey === record.key && activeCell?.columnKey === columnKey ? '2px solid #1890ff' : undefined,
      outlineOffset: -2,
    },
  });

  const columns = [
    { title: 'Plan', dataIndex: 'plan', key: 'plan', width: 120, onCell: (record: SubscriptionData) => createCellProps(record, 'plan') },
    { title: 'Seats', dataIndex: 'seats', key: 'seats', width: 80, onCell: (record: SubscriptionData) => createCellProps(record, 'seats') },
    { title: 'Price', dataIndex: 'price', key: 'price', width: 100, onCell: (record: SubscriptionData) => createCellProps(record, 'price') },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, onCell: (record: SubscriptionData) => createCellProps(record, 'status') },
    { title: 'Start date', dataIndex: 'startDate', key: 'startDate', width: 120, onCell: (record: SubscriptionData) => createCellProps(record, 'start_date') },
    { title: 'Renewal date', dataIndex: 'renewalDate', key: 'renewalDate', width: 120, onCell: (record: SubscriptionData) => createCellProps(record, 'renewal_date') },
    { title: 'Billing cycle', dataIndex: 'billingCycle', key: 'billingCycle', width: 120, onCell: (record: SubscriptionData) => createCellProps(record, 'billing_cycle') },
  ];

  return (
    <Card 
      style={{ width: 400 }} 
      data-cb-active-cell={activeCell ? `${activeCell.rowKey}|${activeCell.columnKey}` : undefined}
    >
      <div style={{ marginBottom: 12, fontWeight: 500 }}>Subscriptions</div>
      <Table
        dataSource={subscriptionsData}
        columns={columns}
        pagination={false}
        size="small"
        rowKey="key"
        scroll={{ x: 800 }}
      />
    </Card>
  );
}
