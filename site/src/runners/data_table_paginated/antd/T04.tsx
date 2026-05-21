'use client';

/**
 * data_table_paginated-antd-T04: Orders table: select one row by Order ID
 *
 * Layout: isolated card centered, titled **Orders**.
 * Component: Ant Design Table with a leading checkbox selection column (rowSelection enabled).
 * Each row has a stable `rowKey` equal to the Order ID (e.g., A-1007).
 * Initial state: page 1, page size 10, sorted by Order ID ascending so A-1007 is visible on page 1.
 * No rows are selected.
 * Success: exactly one row is selected: Order ID A-1007.
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Tag } from 'antd';
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
  { title: 'Order ID', dataIndex: 'orderId', key: 'orderId', width: 120 },
  { title: 'Customer', dataIndex: 'customer', key: 'customer', width: 150 },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 110,
    render: (status: OrderRow['status']) => (
      <Tag color={statusColors[status]}>{status}</Tag>
    ),
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    width: 100,
    render: (total: number) => `$${total.toFixed(2)}`,
  },
  { title: 'Order Date', dataIndex: 'orderDate', key: 'orderDate', width: 120 },
];

export default function T04({ task, onSuccess }: TaskComponentProps) {
  const [dataSource] = useState<OrderRow[]>(() => {
    // Generate data and sort by Order ID ascending
    return generateOrderData(120).sort((a, b) => a.orderId.localeCompare(b.orderId));
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  useEffect(() => {
    // Success when exactly A-1007 is selected
    if (
      selectedRowKeys.length === 1 &&
      selectedRowKeys[0] === 'A-1007' &&
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
    <Card title="Orders" style={{ width: 800 }} data-testid="orders-card">
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
        size="middle"
        data-testid="orders-table"
        data-selected-rows={JSON.stringify(selectedRowKeys)}
      />
    </Card>
  );
}
