'use client';

/**
 * data_table_paginated-antd-v2-T04: Cross-page exact selection in dark compact table
 *
 * Dark settings_panel with one Ant Design table "Orders". Row selection preserves
 * keys across pages. Compact size, small checkboxes.
 * Initial: page 1, no selection. Target: exactly {A-1064, A-1097, A-1128} selected.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Table, Card, Tag, ConfigProvider, theme } from 'antd';
import type { TaskComponentProps, OrderRow } from '../../types';
import { generateOrderData } from '../../types';

const statusColors: Record<OrderRow['status'], string> = {
  Pending: 'orange', Shipped: 'blue', Delivered: 'green', Cancelled: 'red', Refunded: 'purple',
};

const columns = [
  { title: 'Order ID', dataIndex: 'orderId', key: 'orderId', width: 100 },
  { title: 'Customer', dataIndex: 'customer', key: 'customer', width: 130 },
  {
    title: 'Status', dataIndex: 'status', key: 'status', width: 95,
    render: (s: OrderRow['status']) => <Tag color={statusColors[s]}>{s}</Tag>,
  },
  { title: 'Total', dataIndex: 'total', key: 'total', width: 85, render: (v: number) => `$${v.toFixed(2)}` },
  { title: 'Date', dataIndex: 'orderDate', key: 'orderDate', width: 100 },
];

const TARGET_IDS = new Set(['A-1064', 'A-1097', 'A-1128']);

export default function T04({ onSuccess }: TaskComponentProps) {
  const [dataSource] = useState(() => generateOrderData(150, 1001));
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    const selected = new Set(selectedRowKeys.map(String));
    if (selected.size === TARGET_IDS.size && Array.from(TARGET_IDS).every((id) => selected.has(id))) {
      successFired.current = true;
      onSuccess();
    }
  }, [selectedRowKeys, onSuccess]);

  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div style={{ padding: 16, maxWidth: 680 }}>
        <Card title="Orders" size="small" data-testid="orders-card">
          <Table
            dataSource={dataSource}
            columns={columns}
            size="small"
            rowSelection={{
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys),
              preserveSelectedRowKeys: true,
            }}
            pagination={{
              current: currentPage,
              pageSize: 10,
              total: dataSource.length,
              showSizeChanger: false,
              onChange: (p) => setCurrentPage(p),
            }}
            data-testid="orders-table"
            data-current-page={currentPage}
            data-selected-rows={JSON.stringify(selectedRowKeys)}
          />
        </Card>
      </div>
    </ConfigProvider>
  );
}
