'use client';

/**
 * data_table_filterable-antd-T10: Modal: Filter by Signup date range
 *
 * Scene context: theme=light; spacing=comfortable; layout=modal_flow; placement=center; scale=default;
 * instances=1; guidance=text; clutter=none.
 *
 * Layout: modal_flow. The main page shows a single button "Open orders table". Clicking it opens a centered modal titled
 * "Filter Orders".
 *
 * Inside the modal is an Ant Design Table titled "Orders" (default scale, comfortable spacing).
 *
 * The Signup date column header has a filter icon. Clicking it opens a popover containing an AntD DatePicker.RangePicker.
 *
 * Within the date picker, selecting a start date and end date fills two fields; an OK button in the filter popover applies
 * the date range to the table.
 *
 * Initial state: modal closed; no filters active.
 *
 * Success: Signup date filter is set to the inclusive range [2024-01-01, 2024-03-31] after clicking OK.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Table, Card, Modal, Button, DatePicker, Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import type { ColumnsType, FilterDropdownProps } from 'antd/es/table/interface';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { TaskComponentProps, FilterModel } from '../types';

const { RangePicker } = DatePicker;

interface OrderData {
  key: string;
  orderId: string;
  customer: string;
  signupDate: string;
  status: string;
}

const ordersData: OrderData[] = [
  { key: '1', orderId: 'ORD-1001', customer: 'Alice Johnson', signupDate: '2024-01-15', status: 'Active' },
  { key: '2', orderId: 'ORD-1002', customer: 'Bob Smith', signupDate: '2024-02-20', status: 'Active' },
  { key: '3', orderId: 'ORD-1003', customer: 'Carol White', signupDate: '2024-03-10', status: 'Inactive' },
  { key: '4', orderId: 'ORD-1004', customer: 'David Brown', signupDate: '2024-04-05', status: 'Active' },
  { key: '5', orderId: 'ORD-1005', customer: 'Eva Martinez', signupDate: '2024-01-25', status: 'Active' },
  { key: '6', orderId: 'ORD-1006', customer: 'Frank Lee', signupDate: '2024-05-12', status: 'Inactive' },
  { key: '7', orderId: 'ORD-1007', customer: 'Grace Kim', signupDate: '2024-03-31', status: 'Active' },
  { key: '8', orderId: 'ORD-1008', customer: 'Henry Chen', signupDate: '2024-02-01', status: 'Active' },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [appliedDateRange, setAppliedDateRange] = useState<[string, string] | null>(null);
  const successFiredRef = useRef(false);

  const handleApply = (confirm: () => void) => {
    if (dateRange && dateRange[0] && dateRange[1]) {
      setAppliedDateRange([
        dateRange[0].format('YYYY-MM-DD'),
        dateRange[1].format('YYYY-MM-DD'),
      ]);
    }
    confirm();
  };

  const handleReset = (clearFilters: () => void) => {
    setDateRange(null);
    setAppliedDateRange(null);
    clearFilters();
  };

  const columns: ColumnsType<OrderData> = [
    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId' },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    {
      title: 'Signup date',
      dataIndex: 'signupDate',
      key: 'signupDate',
      filterDropdown: ({ confirm, clearFilters }: FilterDropdownProps) => (
        <div style={{ padding: 12 }}>
          <div style={{ marginBottom: 12 }}>
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates)}
              format="YYYY-MM-DD"
              data-testid="signup-date-range-picker"
            />
          </div>
          <Space>
            <Button
              type="primary"
              onClick={() => handleApply(confirm)}
              size="small"
            >
              OK
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
        <FilterOutlined style={{ color: appliedDateRange ? '#1677ff' : undefined }} />
      ),
    },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  // Check success condition
  useEffect(() => {
    if (
      appliedDateRange &&
      appliedDateRange[0] === '2024-01-01' &&
      appliedDateRange[1] === '2024-03-31' &&
      !successFiredRef.current
    ) {
      successFiredRef.current = true;
      onSuccess();
    }
  }, [appliedDateRange, onSuccess]);

  const filterModel: FilterModel = {
    table_id: 'orders_modal',
    logic_operator: 'AND',
    global_filter: null,
    column_filters: appliedDateRange
      ? [{
          column: 'Signup date',
          operator: 'date_between_inclusive' as const,
          value: { start: appliedDateRange[0], end: appliedDateRange[1] },
        }]
      : [],
  };

  // Filter data based on applied date range
  const filteredData = ordersData.filter(record => {
    if (!appliedDateRange) return true;
    const recordDate = dayjs(record.signupDate);
    const startDate = dayjs(appliedDateRange[0]);
    const endDate = dayjs(appliedDateRange[1]);
    return recordDate.isAfter(startDate.subtract(1, 'day')) && recordDate.isBefore(endDate.add(1, 'day'));
  });

  return (
    <Card style={{ width: 400, textAlign: 'center' }}>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Open orders table
      </Button>

      <Modal
        title="Filter Orders"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
        ]}
        width={800}
      >
        <div style={{ marginBottom: 16, fontWeight: 500, fontSize: 16 }}>Orders</div>
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={false}
          size="middle"
          rowKey="key"
          data-testid="table-orders-modal"
          data-filter-model={JSON.stringify(filterModel)}
        />
      </Modal>
    </Card>
  );
}
