'use client';

/**
 * data_table_paginated-antd-v2-T02: Quick jumper footer — 20 per page and page 7
 *
 * Bottom-right compact card with one Ant Design table "Orders".
 * Footer exposes both showSizeChanger and showQuickJumper.
 * Disabled export button and refresh icon as clutter.
 * Initial: page 1, size 10. Target: size 20, page 7.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Table, Card, Tag, Button, Space } from 'antd';
import { ReloadOutlined, ExportOutlined } from '@ant-design/icons';
import type { TaskComponentProps, OrderRow } from '../../types';
import { generateOrderData } from '../../types';

const statusColors: Record<OrderRow['status'], string> = {
  Pending: 'orange', Shipped: 'blue', Delivered: 'green', Cancelled: 'red', Refunded: 'purple',
};

const columns = [
  { title: 'Order ID', dataIndex: 'orderId', key: 'orderId', width: 110 },
  { title: 'Customer', dataIndex: 'customer', key: 'customer', width: 140 },
  {
    title: 'Status', dataIndex: 'status', key: 'status', width: 100,
    render: (s: OrderRow['status']) => <Tag color={statusColors[s]}>{s}</Tag>,
  },
  { title: 'Total', dataIndex: 'total', key: 'total', width: 90, render: (v: number) => `$${v.toFixed(2)}` },
  { title: 'Order Date', dataIndex: 'orderDate', key: 'orderDate', width: 110 },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [dataSource] = useState(() => generateOrderData(200, 1001));
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (pageSize === 20 && currentPage === 7) {
      successFired.current = true;
      onSuccess();
    }
  }, [pageSize, currentPage, onSuccess]);

  return (
    <Card
      title="Orders"
      size="small"
      style={{ width: 700 }}
      extra={
        <Space size="small">
          <Button size="small" icon={<ReloadOutlined />} type="text" />
          <Button size="small" icon={<ExportOutlined />} disabled>Export</Button>
        </Space>
      }
      data-testid="orders-card"
    >
      <Table
        dataSource={dataSource}
        columns={columns}
        size="small"
        pagination={{
          current: currentPage,
          pageSize,
          total: dataSource.length,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showQuickJumper: true,
          onChange: (p, s) => { setCurrentPage(p); setPageSize(s); },
        }}
        data-testid="orders-table"
        data-current-page={currentPage}
        data-page-size={pageSize}
      />
    </Card>
  );
}
