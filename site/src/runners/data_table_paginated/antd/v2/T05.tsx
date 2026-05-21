'use client';

/**
 * data_table_paginated-antd-v2-T05: Pending Orders — apply filter, then paginate and select
 *
 * Compact settings_panel with one Ant Design table "Orders". Status column has a
 * built-in filter dropdown with OK. Row selection enabled. Data is constructed so
 * P-2071 lands on page 3 after filtering to Pending.
 * Initial: no filter, page 1, no selection.
 * Target: filter Status=Pending applied (OK), page 3, row P-2071 selected.
 * require_confirm: true (OK button).
 */

import React, { useState, useRef, useEffect } from 'react';
import { Table, Card, Tag } from 'antd';
import type { TaskComponentProps } from '../../types';

interface PendingOrderRow {
  key: string;
  orderId: string;
  customer: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';
  total: number;
  orderDate: string;
}

const statusColors: Record<PendingOrderRow['status'], string> = {
  Pending: 'orange', Shipped: 'blue', Delivered: 'green', Cancelled: 'red', Refunded: 'purple',
};

function generatePendingOrderData(): PendingOrderRow[] {
  const statuses: PendingOrderRow['status'][] = ['Pending', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];
  const customers = [
    'John Smith', 'Jane Doe', 'Bob Wilson', 'Alice Brown', 'Charlie Davis',
    'Diana Miller', 'Eve Johnson', 'Frank Garcia', 'Grace Lee', 'Henry Taylor',
  ];
  const data: PendingOrderRow[] = [];
  const startId = 1951;
  for (let i = 0; i < 200; i++) {
    const id = startId + i;
    const date = new Date(2024, 0, 1);
    date.setDate(date.getDate() + (i * 2) % 365);
    data.push({
      key: `P-${id}`,
      orderId: `P-${id}`,
      customer: customers[i % customers.length],
      status: statuses[i % statuses.length],
      total: Math.round((50 + Math.random() * 450) * 100) / 100,
      orderDate: date.toISOString().split('T')[0],
    });
  }
  return data;
}

export default function T05({ onSuccess }: TaskComponentProps) {
  const [dataSource] = useState(generatePendingOrderData);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filteredStatus, setFilteredStatus] = useState<string[] | null>(null);
  const successFired = useRef(false);

  const displayData = filteredStatus
    ? dataSource.filter((r) => filteredStatus.includes(r.status))
    : dataSource;

  useEffect(() => {
    if (successFired.current) return;
    const isPendingFilter =
      filteredStatus && filteredStatus.length === 1 && filteredStatus[0] === 'Pending';
    const isPage3 = currentPage === 3;
    const isP2071Selected =
      selectedRowKeys.length === 1 && String(selectedRowKeys[0]) === 'P-2071';
    if (isPendingFilter && isPage3 && isP2071Selected) {
      successFired.current = true;
      onSuccess();
    }
  }, [filteredStatus, currentPage, selectedRowKeys, onSuccess]);

  const columns = [
    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId', width: 110 },
    { title: 'Customer', dataIndex: 'customer', key: 'customer', width: 140 },
    {
      title: 'Status', dataIndex: 'status', key: 'status', width: 110,
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'Shipped', value: 'Shipped' },
        { text: 'Delivered', value: 'Delivered' },
        { text: 'Cancelled', value: 'Cancelled' },
        { text: 'Refunded', value: 'Refunded' },
      ],
      filteredValue: filteredStatus,
      onFilter: (value: unknown, record: PendingOrderRow) => record.status === value,
      render: (s: PendingOrderRow['status']) => <Tag color={statusColors[s]}>{s}</Tag>,
    },
    { title: 'Total', dataIndex: 'total', key: 'total', width: 90, render: (v: number) => `$${v.toFixed(2)}` },
    { title: 'Date', dataIndex: 'orderDate', key: 'orderDate', width: 110 },
  ];

  return (
    <div style={{ padding: 16, maxWidth: 720 }}>
      <Card title="Orders" size="small" data-testid="orders-card">
        <Table
          dataSource={displayData}
          columns={columns}
          size="small"
          rowSelection={{
            type: 'radio',
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
          pagination={{
            current: currentPage,
            pageSize: 10,
            total: displayData.length,
            showSizeChanger: false,
          }}
          onChange={(pagination, filters) => {
            const statusFilter = filters.status as string[] | null;
            const newFilter = statusFilter && statusFilter.length > 0 ? statusFilter : null;
            const filterChanged = JSON.stringify(newFilter) !== JSON.stringify(filteredStatus);
            setFilteredStatus(newFilter);
            setCurrentPage(filterChanged ? 1 : (pagination.current ?? 1));
          }}
          data-testid="orders-table"
          data-current-page={currentPage}
          data-filter-status={JSON.stringify(filteredStatus)}
          data-selected-rows={JSON.stringify(selectedRowKeys)}
        />
      </Card>
    </div>
  );
}
