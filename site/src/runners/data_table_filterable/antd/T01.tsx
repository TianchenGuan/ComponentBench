'use client';

/**
 * data_table_filterable-antd-T01: Filter Orders by Status (Shipped)
 *
 * Scene context: theme=light; spacing=comfortable; layout=isolated_card; placement=center; scale=default;
 * instances=1; guidance=text; clutter=none.
 *
 * Layout: isolated_card centered in the viewport. A single Ant Design Table titled "Orders" is shown.
 * The table uses default (comfortable) spacing and default scale. Columns: Order ID, Customer, Status, Country, Amount.
 *
 * Filter affordances: the Status and Country column headers each have a small funnel icon. Clicking the Status funnel opens
 * an AntD filter dropdown popover.
 *
 * Status filter configuration: single-select (radio-like) list of 6 statuses (Pending, Processing, Shipped, Delivered, Refunded,
 * Cancelled) with OK and Reset buttons at the bottom.
 *
 * Initial state: no filters active; all rows visible; no filter chips.
 *
 * Success: Status filter equals "Shipped" after clicking OK.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Card } from 'antd';
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
  { key: '4', orderId: 'ORD-1004', customer: 'David Brown', status: 'Delivered', country: 'Germany', amount: 340.00 },
  { key: '5', orderId: 'ORD-1005', customer: 'Eva Martinez', status: 'Refunded', country: 'France', amount: 120.00 },
  { key: '6', orderId: 'ORD-1006', customer: 'Frank Lee', status: 'Cancelled', country: 'Japan', amount: 75.00 },
  { key: '7', orderId: 'ORD-1007', customer: 'Grace Kim', status: 'Shipped', country: 'Australia', amount: 199.00 },
  { key: '8', orderId: 'ORD-1008', customer: 'Henry Chen', status: 'Pending', country: 'China', amount: 560.00 },
  { key: '9', orderId: 'ORD-1009', customer: 'Iris Wang', status: 'Shipped', country: 'Brazil', amount: 85.50 },
  { key: '10', orderId: 'ORD-1010', customer: 'Jack Davis', status: 'Processing', country: 'India', amount: 410.00 },
];

const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Refunded', 'Cancelled'];
const countryOptions = ['USA', 'Canada', 'UK', 'Germany', 'France', 'Japan', 'Australia', 'China', 'Brazil', 'India'];

export default function T01({ onSuccess }: TaskComponentProps) {
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
    setFilteredInfo(filters);
  };

  // Check success condition
  useEffect(() => {
    const statusFilter = filteredInfo.status;
    const countryFilter = filteredInfo.country;
    
    if (
      statusFilter &&
      statusFilter.length === 1 &&
      statusFilter[0] === 'Shipped' &&
      (!countryFilter || countryFilter.length === 0) &&
      !successFiredRef.current
    ) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [filteredInfo, onSuccess]);

  // Build filter model for data attribute
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
