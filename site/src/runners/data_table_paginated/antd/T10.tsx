'use client';

/**
 * data_table_paginated-antd-T10: Orders table: jump to page 9 via quick jumper
 *
 * Layout: isolated card positioned near the **bottom-right** of the viewport.
 *
 * Component: Ant Design Table with pagination configured with `showQuickJumper` enabled.
 * The pagination footer includes a small numeric text field labeled "Jump to" that lets
 * the user type a page number.
 *
 * Dataset: 300 orders (30 pages at 10 rows per page).
 *
 * Initial state: page 1; page size 10; no filters; no selection.
 *
 * Density: compact spacing and **small scale** make the jumper input and pagination buttons tighter.
 *
 * Success: Orders table pagination current page is 9.
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, ConfigProvider } from 'antd';
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
  { title: 'Order ID', dataIndex: 'orderId', key: 'orderId', width: 90 },
  { title: 'Customer', dataIndex: 'customer', key: 'customer', width: 110 },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 90,
    render: (status: OrderRow['status']) => (
      <Tag color={statusColors[status]}>{status}</Tag>
    ),
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    width: 80,
    render: (total: number) => `$${total.toFixed(2)}`,
  },
  { title: 'Date', dataIndex: 'orderDate', key: 'orderDate', width: 90 },
];

export default function T10({ task, onSuccess }: TaskComponentProps) {
  const [dataSource] = useState<OrderRow[]>(() => generateOrderData(300));
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  useEffect(() => {
    if (currentPage === 9 && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [currentPage, hasSucceeded, onSuccess]);

  // Note: Placement (bottom-right) is handled by PlacementWrapper
  // Scale small is applied via ConfigProvider
  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            padding: 8,
            paddingXS: 4,
          },
          Pagination: {
            itemSize: 24,
          },
        },
      }}
    >
      <Card
        title="Orders"
        size="small"
        style={{ width: 550 }}
        data-testid="orders-card"
      >
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey="orderId"
          pagination={{
            current: currentPage,
            pageSize: 10,
            total: dataSource.length,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showQuickJumper: true,
            onChange: (page) => setCurrentPage(page),
            size: 'small',
          }}
          size="small"
          data-testid="orders-table"
          data-current-page={currentPage}
        />
      </Card>
    </ConfigProvider>
  );
}
