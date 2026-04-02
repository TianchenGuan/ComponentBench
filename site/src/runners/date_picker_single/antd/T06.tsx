'use client';

/**
 * date_picker_single-antd-T06: Set 'Ship by' date from a table cell (small control)
 *
 * Scene: A table_cell layout showing an "Orders" table anchored near the bottom-right of the viewport (placement=bottom_right).
 * Theme is light with comfortable spacing, but the date picker control itself uses the AntD `size="small"` setting (scale=small).
 *
 * Target component: One Ant Design DatePicker embedded inside the "Ship by" column for the first row (Order #1024).
 * - Initial state: empty.
 * - Interaction: Clicking inside the table cell focuses the DatePicker input and opens the calendar popover.
 * - Popover placement is configured to prefer bottomRight alignment to the input.
 *
 * Distractors: Other rows contain non-editable dates rendered as plain text (not DatePicker components). The table also has a sortable header row and a search box above it.
 *
 * Feedback: After selecting a date, the table cell shows the formatted value and the popover closes.
 *
 * Success: Date picker must have selected date = 2026-12-01.
 */

import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Table, Input } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { TaskComponentProps } from '../types';

interface OrderRow {
  key: string;
  orderId: string;
  customer: string;
  shipBy: string | null;
  editable: boolean;
}

export default function T06({ onSuccess }: TaskComponentProps) {
  const [shipByDate, setShipByDate] = useState<Dayjs | null>(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (shipByDate && shipByDate.format('YYYY-MM-DD') === '2026-12-01') {
      onSuccess();
    }
  }, [shipByDate, onSuccess]);

  const data: OrderRow[] = [
    { key: '1', orderId: '#1024', customer: 'John Smith', shipBy: null, editable: true },
    { key: '2', orderId: '#1023', customer: 'Jane Doe', shipBy: '2026-11-20', editable: false },
    { key: '3', orderId: '#1022', customer: 'Bob Wilson', shipBy: '2026-11-18', editable: false },
  ];

  const columns = [
    {
      title: 'Order',
      dataIndex: 'orderId',
      key: 'orderId',
      sorter: true,
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      sorter: true,
    },
    {
      title: 'Ship by',
      dataIndex: 'shipBy',
      key: 'shipBy',
      render: (_: unknown, record: OrderRow) => {
        if (record.editable) {
          return (
            <DatePicker
              size="small"
              value={shipByDate}
              onChange={(date) => setShipByDate(date)}
              format="YYYY-MM-DD"
              placeholder="Select"
              data-testid="order-1024-ship-by"
              placement="bottomRight"
            />
          );
        }
        return <span>{record.shipBy}</span>;
      },
    },
  ];

  return (
    <Card title="Orders" style={{ width: 500 }}>
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search orders..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          size="small"
          style={{ width: 200 }}
          data-testid="orders-search"
        />
      </div>
      <Table
        dataSource={data}
        columns={columns}
        size="small"
        pagination={false}
      />
    </Card>
  );
}
