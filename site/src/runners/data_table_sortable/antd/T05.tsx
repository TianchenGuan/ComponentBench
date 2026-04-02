'use client';

/**
 * data_table_sortable-antd-T05: Dashboard - sort Orders by Total high→low (two tables)
 *
 * Dashboard layout with multiple cards and two Ant Design Tables.
 * - Two table instances: "Orders" (target) and "Returns" (distractor).
 * - Both tables share similar columns: ID, Customer, Total, Status, Updated.
 * - Only the Orders table should be modified.
 * - Initial state: both tables unsorted.
 *
 * Clutter: KPI tiles, date range chip group, and a "Download report" button.
 * Success: Orders table sorted by Total descending; Returns table unchanged.
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Space, Statistic, DatePicker } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import type { ColumnsType, SorterResult } from 'antd/es/table/interface';
import type { TaskComponentProps, SortModel } from '../types';

const { RangePicker } = DatePicker;

interface OrderData {
  key: string;
  orderId: string;
  customer: string;
  total: number;
  status: string;
  updated: string;
}

const ordersData: OrderData[] = [
  { key: '1', orderId: 'ORD-5001', customer: 'Acme Corp', total: 1250.00, status: 'Completed', updated: '2024-02-10' },
  { key: '2', orderId: 'ORD-5002', customer: 'TechStart', total: 890.50, status: 'Processing', updated: '2024-02-12' },
  { key: '3', orderId: 'ORD-5003', customer: 'Global Systems', total: 2340.00, status: 'Completed', updated: '2024-02-08' },
  { key: '4', orderId: 'ORD-5004', customer: 'DataFlow', total: 567.25, status: 'Pending', updated: '2024-02-15' },
  { key: '5', orderId: 'ORD-5005', customer: 'CloudNet', total: 1780.00, status: 'Completed', updated: '2024-02-11' },
  { key: '6', orderId: 'ORD-5006', customer: 'Innovate Labs', total: 3200.00, status: 'Processing', updated: '2024-02-14' },
];

const returnsData: OrderData[] = [
  { key: '1', orderId: 'RET-3001', customer: 'QuickShip', total: 150.00, status: 'Approved', updated: '2024-02-09' },
  { key: '2', orderId: 'RET-3002', customer: 'FinanceHub', total: 320.50, status: 'Pending', updated: '2024-02-13' },
  { key: '3', orderId: 'RET-3003', customer: 'MarketPro', total: 89.00, status: 'Approved', updated: '2024-02-07' },
  { key: '4', orderId: 'RET-3004', customer: 'DesignWorks', total: 445.25, status: 'Rejected', updated: '2024-02-14' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [ordersSortedInfo, setOrdersSortedInfo] = useState<SorterResult<OrderData>>({});
  const [returnsSortedInfo, setReturnsSortedInfo] = useState<SorterResult<OrderData>>({});

  const getColumns = (sortedInfo: SorterResult<OrderData>): ColumnsType<OrderData> => [
    { title: 'ID', dataIndex: 'orderId', key: 'orderId', width: 100 },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      sorter: (a, b) => a.total - b.total,
      sortOrder: sortedInfo.columnKey === 'total' ? sortedInfo.order : null,
      render: (val: number) => `$${val.toFixed(2)}`,
    },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Updated', dataIndex: 'updated', key: 'updated' },
  ];

  const handleOrdersChange = (_pagination: unknown, _filters: unknown, sorter: SorterResult<OrderData> | SorterResult<OrderData>[]) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    setOrdersSortedInfo(singleSorter || {});
  };

  const handleReturnsChange = (_pagination: unknown, _filters: unknown, sorter: SorterResult<OrderData> | SorterResult<OrderData>[]) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    setReturnsSortedInfo(singleSorter || {});
  };

  // Check success condition: Orders Total desc, Returns unchanged
  useEffect(() => {
    const ordersCorrect = ordersSortedInfo.columnKey === 'total' && ordersSortedInfo.order === 'descend';
    const returnsUntouched = !returnsSortedInfo.columnKey || !returnsSortedInfo.order;
    if (ordersCorrect && returnsUntouched) {
      onSuccess();
    }
  }, [ordersSortedInfo, returnsSortedInfo, onSuccess]);

  const ordersSortModel: SortModel = ordersSortedInfo.columnKey && ordersSortedInfo.order
    ? [{ column_key: String(ordersSortedInfo.columnKey), direction: ordersSortedInfo.order === 'ascend' ? 'asc' : 'desc', priority: 1 }]
    : [];

  const returnsSortModel: SortModel = returnsSortedInfo.columnKey && returnsSortedInfo.order
    ? [{ column_key: String(returnsSortedInfo.columnKey), direction: returnsSortedInfo.order === 'ascend' ? 'asc' : 'desc', priority: 1 }]
    : [];

  return (
    <div style={{ width: 900 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Sales Overview</h2>
        <Space>
          <RangePicker disabled />
          <Button icon={<DownloadOutlined />} disabled>Download report</Button>
        </Space>
      </div>

      {/* KPI Tiles */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <Card size="small" style={{ flex: 1 }}>
          <Statistic title="Total Revenue" value={12580} prefix="$" />
        </Card>
        <Card size="small" style={{ flex: 1 }}>
          <Statistic title="Orders" value={48} />
        </Card>
        <Card size="small" style={{ flex: 1 }}>
          <Statistic title="Returns" value={7} />
        </Card>
      </div>

      {/* Tables */}
      <div style={{ display: 'flex', gap: 16 }}>
        <Card style={{ flex: 1 }} title="Orders">
          <Table
            dataSource={ordersData}
            columns={getColumns(ordersSortedInfo)}
            pagination={false}
            size="small"
            rowKey="key"
            onChange={handleOrdersChange}
            data-testid="table-orders"
            data-sort-model={JSON.stringify(ordersSortModel)}
          />
        </Card>
        <Card style={{ flex: 1 }} title="Returns">
          <Table
            dataSource={returnsData}
            columns={getColumns(returnsSortedInfo)}
            pagination={false}
            size="small"
            rowKey="key"
            onChange={handleReturnsChange}
            data-testid="table-returns"
            data-sort-model={JSON.stringify(returnsSortModel)}
          />
        </Card>
      </div>
    </div>
  );
}
