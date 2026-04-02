'use client';

/**
 * select_custom_single-antd-T08: Change Order #1042 status to Delayed in table
 *
 * Layout: table_cell scene with a compact density mode.
 * A table titled "Orders" is centered on the page. Spacing is compact and the selects are rendered in small size.
 *
 * There are three visible rows: Order #1041, Order #1042, Order #1043.
 * Each row has a "Status" column implemented with an Ant Design Select (small size) embedded inside the table cell.
 *
 * Instances: 3 total selects (one per row).
 * Initial states:
 * - #1041 Status: Pending
 * - #1042 Status: Shipped
 * - #1043 Status: Pending
 *
 * Dropdown options for each Status select: Pending, Shipped, Delayed, Cancelled.
 *
 * Clutter: the table also has a header row with sortable column headers and a small "Filter" button above the table.
 * These are distractors and do not affect success.
 *
 * Feedback: selecting an option immediately updates the value shown in the corresponding cell; no Apply/OK button.
 *
 * Success: The Status Select in the row labeled "Order #1042" has selected value exactly "Delayed".
 */

import React, { useState } from 'react';
import { Card, Select, Table, Button, Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import type { TaskComponentProps } from '../types';

const statusOptions = [
  { label: 'Pending', value: 'Pending' },
  { label: 'Shipped', value: 'Shipped' },
  { label: 'Delayed', value: 'Delayed' },
  { label: 'Cancelled', value: 'Cancelled' },
];

interface OrderData {
  key: string;
  orderId: string;
  status: string;
  date: string;
  amount: string;
}

export default function T08({ onSuccess }: TaskComponentProps) {
  const [statuses, setStatuses] = useState<Record<string, string>>({
    '1041': 'Pending',
    '1042': 'Shipped',
    '1043': 'Pending',
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setStatuses(prev => ({ ...prev, [orderId]: newStatus }));
    if (orderId === '1042' && newStatus === 'Delayed') {
      onSuccess();
    }
  };

  const data: OrderData[] = [
    { key: '1041', orderId: 'Order #1041', status: statuses['1041'], date: '2024-01-15', amount: '$125.00' },
    { key: '1042', orderId: 'Order #1042', status: statuses['1042'], date: '2024-01-16', amount: '$89.50' },
    { key: '1043', orderId: 'Order #1043', status: statuses['1043'], date: '2024-01-17', amount: '$234.00' },
  ];

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      sorter: true,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: true,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      sorter: true,
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: unknown, record: OrderData) => (
        <Select
          data-testid={`status-select-${record.key}`}
          size="small"
          value={statuses[record.key]}
          onChange={(value) => handleStatusChange(record.key, value)}
          options={statusOptions}
          style={{ width: 110 }}
        />
      ),
    },
  ];

  return (
    <Card title="Orders" style={{ width: 700 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button size="small" icon={<FilterOutlined />}>Filter</Button>
      </Space>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        size="small"
      />
    </Card>
  );
}
