'use client';

/**
 * data_grid_row_selection-antd-T10: Select invoices across pages in dark theme
 *
 * The page uses the baseline isolated card layout but in a dark theme. A single card titled "Invoices"
 * contains an Ant Design Table with checkbox row selection and pagination controls at the bottom.
 * Spacing is comfortable and scale is default. Page size is 5 rows, with 3 pages total. Columns are
 * Invoice ID, Client, Amount, Due date.
 * Initial state: no rows are selected. Selection is configured to persist across pagination (so selecting
 * a row on page 1 remains selected after moving to page 2/3).
 * INV-1003 is visible on page 1. INV-1011 is on page 3. The agent must navigate between pages and ensure
 * both invoices are selected at the same time.
 *
 * Success: selected_row_ids equals ['inv_1003', 'inv_1011']
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, ConfigProvider, theme } from 'antd';
import type { ColumnsType, TableRowSelection } from 'antd/es/table/interface';
import type { TaskComponentProps } from '../types';
import { selectionEquals } from '../types';

interface InvoiceData {
  key: string;
  invoiceId: string;
  client: string;
  amount: number;
  dueDate: string;
}

// 15 invoices spread across 3 pages
const invoicesData: InvoiceData[] = [
  // Page 1 (INV-1001 to INV-1005)
  { key: 'inv_1001', invoiceId: 'INV-1001', client: 'Acme Corp', amount: 1250.00, dueDate: '2024-02-15' },
  { key: 'inv_1002', invoiceId: 'INV-1002', client: 'TechStart Inc', amount: 890.50, dueDate: '2024-02-20' },
  { key: 'inv_1003', invoiceId: 'INV-1003', client: 'Global Systems', amount: 2340.00, dueDate: '2024-02-10' },
  { key: 'inv_1004', invoiceId: 'INV-1004', client: 'DataFlow Ltd', amount: 567.25, dueDate: '2024-03-01' },
  { key: 'inv_1005', invoiceId: 'INV-1005', client: 'CloudNet Services', amount: 1780.00, dueDate: '2024-02-25' },
  // Page 2 (INV-1006 to INV-1010)
  { key: 'inv_1006', invoiceId: 'INV-1006', client: 'Innovate Labs', amount: 3200.00, dueDate: '2024-02-18' },
  { key: 'inv_1007', invoiceId: 'INV-1007', client: 'QuickShip Co', amount: 445.00, dueDate: '2024-03-05' },
  { key: 'inv_1008', invoiceId: 'INV-1008', client: 'FinanceHub', amount: 6100.00, dueDate: '2024-02-28' },
  { key: 'inv_1009', invoiceId: 'INV-1009', client: 'MarketPro', amount: 920.75, dueDate: '2024-02-12' },
  { key: 'inv_1010', invoiceId: 'INV-1010', client: 'DesignWorks', amount: 1100.00, dueDate: '2024-03-10' },
  // Page 3 (INV-1011 to INV-1015)
  { key: 'inv_1011', invoiceId: 'INV-1011', client: 'SecureIT', amount: 2850.00, dueDate: '2024-02-22' },
  { key: 'inv_1012', invoiceId: 'INV-1012', client: 'BuildRight', amount: 750.00, dueDate: '2024-03-15' },
  { key: 'inv_1013', invoiceId: 'INV-1013', client: 'WebScale', amount: 4500.00, dueDate: '2024-02-08' },
  { key: 'inv_1014', invoiceId: 'INV-1014', client: 'DataVault', amount: 1650.00, dueDate: '2024-03-20' },
  { key: 'inv_1015', invoiceId: 'INV-1015', client: 'CodeCraft', amount: 2100.00, dueDate: '2024-02-05' },
];

export default function T10({ onSuccess }: TaskComponentProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const columns: ColumnsType<InvoiceData> = [
    { title: 'Invoice ID', dataIndex: 'invoiceId', key: 'invoiceId' },
    { title: 'Client', dataIndex: 'client', key: 'client' },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (val: number) => `$${val.toFixed(2)}`,
    },
    { title: 'Due date', dataIndex: 'dueDate', key: 'dueDate' },
  ];

  const rowSelection: TableRowSelection<InvoiceData> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    preserveSelectedRowKeys: true, // Persist selection across pages
  };

  // Check success condition
  useEffect(() => {
    if (selectionEquals(selectedRowKeys as string[], ['inv_1003', 'inv_1011'])) {
      onSuccess();
    }
  }, [selectedRowKeys, onSuccess]);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <Card
        style={{
          width: 700,
          background: '#1f1f1f',
          borderColor: '#303030',
        }}
      >
        <div style={{ marginBottom: 16, fontWeight: 500, fontSize: 16, color: '#fff' }}>Invoices</div>
        <div style={{ marginBottom: 8, fontSize: 12, color: '#888' }}>
          {selectedRowKeys.length} selected (selection persists across pages)
        </div>
        <Table
          dataSource={invoicesData}
          columns={columns}
          rowSelection={rowSelection}
          pagination={{
            pageSize: 5,
            showSizeChanger: false,
          }}
          size="middle"
          rowKey="key"
          data-testid="invoices-table"
          data-selected-row-ids={JSON.stringify(selectedRowKeys)}
        />
      </Card>
    </ConfigProvider>
  );
}
