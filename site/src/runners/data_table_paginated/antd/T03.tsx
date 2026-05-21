'use client';

/**
 * data_table_paginated-antd-T03: Orders table: sort by Order Date (newest first)
 *
 * Layout: isolated card centered, titled **Orders**.
 * Component: Ant Design Table with sortable columns. The **Order Date** column header shows
 * the standard sort caret indicators on hover.
 * Initial state: page 1, page size 10; no filters; sorting is **not set** (neutral) on all columns.
 * Success: active sort is Order Date descending (newest → oldest).
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Tag } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';
import type { TaskComponentProps, OrderRow } from '../types';
import { generateOrderData } from '../types';

const statusColors: Record<OrderRow['status'], string> = {
  Pending: 'orange',
  Shipped: 'blue',
  Delivered: 'green',
  Cancelled: 'red',
  Refunded: 'purple',
};

export default function T03({ task, onSuccess }: TaskComponentProps) {
  const [dataSource] = useState<OrderRow[]>(() => generateOrderData(120));
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | null>(null);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  useEffect(() => {
    if (sortColumn === 'orderDate' && sortOrder === 'descend' && !hasSucceeded) {
      setHasSucceeded(true);
      onSuccess();
    }
  }, [sortColumn, sortOrder, hasSucceeded, onSuccess]);

  const handleTableChange = (
    pagination: any,
    filters: any,
    sorter: SorterResult<OrderRow> | SorterResult<OrderRow>[]
  ) => {
    setCurrentPage(pagination.current);
    
    if (!Array.isArray(sorter)) {
      setSortColumn(sorter.columnKey as string || null);
      setSortOrder(sorter.order || null);
    }
  };

  const columns = [
    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId', width: 120, sorter: true },
    { title: 'Customer', dataIndex: 'customer', key: 'customer', width: 150, sorter: true },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      sorter: true,
      render: (status: OrderRow['status']) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: 100,
      sorter: true,
      render: (total: number) => `$${total.toFixed(2)}`,
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      width: 120,
      sorter: (a: OrderRow, b: OrderRow) => a.orderDate.localeCompare(b.orderDate),
      sortOrder: sortColumn === 'orderDate' ? sortOrder : null,
    },
  ];

  // Sort data manually for display
  const sortedData = [...dataSource].sort((a, b) => {
    if (!sortColumn || !sortOrder) return 0;
    
    const aVal = a[sortColumn as keyof OrderRow];
    const bVal = b[sortColumn as keyof OrderRow];
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'ascend' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'ascend' ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  return (
    <Card title="Orders" style={{ width: 750 }} data-testid="orders-card">
      <Table
        dataSource={sortedData}
        columns={columns}
        pagination={{
          current: currentPage,
          pageSize: 10,
          total: dataSource.length,
          showSizeChanger: false,
        }}
        onChange={handleTableChange}
        size="middle"
        data-testid="orders-table"
        data-sort-column={sortColumn}
        data-sort-order={sortOrder}
      />
    </Card>
  );
}
