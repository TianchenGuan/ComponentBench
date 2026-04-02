'use client';

/**
 * data_table_filterable-antd-T07: Filter by Status and Plan (two columns)
 *
 * Scene context: theme=light; spacing=comfortable; layout=form_section; placement=center; scale=default;
 * instances=1; guidance=text; clutter=low.
 *
 * Layout: form_section centered with low clutter (a short description paragraph and a secondary button above the table).
 *
 * Ant Design Table titled "Orders" with comfortable spacing, default scale.
 *
 * Columns include Status and Plan, each with a filter funnel icon that opens a popover with checkbox/radio options and OK/Reset
 * buttons.
 *
 * Initial state: no active filters.
 *
 * Success: Status equals "Pending" AND Plan equals "Pro" after clicking OK in both filter popovers.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Card, Button, Typography } from 'antd';
import type { ColumnsType, FilterValue, TablePaginationConfig } from 'antd/es/table/interface';
import type { TaskComponentProps, FilterModel } from '../types';

const { Paragraph } = Typography;

interface OrderData {
  key: string;
  orderId: string;
  customer: string;
  status: string;
  plan: string;
  amount: number;
}

const ordersData: OrderData[] = [
  { key: '1', orderId: 'ORD-1001', customer: 'Alice Johnson', status: 'Pending', plan: 'Free', amount: 0 },
  { key: '2', orderId: 'ORD-1002', customer: 'Bob Smith', status: 'Processing', plan: 'Pro', amount: 29.99 },
  { key: '3', orderId: 'ORD-1003', customer: 'Carol White', status: 'Shipped', plan: 'Enterprise', amount: 99.99 },
  { key: '4', orderId: 'ORD-1004', customer: 'David Brown', status: 'Pending', plan: 'Pro', amount: 29.99 },
  { key: '5', orderId: 'ORD-1005', customer: 'Eva Martinez', status: 'Delivered', plan: 'Free', amount: 0 },
  { key: '6', orderId: 'ORD-1006', customer: 'Frank Lee', status: 'Cancelled', plan: 'Pro Plus', amount: 49.99 },
  { key: '7', orderId: 'ORD-1007', customer: 'Grace Kim', status: 'Pending', plan: 'Enterprise', amount: 99.99 },
  { key: '8', orderId: 'ORD-1008', customer: 'Henry Chen', status: 'Processing', plan: 'Pro', amount: 29.99 },
  { key: '9', orderId: 'ORD-1009', customer: 'Iris Wang', status: 'Shipped', plan: 'Free', amount: 0 },
  { key: '10', orderId: 'ORD-1010', customer: 'Jack Davis', status: 'Pending', plan: 'Pro', amount: 29.99 },
];

const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const planOptions = ['Free', 'Pro', 'Pro Plus', 'Enterprise'];

export default function T07({ onSuccess }: TaskComponentProps) {
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const successFiredRef = useRef(false);

  const columns: ColumnsType<OrderData> = [
    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId' },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: statusOptions.map(s => ({ text: s, value: s })),
      filteredValue: filteredInfo.status || null,
      onFilter: (value, record) => record.status === value,
      filterMultiple: false,
    },
    {
      title: 'Plan',
      dataIndex: 'plan',
      key: 'plan',
      filters: planOptions.map(p => ({ text: p, value: p })),
      filteredValue: filteredInfo.plan || null,
      onFilter: (value, record) => record.plan === value,
      filterMultiple: false,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (val: number) => `$${val.toFixed(2)}`,
    },
  ];

  const handleChange = (
    _pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>
  ) => {
    setFilteredInfo(filters);
  };

  // Check success condition
  useEffect(() => {
    const statusFilter = filteredInfo.status;
    const planFilter = filteredInfo.plan;
    
    if (
      statusFilter &&
      statusFilter.length === 1 &&
      statusFilter[0] === 'Pending' &&
      planFilter &&
      planFilter.length === 1 &&
      planFilter[0] === 'Pro' &&
      !successFiredRef.current
    ) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [filteredInfo, onSuccess]);

  const filterModel: FilterModel = {
    table_id: 'orders',
    logic_operator: 'AND',
    global_filter: null,
    column_filters: Object.entries(filteredInfo)
      .filter(([, v]) => v && v.length > 0)
      .map(([col, values]) => ({
        column: col.charAt(0).toUpperCase() + col.slice(1),
        operator: 'equals' as const,
        value: String(values?.[0]),
      })),
  };

  return (
    <Card style={{ width: 900 }}>
      {/* Form section with low clutter */}
      <div style={{ marginBottom: 24 }}>
        <Paragraph style={{ color: '#666', marginBottom: 12 }}>
          View and manage your orders. Use the column filters to narrow down the list.
        </Paragraph>
        <Button>Export orders</Button>
      </div>

      <div style={{ marginBottom: 16, fontWeight: 500, fontSize: 16 }}>Orders</div>
      <Table
        dataSource={ordersData}
        columns={columns}
        pagination={false}
        size="middle"
        rowKey="key"
        onChange={handleChange}
        data-testid="table-orders"
        data-filter-model={JSON.stringify(filterModel)}
      />
    </Card>
  );
}
