'use client';

/**
 * data_grid_row_selection-antd-T02: Select three specific customers
 *
 * Baseline isolated card centered in the viewport with the title "Customers". It contains one Ant Design
 * Table with a checkbox selection column (rowSelection).
 * Spacing is comfortable and size is default. The table shows 10 rows with columns: Customer ID, Name, Region, Status.
 * Initial state: no rows are selected. There is no pagination and no additional controls.
 * The three target rows are all visible at once and have unambiguous ID+Name pairs.
 *
 * Success: selected_row_ids equals ['cust_C007', 'cust_C021', 'cust_C033']
 */

import React, { useState, useEffect } from 'react';
import { Table, Card } from 'antd';
import type { ColumnsType, TableRowSelection } from 'antd/es/table/interface';
import type { TaskComponentProps } from '../types';
import { selectionEquals } from '../types';

interface CustomerData {
  key: string;
  customerId: string;
  name: string;
  region: string;
  status: string;
}

const customersData: CustomerData[] = [
  { key: 'cust_C005', customerId: 'C-005', name: 'Alex Turner', region: 'North', status: 'Active' },
  { key: 'cust_C007', customerId: 'C-007', name: 'Bruno Silva', region: 'South', status: 'Active' },
  { key: 'cust_C012', customerId: 'C-012', name: 'Diana Ross', region: 'East', status: 'Pending' },
  { key: 'cust_C015', customerId: 'C-015', name: 'Erik Larson', region: 'West', status: 'Active' },
  { key: 'cust_C018', customerId: 'C-018', name: 'Fiona Chen', region: 'North', status: 'Active' },
  { key: 'cust_C021', customerId: 'C-021', name: 'Mei Wong', region: 'East', status: 'Active' },
  { key: 'cust_C025', customerId: 'C-025', name: 'Hans Mueller', region: 'South', status: 'Inactive' },
  { key: 'cust_C028', customerId: 'C-028', name: 'Isabella Rossi', region: 'West', status: 'Active' },
  { key: 'cust_C033', customerId: 'C-033', name: 'Omar Haddad', region: 'North', status: 'Active' },
  { key: 'cust_C040', customerId: 'C-040', name: 'Yuki Tanaka', region: 'East', status: 'Pending' },
];

export default function T02({ onSuccess }: TaskComponentProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const columns: ColumnsType<CustomerData> = [
    { title: 'Customer ID', dataIndex: 'customerId', key: 'customerId' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Region', dataIndex: 'region', key: 'region' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  const rowSelection: TableRowSelection<CustomerData> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  // Check success condition
  useEffect(() => {
    if (selectionEquals(selectedRowKeys as string[], ['cust_C007', 'cust_C021', 'cust_C033'])) {
      onSuccess();
    }
  }, [selectedRowKeys, onSuccess]);

  return (
    <Card style={{ width: 700 }}>
      <div style={{ marginBottom: 16, fontWeight: 500, fontSize: 16 }}>Customers</div>
      <Table
        dataSource={customersData}
        columns={columns}
        rowSelection={rowSelection}
        pagination={false}
        size="middle"
        rowKey="key"
        data-testid="customers-table"
        data-selected-row-ids={JSON.stringify(selectedRowKeys)}
      />
    </Card>
  );
}
