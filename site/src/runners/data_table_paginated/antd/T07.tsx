'use client';

/**
 * data_table_paginated-antd-T07: Orders table: clear the active Status filter
 *
 * Layout: isolated card centered titled **Orders**.
 * Component: Ant Design Table with a Status column filter dropdown.
 *
 * Initial state (important): the Status filter is already active with value **Pending**.
 * The filter icon in the Status column header appears highlighted, and only Pending rows are visible.
 *
 * Controls: opening the Status filter dropdown shows Pending selected and provides
 * **Reset** and **OK** buttons at the bottom.
 *
 * Success: No column filters are active (filters list is empty).
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Tag } from 'antd';
import type { FilterValue } from 'antd/es/table/interface';
import type { TaskComponentProps, OrderRow } from '../types';
import { generateOrderData } from '../types';

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

export default function T07({ task, onSuccess }: TaskComponentProps) {
  const [dataSource] = useState<OrderRow[]>(() => generateOrderData(120));
  const [currentPage, setCurrentPage] = useState(1);
  // Start with Pending filter active
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({
    status: ['Pending'],
  });
  const [hasSucceeded, setHasSucceeded] = useState(false);

  useEffect(() => {
    // Success when no filters are active
    const statusFilter = filteredInfo.status;
    const isFiltersCleared = !statusFilter || (Array.isArray(statusFilter) && statusFilter.length === 0);
    
    if (isFiltersCleared && !hasSucceeded) {
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
      filterMultiple: false,
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
    <Card title="Orders" style={{ width: 750 }} data-testid="orders-card">
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
  );
}
