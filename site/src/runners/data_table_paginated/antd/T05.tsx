'use client';

/**
 * data_table_paginated-antd-T05: Orders table: filter Status to Pending
 *
 * Layout: **form_section** — a "Manage Orders" page with a left-aligned form section
 * (date range inputs and a "Create order" button) above the table.
 * Component: Ant Design Table with column filters enabled on the **Status** column.
 * The Status header has a funnel/filter icon that opens a dropdown menu.
 * Filter menu lists 5 statuses with single-select behavior (radio-style).
 * Initial state: no filters are applied; page 1; page size 10.
 * Success: Status column filter is active with value 'Pending'.
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Button, DatePicker, Space } from 'antd';
import type { FilterValue } from 'antd/es/table/interface';
import type { TaskComponentProps, OrderRow } from '../types';
import { generateOrderData } from '../types';

const { RangePicker } = DatePicker;

const statusColors: Record<OrderRow['status'], string> = {
  Pending: 'orange',
  Shipped: 'blue',
  Delivered: 'green',
  Cancelled: 'red',
  Refunded: 'purple',
};

const statusFilters = [
  { text: 'Pending', value: 'Pending' },
  { text: 'Shipped', value: 'Shipped' },
  { text: 'Delivered', value: 'Delivered' },
  { text: 'Cancelled', value: 'Cancelled' },
  { text: 'Refunded', value: 'Refunded' },
];

export default function T05({ task, onSuccess }: TaskComponentProps) {
  const [dataSource] = useState<OrderRow[]>(() => generateOrderData(120));
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const [hasSucceeded, setHasSucceeded] = useState(false);

  useEffect(() => {
    // Success when Status filter is set to Pending
    const statusFilter = filteredInfo.status;
    if (
      statusFilter &&
      Array.isArray(statusFilter) &&
      statusFilter.length === 1 &&
      statusFilter[0] === 'Pending' &&
      !hasSucceeded
    ) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [filteredInfo, hasSucceeded, onSuccess]);

  const handleTableChange = (
    pagination: any,
    filters: Record<string, FilterValue | null>
  ) => {
    setCurrentPage(pagination.current);
    setFilteredInfo(filters);
  };

  const columns = [
    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId', width: 120 },
    { title: 'Customer', dataIndex: 'customer', key: 'customer', width: 150 },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      filters: statusFilters,
      filterMultiple: false, // radio-style single selection
      filteredValue: filteredInfo.status || null,
      onFilter: (value: any, record: OrderRow) => record.status === value,
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

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Form section above the table */}
      <Card title="Manage Orders" style={{ marginBottom: 16 }}>
        <Space size="middle" wrap>
          <div>
            <div style={{ marginBottom: 4, fontSize: 12, color: '#666' }}>Date Range</div>
            <RangePicker />
          </div>
          <div>
            <div style={{ marginBottom: 4, fontSize: 12, color: '#666' }}>&nbsp;</div>
            <Button type="primary">Create order</Button>
          </div>
        </Space>
      </Card>

      {/* Orders table */}
      <Card data-testid="orders-card">
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey="orderId"
          pagination={{
            current: currentPage,
            pageSize: 10,
            total: dataSource.length,
            showSizeChanger: false,
          }}
          onChange={handleTableChange}
          size="middle"
          data-testid="orders-table"
          data-filter-status={JSON.stringify(filteredInfo.status)}
        />
      </Card>
    </div>
  );
}
