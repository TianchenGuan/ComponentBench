'use client';

/**
 * data_table_filterable-antd-T04: Clear pre-applied Status filter
 *
 * Scene context: theme=light; spacing=comfortable; layout=form_section; placement=center; scale=default;
 * instances=1; guidance=text; clutter=low.
 *
 * Layout: form_section centered. The page shows a section header "Order management" with a few unrelated controls
 * (a primary button "Create order" and a disabled text field) above the table.
 *
 * The Ant Design Table titled "Orders" is directly under the header; comfortable spacing, default scale.
 *
 * Initial state: the Status column is already filtered to "Processing" (filter funnel icon is highlighted). Rows shown are
 * already reduced.
 *
 * Interaction: open the Status filter dropdown; it shows the list of statuses with the current selection checked, plus Reset
 * and OK buttons.
 *
 * Success: No column filters are active (filter model is empty) after clicking OK.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Card, Button, Input } from 'antd';
import type { ColumnsType, FilterValue, TablePaginationConfig } from 'antd/es/table/interface';
import type { TaskComponentProps, FilterModel } from '../types';

interface OrderData {
  key: string;
  orderId: string;
  customer: string;
  status: string;
  country: string;
  amount: number;
}

const ordersData: OrderData[] = [
  { key: '1', orderId: 'ORD-1001', customer: 'Alice Johnson', status: 'Pending', country: 'USA', amount: 150.00 },
  { key: '2', orderId: 'ORD-1002', customer: 'Bob Smith', status: 'Processing', country: 'Canada', amount: 230.50 },
  { key: '3', orderId: 'ORD-1003', customer: 'Carol White', status: 'Shipped', country: 'UK', amount: 89.99 },
  { key: '4', orderId: 'ORD-1004', customer: 'David Brown', status: 'Processing', country: 'Germany', amount: 340.00 },
  { key: '5', orderId: 'ORD-1005', customer: 'Eva Martinez', status: 'Refunded', country: 'France', amount: 120.00 },
  { key: '6', orderId: 'ORD-1006', customer: 'Frank Lee', status: 'Cancelled', country: 'Japan', amount: 75.00 },
  { key: '7', orderId: 'ORD-1007', customer: 'Grace Kim', status: 'Processing', country: 'Australia', amount: 199.00 },
  { key: '8', orderId: 'ORD-1008', customer: 'Henry Chen', status: 'Pending', country: 'China', amount: 560.00 },
];

const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Refunded', 'Cancelled'];
const countryOptions = ['USA', 'Canada', 'UK', 'Germany', 'France', 'Japan', 'Australia', 'China'];

export default function T04({ onSuccess }: TaskComponentProps) {
  // Start with Status filtered to "Processing"
  const [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({
    status: ['Processing'],
  });
  const successFiredRef = useRef(false);
  const [interactionStarted, setInteractionStarted] = useState(false);

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
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      filters: countryOptions.map(c => ({ text: c, value: c })),
      filteredValue: filteredInfo.country || null,
      onFilter: (value, record) => record.country === value,
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
    setInteractionStarted(true);
    setFilteredInfo(filters);
  };

  // Check success condition - all filters cleared
  useEffect(() => {
    if (!interactionStarted) return;
    
    const hasAnyFilter = Object.values(filteredInfo).some(v => v && v.length > 0);
    
    if (!hasAnyFilter && !successFiredRef.current) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [filteredInfo, interactionStarted, onSuccess]);

  const filterModel: FilterModel = {
    table_id: 'orders',
    logic_operator: 'AND',
    global_filter: null,
    column_filters: Object.entries(filteredInfo)
      .filter(([, v]) => v && v.length > 0)
      .map(([col, values]) => ({
        column: col.charAt(0).toUpperCase() + col.slice(1),
        operator: (values?.length ?? 0) > 1 ? 'in' : 'equals' as const,
        value: values?.length === 1 ? String(values[0]) : (values as string[]),
      })),
  };

  return (
    <Card style={{ width: 900 }}>
      {/* Form section header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, marginBottom: 16 }}>Order management</h2>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Button type="primary">Create order</Button>
          <Input placeholder="Search..." disabled style={{ width: 200 }} />
        </div>
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
