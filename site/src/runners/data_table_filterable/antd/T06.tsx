'use client';

/**
 * data_table_filterable-antd-T06: Set Amount range ($50-$125)
 *
 * Scene context: theme=light; spacing=comfortable; layout=isolated_card; placement=center; scale=default;
 * instances=1; guidance=text; clutter=none.
 *
 * Layout: isolated_card centered; light theme, comfortable spacing, default scale.
 *
 * Ant Design Table titled "Orders" with columns including Amount. The Amount header has a filter icon.
 *
 * Custom Amount filter dropdown: clicking the Amount filter icon opens a popover with two InputNumber fields labeled "Min"
 * and "Max", prefilled as blank, and two buttons: "Apply" and "Reset".
 *
 * Initial state: no filters active.
 *
 * Success: Amount filter range is set to min=50 and max=125 (inclusive) after clicking Apply.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Card, InputNumber, Button, Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import type { ColumnsType, FilterDropdownProps } from 'antd/es/table/interface';
import type { TaskComponentProps, FilterModel } from '../types';

interface OrderData {
  key: string;
  orderId: string;
  customer: string;
  status: string;
  amount: number;
}

const ordersData: OrderData[] = [
  { key: '1', orderId: 'ORD-1001', customer: 'Alice Johnson', status: 'Pending', amount: 45.00 },
  { key: '2', orderId: 'ORD-1002', customer: 'Bob Smith', status: 'Processing', amount: 75.50 },
  { key: '3', orderId: 'ORD-1003', customer: 'Carol White', status: 'Shipped', amount: 89.99 },
  { key: '4', orderId: 'ORD-1004', customer: 'David Brown', status: 'Delivered', amount: 125.00 },
  { key: '5', orderId: 'ORD-1005', customer: 'Eva Martinez', status: 'Refunded', amount: 50.00 },
  { key: '6', orderId: 'ORD-1006', customer: 'Frank Lee', status: 'Cancelled', amount: 180.00 },
  { key: '7', orderId: 'ORD-1007', customer: 'Grace Kim', status: 'Shipped', amount: 99.00 },
  { key: '8', orderId: 'ORD-1008', customer: 'Henry Chen', status: 'Pending', amount: 35.00 },
  { key: '9', orderId: 'ORD-1009', customer: 'Iris Wang', status: 'Processing', amount: 110.50 },
  { key: '10', orderId: 'ORD-1010', customer: 'Jack Davis', status: 'Delivered', amount: 200.00 },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [minValue, setMinValue] = useState<number | null>(null);
  const [maxValue, setMaxValue] = useState<number | null>(null);
  const [appliedMin, setAppliedMin] = useState<number | null>(null);
  const [appliedMax, setAppliedMax] = useState<number | null>(null);
  const successFiredRef = useRef(false);

  const handleApply = (confirm: () => void) => {
    setAppliedMin(minValue);
    setAppliedMax(maxValue);
    confirm();
  };

  const handleReset = (clearFilters: () => void) => {
    setMinValue(null);
    setMaxValue(null);
    setAppliedMin(null);
    setAppliedMax(null);
    clearFilters();
  };

  const columns: ColumnsType<OrderData> = [
    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId' },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (val: number) => `$${val.toFixed(2)}`,
      filterDropdown: ({ confirm, clearFilters }: FilterDropdownProps) => (
        <div style={{ padding: 12 }}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>Min</label>
            <InputNumber
              value={minValue}
              onChange={(val) => setMinValue(val)}
              placeholder="Min"
              style={{ width: '100%' }}
              data-testid="amount-min-input"
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 12 }}>Max</label>
            <InputNumber
              value={maxValue}
              onChange={(val) => setMaxValue(val)}
              placeholder="Max"
              style={{ width: '100%' }}
              data-testid="amount-max-input"
            />
          </div>
          <Space>
            <Button
              type="primary"
              onClick={() => handleApply(confirm)}
              size="small"
            >
              Apply
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: () => (
        <FilterOutlined style={{ color: appliedMin !== null || appliedMax !== null ? '#1677ff' : undefined }} />
      ),
      onFilter: () => true, // Filtering handled manually
    },
  ];

  // Check success condition
  useEffect(() => {
    if (
      appliedMin === 50 &&
      appliedMax === 125 &&
      !successFiredRef.current
    ) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [appliedMin, appliedMax, onSuccess]);

  const filterModel: FilterModel = {
    table_id: 'orders',
    logic_operator: 'AND',
    global_filter: null,
    column_filters: appliedMin !== null && appliedMax !== null
      ? [{ column: 'Amount', operator: 'between_inclusive' as const, value: { min: appliedMin, max: appliedMax } }]
      : [],
  };

  // Filter data based on applied range
  const filteredData = ordersData.filter(record => {
    if (appliedMin !== null && record.amount < appliedMin) return false;
    if (appliedMax !== null && record.amount > appliedMax) return false;
    return true;
  });

  return (
    <Card style={{ width: 800 }}>
      <div style={{ marginBottom: 16, fontWeight: 500, fontSize: 16 }}>Orders</div>
      <Table
        dataSource={filteredData}
        columns={columns}
        pagination={false}
        size="middle"
        rowKey="key"
        data-testid="table-orders"
        data-filter-model={JSON.stringify(filterModel)}
      />
    </Card>
  );
}
