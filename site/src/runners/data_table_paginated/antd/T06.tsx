'use client';

/**
 * data_table_paginated-antd-T06: Orders table: select the row matching a reference card
 *
 * Layout: isolated card centered. The card is split into two columns:
 * • Left: the **Orders** Ant Design Table with pagination and row selection (checkboxes).
 * • Right: a **Reference Order** mini-card that visually summarizes one target order.
 *
 * Reference card details (mixed guidance): shows a customer avatar, a colored Status Tag,
 * and a text badge reading **Order ID A-1042**.
 *
 * Table details: 120 orders total, 10 rows per page. The target order A-1042 is not on page 1;
 * it appears on page 5 (rows 41-50).
 *
 * Initial state: page 1; no filters; no rows selected.
 * Success: selected row matches Order ID A-1042 (exactly that row is selected).
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Avatar, Badge, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import type { TaskComponentProps, OrderRow } from '../types';
import { generateOrderData } from '../types';

const statusColors: Record<OrderRow['status'], string> = {
  Pending: 'orange',
  Shipped: 'blue',
  Delivered: 'green',
  Cancelled: 'red',
  Refunded: 'purple',
};

const columns = [
  { title: 'Order ID', dataIndex: 'orderId', key: 'orderId', width: 100 },
  { title: 'Customer', dataIndex: 'customer', key: 'customer', width: 120 },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: (status: OrderRow['status']) => (
      <Tag color={statusColors[status]}>{status}</Tag>
    ),
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    width: 90,
    render: (total: number) => `$${total.toFixed(2)}`,
  },
  { title: 'Order Date', dataIndex: 'orderDate', key: 'orderDate', width: 100 },
];

export default function T06({ task, onSuccess }: TaskComponentProps) {
  const [dataSource] = useState<OrderRow[]>(() => {
    const data = generateOrderData(120);
    // Ensure A-1042 has specific properties for the reference card
    const targetIdx = data.findIndex(d => d.orderId === 'A-1042');
    if (targetIdx >= 0) {
      data[targetIdx].status = 'Shipped';
      data[targetIdx].customer = 'Diana Miller';
    }
    return data;
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  // Find the reference order
  const referenceOrder = dataSource.find(d => d.orderId === 'A-1042');

  useEffect(() => {
    // Success when exactly A-1042 is selected
    if (
      selectedRowKeys.length === 1 &&
      selectedRowKeys[0] === 'A-1042' &&
      !hasSucceeded
    ) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [selectedRowKeys, hasSucceeded, onSuccess]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => {
      setSelectedRowKeys(keys);
    },
  };

  return (
    <Card title="Orders" style={{ width: 950 }} data-testid="orders-card">
      <div style={{ display: 'flex', gap: 24 }}>
        {/* Left: Table */}
        <div style={{ flex: 1 }}>
          <Table
            rowSelection={rowSelection}
            dataSource={dataSource}
            columns={columns}
            rowKey="orderId"
            pagination={{
              current: currentPage,
              pageSize: 10,
              total: dataSource.length,
              showSizeChanger: false,
              onChange: (page) => setCurrentPage(page),
            }}
            size="small"
            data-testid="orders-table"
            data-selected-rows={JSON.stringify(selectedRowKeys)}
          />
        </div>

        {/* Right: Reference card */}
        <div style={{ width: 200 }}>
          <Card
            size="small"
            title="Reference Order"
            style={{ background: '#fafafa' }}
            data-testid="reference-order-card"
            data-reference-id="ref-order-card-1"
          >
            <Space direction="vertical" align="center" style={{ width: '100%' }}>
              <Avatar size={48} icon={<UserOutlined />} />
              <div style={{ fontWeight: 500 }}>{referenceOrder?.customer}</div>
              <Tag color={statusColors[referenceOrder?.status || 'Pending']}>
                {referenceOrder?.status}
              </Tag>
              <Badge
                count={`Order ID ${referenceOrder?.orderId}`}
                style={{ backgroundColor: '#1677ff' }}
              />
            </Space>
          </Card>
        </div>
      </div>
    </Card>
  );
}
