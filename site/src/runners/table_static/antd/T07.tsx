'use client';

/**
 * table_static-antd-T07: Select the row that matches a reference card (mixed guidance)
 *
 * A centered isolated card shows an Orders table (Ant Design Table), read-only, with columns: Order, Customer,
 * Total, and Badge. Above the table, a small 'Reference card' displays a gold "VIP" tag and the total "$128.40" (mixed
 * visual + text cue). Within the table, several rows have colored badge tags (VIP, Standard, Trial) and dollar totals; at
 * least one distractor row has a similar total (e.g., $128.04). Clicking a row highlights it (single-select). Initial state:
 * no row selected. No sorting/pagination.
 */

import React, { useState } from 'react';
import { Table, Card, Tag } from 'antd';
import type { TaskComponentProps } from '../types';

interface OrderData {
  key: string;
  order: string;
  customer: string;
  total: string;
  badge: 'VIP' | 'Standard' | 'Trial';
}

const ordersData: OrderData[] = [
  { key: 'ORD-2228', order: 'ORD-2228', customer: 'Alice Johnson', total: '$128.04', badge: 'Standard' },
  { key: 'ORD-2229', order: 'ORD-2229', customer: 'Bob Smith', total: '$245.00', badge: 'VIP' },
  { key: 'ORD-2230', order: 'ORD-2230', customer: 'Carol White', total: '$128.40', badge: 'Trial' },
  { key: 'ORD-2231', order: 'ORD-2231', customer: 'David Brown', total: '$128.40', badge: 'VIP' },
  { key: 'ORD-2232', order: 'ORD-2232', customer: 'Eva Green', total: '$89.99', badge: 'Standard' },
  { key: 'ORD-2233', order: 'ORD-2233', customer: 'Frank Miller', total: '$128.40', badge: 'Standard' },
  { key: 'ORD-2234', order: 'ORD-2234', customer: 'Grace Lee', total: '$312.50', badge: 'VIP' },
  { key: 'ORD-2235', order: 'ORD-2235', customer: 'Henry Davis', total: '$67.25', badge: 'Trial' },
];

const getBadgeColor = (badge: string) => {
  switch (badge) {
    case 'VIP': return 'gold';
    case 'Standard': return 'blue';
    case 'Trial': return 'green';
    default: return 'default';
  }
};

const columns = [
  { title: 'Order', dataIndex: 'order', key: 'order' },
  { title: 'Customer', dataIndex: 'customer', key: 'customer' },
  { title: 'Total', dataIndex: 'total', key: 'total' },
  { 
    title: 'Badge', 
    dataIndex: 'badge', 
    key: 'badge',
    render: (badge: string) => <Tag color={getBadgeColor(badge)}>{badge}</Tag>,
  },
];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);

  const handleRowClick = (record: OrderData) => {
    setSelectedRowKey(record.key);
    if (record.key === 'ORD-2231') {
      onSuccess();
    }
  };

  return (
    <Card style={{ width: 650 }}>
      {/* Reference card */}
      <div 
        style={{ 
          marginBottom: 16, 
          padding: 12, 
          background: '#fafafa', 
          borderRadius: 6,
          border: '1px dashed #d9d9d9',
        }}
        data-reference-id="ref-vip-12840"
      >
        <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Reference card</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Tag color="gold">VIP</Tag>
          <span style={{ fontWeight: 500 }}>$128.40</span>
        </div>
      </div>

      <div style={{ marginBottom: 12, fontWeight: 500 }}>Orders</div>
      <Table
        dataSource={ordersData}
        columns={columns}
        pagination={false}
        size="middle"
        rowKey="key"
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          'aria-selected': selectedRowKey === record.key,
          'data-row-key': record.key,
          style: {
            cursor: 'pointer',
            background: selectedRowKey === record.key ? '#e6f7ff' : undefined,
          },
        })}
      />
    </Card>
  );
}
