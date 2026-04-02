'use client';

/**
 * data_table_filterable-antd-T08: Dashboard: Filter Orders (not Invoices)
 *
 * Scene context: theme=light; spacing=comfortable; layout=isolated_card; placement=top_left; scale=default;
 * instances=2; guidance=text; clutter=none.
 *
 * Layout: isolated_card positioned toward the top-left of the viewport (the card's top-left corner is near the viewport
 * top-left).
 *
 * Inside the card are two Ant Design Tables placed side-by-side with their own titles: "Orders" (left) and "Invoices" (right).
 *
 * Both tables use comfortable spacing and default scale and share a similar column set including a Status column with a
 * filter funnel icon.
 *
 * Initial state: no active filters on either table.
 *
 * Critical disambiguation: the task target is the Orders table; filtering Invoices must not count.
 *
 * Success: Orders table filter model contains exactly one filter: Status equals "Refunded". Invoices table has no active filters.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Card } from 'antd';
import type { ColumnsType, FilterValue, TablePaginationConfig } from 'antd/es/table/interface';
import type { TaskComponentProps, FilterModel } from '../types';

interface TableData {
  key: string;
  id: string;
  customer: string;
  status: string;
  amount: number;
}

const ordersData: TableData[] = [
  { key: '1', id: 'ORD-001', customer: 'Alice', status: 'Pending', amount: 150.00 },
  { key: '2', id: 'ORD-002', customer: 'Bob', status: 'Refunded', amount: 230.50 },
  { key: '3', id: 'ORD-003', customer: 'Carol', status: 'Shipped', amount: 89.99 },
  { key: '4', id: 'ORD-004', customer: 'David', status: 'Refunded', amount: 340.00 },
  { key: '5', id: 'ORD-005', customer: 'Eva', status: 'Delivered', amount: 120.00 },
];

const invoicesData: TableData[] = [
  { key: '1', id: 'INV-001', customer: 'Alice', status: 'Paid', amount: 150.00 },
  { key: '2', id: 'INV-002', customer: 'Bob', status: 'Pending', amount: 230.50 },
  { key: '3', id: 'INV-003', customer: 'Carol', status: 'Overdue', amount: 89.99 },
  { key: '4', id: 'INV-004', customer: 'David', status: 'Refunded', amount: 340.00 },
  { key: '5', id: 'INV-005', customer: 'Eva', status: 'Paid', amount: 120.00 },
];

const orderStatusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Refunded', 'Cancelled'];
const invoiceStatusOptions = ['Pending', 'Paid', 'Overdue', 'Refunded', 'Cancelled'];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [ordersFilteredInfo, setOrdersFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const [invoicesFilteredInfo, setInvoicesFilteredInfo] = useState<Record<string, FilterValue | null>>({});
  const successFiredRef = useRef(false);

  const ordersColumns: ColumnsType<TableData> = [
    { title: 'Order ID', dataIndex: 'id', key: 'id' },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: orderStatusOptions.map(s => ({ text: s, value: s })),
      filteredValue: ordersFilteredInfo.status || null,
      onFilter: (value, record) => record.status === value,
      filterMultiple: false,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (val: number) => `$${val.toFixed(2)}`,
    },
  ];

  const invoicesColumns: ColumnsType<TableData> = [
    { title: 'Invoice ID', dataIndex: 'id', key: 'id' },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: invoiceStatusOptions.map(s => ({ text: s, value: s })),
      filteredValue: invoicesFilteredInfo.status || null,
      onFilter: (value, record) => record.status === value,
      filterMultiple: false,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (val: number) => `$${val.toFixed(2)}`,
    },
  ];

  const handleOrdersChange = (
    _pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>
  ) => {
    setOrdersFilteredInfo(filters);
  };

  const handleInvoicesChange = (
    _pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>
  ) => {
    setInvoicesFilteredInfo(filters);
  };

  // Check success condition
  useEffect(() => {
    const ordersStatusFilter = ordersFilteredInfo.status;
    const invoicesHasFilter = Object.values(invoicesFilteredInfo).some(v => v && v.length > 0);
    
    if (
      ordersStatusFilter &&
      ordersStatusFilter.length === 1 &&
      ordersStatusFilter[0] === 'Refunded' &&
      !invoicesHasFilter &&
      !successFiredRef.current
    ) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [ordersFilteredInfo, invoicesFilteredInfo, onSuccess]);

  const ordersFilterModel: FilterModel = {
    table_id: 'orders',
    logic_operator: 'AND',
    global_filter: null,
    column_filters: Object.entries(ordersFilteredInfo)
      .filter(([, v]) => v && v.length > 0)
      .map(([col, values]) => ({
        column: col.charAt(0).toUpperCase() + col.slice(1),
        operator: 'equals' as const,
        value: String(values?.[0]),
      })),
  };

  const invoicesFilterModel: FilterModel = {
    table_id: 'invoices',
    logic_operator: 'AND',
    global_filter: null,
    column_filters: Object.entries(invoicesFilteredInfo)
      .filter(([, v]) => v && v.length > 0)
      .map(([col, values]) => ({
        column: col.charAt(0).toUpperCase() + col.slice(1),
        operator: 'equals' as const,
        value: String(values?.[0]),
      })),
  };

  return (
    <Card style={{ width: 1100 }}>
      <div style={{ display: 'flex', gap: 24 }}>
        {/* Orders Table */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 12, fontWeight: 500, fontSize: 16 }}>Orders</div>
          <Table
            dataSource={ordersData}
            columns={ordersColumns}
            pagination={false}
            size="middle"
            rowKey="key"
            onChange={handleOrdersChange}
            data-testid="table-orders"
            data-filter-model={JSON.stringify(ordersFilterModel)}
          />
        </div>

        {/* Invoices Table */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 12, fontWeight: 500, fontSize: 16 }}>Invoices</div>
          <Table
            dataSource={invoicesData}
            columns={invoicesColumns}
            pagination={false}
            size="middle"
            rowKey="key"
            onChange={handleInvoicesChange}
            data-testid="table-invoices"
            data-filter-model={JSON.stringify(invoicesFilterModel)}
          />
        </div>
      </div>
    </Card>
  );
}
