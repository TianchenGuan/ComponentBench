'use client';

/**
 * data_table_paginated-antd-T08: Orders table: select three specific orders across pages
 *
 * Layout: isolated card centered titled **Orders** in **dark theme** with **compact spacing**.
 *
 * Component: Ant Design Table with pagination (10 rows per page) and multi-row selection (checkboxes).
 * `rowSelection.preserveSelectedRowKeys` is enabled so selections persist when moving between pages.
 *
 * Dataset: 120 orders (A-1001…A-1120). The three target Order IDs are spread across multiple pages:
 * • A-1088 (page 9)
 * • A-1091 (page 10)
 * • A-1120 (page 12)
 *
 * Initial state: page 1; no rows selected.
 * Success: Selected row IDs are exactly {A-1088, A-1091, A-1120}.
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, ConfigProvider, theme } from 'antd';
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
  { title: 'Customer', dataIndex: 'customer', key: 'customer', width: 130 },
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

const TARGET_IDS = ['A-1088', 'A-1091', 'A-1120'];

export default function T08({ task, onSuccess }: TaskComponentProps) {
  const [dataSource] = useState<OrderRow[]>(() => generateOrderData(120));
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  useEffect(() => {
    // Success when exactly the three target IDs are selected
    const selectedSet = new Set(selectedRowKeys.map(String));
    const targetSet = new Set(TARGET_IDS);
    
    if (
      selectedSet.size === targetSet.size &&
      TARGET_IDS.every(id => selectedSet.has(id)) &&
      !hasSucceeded
    ) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [selectedRowKeys, hasSucceeded, onSuccess]);

  const rowSelection = {
    selectedRowKeys,
    preserveSelectedRowKeys: true, // Keep selections across pagination
    onChange: (keys: React.Key[]) => {
      setSelectedRowKeys(keys);
    },
  };

  // Note: Dark theme and compact spacing are handled by ThemeWrapper
  // But we add ConfigProvider here for additional dark mode styles
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        components: {
          Table: {
            padding: 8,
            paddingXS: 4,
          },
        },
      }}
    >
      <Card
        title="Orders"
        style={{ width: 700, background: '#1f1f1f' }}
        styles={{ header: { color: '#fff' }, body: { padding: 12 } }}
        data-testid="orders-card"
      >
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
          data-current-page={currentPage}
        />
      </Card>
    </ConfigProvider>
  );
}
