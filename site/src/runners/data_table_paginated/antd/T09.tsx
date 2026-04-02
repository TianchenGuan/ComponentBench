'use client';

/**
 * data_table_paginated-antd-T09: Dashboard: navigate Archived Orders table to page 4
 *
 * Layout: **dashboard** layout anchored toward the **top-left** of the viewport.
 *
 * Scene contains TWO Ant Design tables of the same canonical type (instances=2):
 * 1) **Recent Orders** (top card) — small table with pagination.
 * 2) **Archived Orders** (bottom card) — larger table with pagination.
 *
 * Both tables have the same columns and similar pagination controls, but each card has a clear title.
 *
 * Initial state: both tables start on page 1 with 10 rows per page.
 *
 * Task target: only the **Archived Orders** table should end on page 4.
 * Changing the page on Recent Orders does not count.
 *
 * Clutter/distractors: dashboard also includes a right-side summary panel (KPIs and a small chart).
 * 
 * Success: Archived Orders table current page is 4.
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Statistic, Row, Col } from 'antd';
import { ArrowUpOutlined, ShoppingOutlined } from '@ant-design/icons';
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
];

export default function T09({ task, onSuccess }: TaskComponentProps) {
  const [recentOrders] = useState<OrderRow[]>(() => generateOrderData(50, 2001));
  const [archivedOrders] = useState<OrderRow[]>(() => generateOrderData(80, 1001));
  
  const [recentPage, setRecentPage] = useState(1);
  const [archivedPage, setArchivedPage] = useState(1);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  useEffect(() => {
    // Success when Archived Orders is on page 4
    if (archivedPage === 4 && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [archivedPage, hasSucceeded, onSuccess]);

  return (
    <div style={{ display: 'flex', gap: 16, maxWidth: 900 }}>
      {/* Main content - tables */}
      <div style={{ flex: 1 }}>
        {/* Recent Orders table */}
        <Card
          title="Recent Orders"
          size="small"
          style={{ marginBottom: 16 }}
          data-testid="table-recent-orders"
        >
          <Table
            dataSource={recentOrders}
            columns={columns}
            rowKey="orderId"
            pagination={{
              current: recentPage,
              pageSize: 10,
              total: recentOrders.length,
              showSizeChanger: false,
              onChange: (page) => setRecentPage(page),
              size: 'small',
            }}
            size="small"
            data-current-page={recentPage}
          />
        </Card>

        {/* Archived Orders table */}
        <Card
          title="Archived Orders"
          size="small"
          data-testid="table-archived-orders"
        >
          <Table
            dataSource={archivedOrders}
            columns={columns}
            rowKey="orderId"
            pagination={{
              current: archivedPage,
              pageSize: 10,
              total: archivedOrders.length,
              showSizeChanger: false,
              onChange: (page) => setArchivedPage(page),
              size: 'small',
            }}
            size="small"
            data-current-page={archivedPage}
          />
        </Card>
      </div>

      {/* Right sidebar - KPIs */}
      <div style={{ width: 200 }}>
        <Card size="small" title="Summary" style={{ marginBottom: 16 }}>
          <Statistic
            title="Total Orders"
            value={130}
            prefix={<ShoppingOutlined />}
          />
        </Card>
        <Card size="small">
          <Statistic
            title="Growth"
            value={11.28}
            precision={2}
            valueStyle={{ color: '#3f8600' }}
            prefix={<ArrowUpOutlined />}
            suffix="%"
          />
        </Card>
        <Card size="small" style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Monthly Trend</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 60 }}>
            {[40, 55, 45, 70, 60, 80, 75].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  background: '#1677ff',
                  borderRadius: 2,
                }}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
