'use client';

/**
 * data_grid_row_selection-antd-T01: Select a single customer row
 *
 * Layout is an isolated card centered in the viewport. The card title is "Customers" and it contains
 * a single Ant Design Table with a leading checkbox selection column (rowSelection, default checkbox type).
 * Spacing is comfortable and the component is default size. The table has 8 visible rows (no pagination)
 * with columns: Customer ID, Name, Plan, Status.
 * Initial state: no rows are selected. There are no other interactive widgets on the page besides the
 * table (no clutter). Selecting a row immediately updates the checkbox and the row highlight (no Apply/OK step).
 * Row labels are unique and the target row shows "C-014" in the first data column and "Ava Patel" in the Name column.
 *
 * Success: selected_row_ids equals ['cust_C014']
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
  plan: string;
  status: string;
}

const customersData: CustomerData[] = [
  { key: 'cust_C010', customerId: 'C-010', name: 'James Wilson', plan: 'Pro', status: 'Active' },
  { key: 'cust_C011', customerId: 'C-011', name: 'Maria Garcia', plan: 'Basic', status: 'Active' },
  { key: 'cust_C012', customerId: 'C-012', name: 'Chen Wei', plan: 'Enterprise', status: 'Pending' },
  { key: 'cust_C013', customerId: 'C-013', name: 'Sofia Anderson', plan: 'Pro', status: 'Active' },
  { key: 'cust_C014', customerId: 'C-014', name: 'Ava Patel', plan: 'Basic', status: 'Active' },
  { key: 'cust_C015', customerId: 'C-015', name: 'Noah Kim', plan: 'Pro', status: 'Inactive' },
  { key: 'cust_C016', customerId: 'C-016', name: 'Emma Brown', plan: 'Enterprise', status: 'Active' },
  { key: 'cust_C017', customerId: 'C-017', name: 'Liam Johnson', plan: 'Basic', status: 'Active' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const columns: ColumnsType<CustomerData> = [
    { title: 'Customer ID', dataIndex: 'customerId', key: 'customerId' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Plan', dataIndex: 'plan', key: 'plan' },
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
    if (selectionEquals(selectedRowKeys as string[], ['cust_C014'])) {
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
