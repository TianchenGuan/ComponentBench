'use client';

/**
 * data_grid_row_selection-antd-T03: Clear all selected rows
 *
 * The page shows a centered isolated card titled "Orders". Inside is an Ant Design Table with a checkbox
 * selection column.
 * Above the table header, a small action row shows a text like "2 selected" and a secondary button labeled
 * "Clear selection".
 * Spacing is comfortable and size is default. The table contains 7 visible rows (no pagination) with columns:
 * Order ID, Customer, Total.
 * Initial state: two rows are pre-selected (order keys ord_1002 and ord_1005 are checked). Clicking
 * "Clear selection" sets selectedRowKeys to an empty list.
 * Feedback is immediate: the selected count text updates and all row checkboxes become unchecked.
 *
 * Success: selected_row_ids equals []
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Space } from 'antd';
import type { ColumnsType, TableRowSelection } from 'antd/es/table/interface';
import type { TaskComponentProps } from '../types';
import { selectionEquals } from '../types';

interface OrderData {
  key: string;
  orderId: string;
  customer: string;
  total: number;
}

const ordersData: OrderData[] = [
  { key: 'ord_1001', orderId: 'ORD-1001', customer: 'Acme Corp', total: 1250.00 },
  { key: 'ord_1002', orderId: 'ORD-1002', customer: 'TechStart Inc', total: 890.50 },
  { key: 'ord_1003', orderId: 'ORD-1003', customer: 'Global Systems', total: 2340.00 },
  { key: 'ord_1004', orderId: 'ORD-1004', customer: 'DataFlow Ltd', total: 567.25 },
  { key: 'ord_1005', orderId: 'ORD-1005', customer: 'CloudNet Services', total: 1780.00 },
  { key: 'ord_1006', orderId: 'ORD-1006', customer: 'Innovate Labs', total: 3200.00 },
  { key: 'ord_1007', orderId: 'ORD-1007', customer: 'QuickShip Co', total: 445.00 },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>(['ord_1002', 'ord_1005']);

  const columns: ColumnsType<OrderData> = [
    { title: 'Order ID', dataIndex: 'orderId', key: 'orderId' },
    { title: 'Customer', dataIndex: 'customer', key: 'customer' },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (val: number) => `$${val.toFixed(2)}`,
    },
  ];

  const rowSelection: TableRowSelection<OrderData> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const handleClearSelection = () => {
    setSelectedRowKeys([]);
  };

  // Check success condition
  useEffect(() => {
    if (selectionEquals(selectedRowKeys as string[], [])) {
      onSuccess();
    }
  }, [selectedRowKeys, onSuccess]);

  return (
    <Card style={{ width: 600 }}>
      <div style={{ marginBottom: 16, fontWeight: 500, fontSize: 16 }}>Orders</div>
      <Space style={{ marginBottom: 16 }}>
        <span>{selectedRowKeys.length} selected</span>
        <Button
          type="default"
          size="small"
          onClick={handleClearSelection}
          data-testid="clear-selection-btn"
        >
          Clear selection
        </Button>
      </Space>
      <Table
        dataSource={ordersData}
        columns={columns}
        rowSelection={rowSelection}
        pagination={false}
        size="middle"
        rowKey="key"
        data-testid="orders-table"
        data-selected-row-ids={JSON.stringify(selectedRowKeys)}
      />
    </Card>
  );
}
