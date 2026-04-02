'use client';

/**
 * data_table_paginated-antd-T01: Orders table: go to page 3
 *
 * Layout: an isolated card centered in the viewport titled **Orders**.
 * Component: an Ant Design Table with built-in pagination in the footer.
 * The table shows 5 columns: Order ID, Customer, Status (colored Tag), Total, and Order Date.
 * The dataset contains 120 orders (IDs A-1001…A-1120), so pagination shows 12 pages at 10 rows per page.
 * Initial state: the table is on page 1, no filters, no selection.
 * Success: pagination current page is 3.
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

export default function T01({ task, onSuccess }: TaskComponentProps) {
  const [dataSource] = useState<OrderRow[]>(() => generateOrderData(120));
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  useEffect(() => {
    if (currentPage === 3 && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [currentPage, hasSucceeded, onSuccess]);

  return (
    <Card title="Orders" style={{ width: 750 }} data-testid="orders-card">
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          current: currentPage,
          pageSize: 10,
          total: dataSource.length,
          showSizeChanger: false,
          onChange: (page) => setCurrentPage(page),
        }}
        size="middle"
        data-testid="orders-table"
        data-current-page={currentPage}
      />
    </Card>
  );
}
