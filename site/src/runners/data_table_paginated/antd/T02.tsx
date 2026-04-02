'use client';

/**
 * data_table_paginated-antd-T02: Orders table: set rows per page to 20
 *
 * Layout: isolated card centered, titled **Orders**.
 * Component: Ant Design Table with pagination configured with **page size changer** enabled.
 * Footer pagination includes a "Rows per page" (pageSize) dropdown with options 10, 20, 50.
 * Initial state: page 1, page size 10 rows per page; no filters; no selected rows.
 * Success: page size is 20 rows per page.
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

export default function T02({ task, onSuccess }: TaskComponentProps) {
  const [dataSource] = useState<OrderRow[]>(() => generateOrderData(120));
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  useEffect(() => {
    if (pageSize === 20 && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [pageSize, hasSucceeded, onSuccess]);

  return (
    <Card title="Orders" style={{ width: 750 }} data-testid="orders-card">
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: dataSource.length,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
          onShowSizeChange: (current, size) => {
            setPageSize(size);
            setCurrentPage(1);
          },
        }}
        size="middle"
        data-testid="orders-table"
        data-current-page={currentPage}
        data-page-size={pageSize}
      />
    </Card>
  );
}
