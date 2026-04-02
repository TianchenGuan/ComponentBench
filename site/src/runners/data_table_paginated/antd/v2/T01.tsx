'use client';

/**
 * data_table_paginated-antd-v2-T01: Archived Orders card — page size then page on the correct table
 *
 * Dashboard with two Ant Design tables: "Recent Orders" and "Archived Orders".
 * Each has footer pagination + page-size changer. KPI cards and a chart add clutter.
 * Initial: both page 1, size 10. Target: Archived Orders → size 25, page 4;
 * Recent Orders must remain page 1, size 10.
 */

import React, { useState, useRef, useEffect } from 'react';
import { Table, Card, Tag, Select, Statistic, Row, Col, Typography } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import type { TaskComponentProps, OrderRow } from '../../types';
import { generateOrderData } from '../../types';

const { Text } = Typography;

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

export default function T01({ onSuccess }: TaskComponentProps) {
  const [recentData] = useState(() => generateOrderData(120, 1001));
  const [archivedData] = useState(() => generateOrderData(200, 3001));

  const [recentPage, setRecentPage] = useState(1);
  const [recentSize, setRecentSize] = useState(10);
  const [archivedPage, setArchivedPage] = useState(1);
  const [archivedSize, setArchivedSize] = useState(10);

  const successFired = useRef(false);

  useEffect(() => {
    if (successFired.current) return;
    if (
      archivedSize === 25 && archivedPage === 4 &&
      recentSize === 10 && recentPage === 1
    ) {
      successFired.current = true;
      onSuccess();
    }
  }, [archivedSize, archivedPage, recentSize, recentPage, onSuccess]);

  return (
    <div style={{ padding: 16, maxWidth: 900 }}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card size="small"><Statistic title="Revenue" value={42350} prefix="$" /></Card></Col>
        <Col span={6}><Card size="small"><Statistic title="Orders" value={318} /></Card></Col>
        <Col span={6}><Card size="small"><Statistic title="Returns" value={12} /></Card></Col>
        <Col span={6}>
          <Card size="small" style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChartOutlined style={{ fontSize: 28, color: '#999' }} />
          </Card>
        </Col>
      </Row>

      <Card title="Recent Orders" size="small" style={{ marginBottom: 16 }} data-testid="recent-orders-card">
        <Table
          dataSource={recentData}
          columns={columns}
          size="small"
          pagination={{
            current: recentPage,
            pageSize: recentSize,
            total: recentData.length,
            showSizeChanger: true,
            pageSizeOptions: ['10', '25', '50'],
            onChange: (p, s) => { setRecentPage(p); setRecentSize(s); },
          }}
          data-testid="recent-orders-table"
          data-current-page={recentPage}
          data-page-size={recentSize}
        />
      </Card>

      <Card title="Archived Orders" size="small" data-testid="archived-orders-card">
        <Table
          dataSource={archivedData}
          columns={columns}
          size="small"
          pagination={{
            current: archivedPage,
            pageSize: archivedSize,
            total: archivedData.length,
            showSizeChanger: true,
            pageSizeOptions: ['10', '25', '50'],
            onChange: (p, s) => { setArchivedPage(p); setArchivedSize(s); },
          }}
          data-testid="archived-orders-table"
          data-current-page={archivedPage}
          data-page-size={archivedSize}
        />
      </Card>
    </div>
  );
}
