'use client';

/**
 * data_table_sortable-antd-T01: Invoices - sort Amount low→high
 *
 * Baseline scene with a single Ant Design Table inside an isolated card titled "Invoices".
 * - The table is centered on the page and uses default size and comfortable spacing.
 * - Columns (left→right): Invoice #, Client, Amount, Due date, Status.
 * - Only some columns are sortable; sortable headers show the standard AntD sorter affordance.
 * - Initial state: no active sort (all headers show the neutral sorter icon).
 * - There are ~15 rows with distinct Amount values so the sort order is unambiguous.
 *
 * Success: Amount column sorted ascending.
 */

import React, { useState, useEffect } from 'react';
import { Table, Card } from 'antd';
import type { ColumnsType, SorterResult } from 'antd/es/table/interface';
import type { TaskComponentProps, SortModel } from '../types';

interface InvoiceData {
  key: string;
  invoiceNum: string;
  client: string;
  amount: number;
  dueDate: string;
  status: string;
}

const invoicesData: InvoiceData[] = [
  { key: '1', invoiceNum: 'INV-1001', client: 'Acme Corp', amount: 1250.00, dueDate: '2024-02-15', status: 'Paid' },
  { key: '2', invoiceNum: 'INV-1002', client: 'TechStart Inc', amount: 890.50, dueDate: '2024-02-20', status: 'Pending' },
  { key: '3', invoiceNum: 'INV-1003', client: 'Global Systems', amount: 2340.00, dueDate: '2024-02-10', status: 'Paid' },
  { key: '4', invoiceNum: 'INV-1004', client: 'DataFlow Ltd', amount: 567.25, dueDate: '2024-03-01', status: 'Overdue' },
  { key: '5', invoiceNum: 'INV-1005', client: 'CloudNet Services', amount: 1780.00, dueDate: '2024-02-25', status: 'Paid' },
  { key: '6', invoiceNum: 'INV-1006', client: 'Innovate Labs', amount: 3200.00, dueDate: '2024-02-18', status: 'Pending' },
  { key: '7', invoiceNum: 'INV-1007', client: 'QuickShip Co', amount: 445.00, dueDate: '2024-03-05', status: 'Paid' },
  { key: '8', invoiceNum: 'INV-1008', client: 'FinanceHub', amount: 6100.00, dueDate: '2024-02-28', status: 'Pending' },
  { key: '9', invoiceNum: 'INV-1009', client: 'MarketPro', amount: 920.75, dueDate: '2024-02-12', status: 'Paid' },
  { key: '10', invoiceNum: 'INV-1010', client: 'DesignWorks', amount: 1100.00, dueDate: '2024-03-10', status: 'Overdue' },
  { key: '11', invoiceNum: 'INV-1011', client: 'SecureIT', amount: 2850.00, dueDate: '2024-02-22', status: 'Paid' },
  { key: '12', invoiceNum: 'INV-1012', client: 'BuildRight', amount: 750.00, dueDate: '2024-03-15', status: 'Pending' },
  { key: '13', invoiceNum: 'INV-1013', client: 'WebScale', amount: 4500.00, dueDate: '2024-02-08', status: 'Paid' },
  { key: '14', invoiceNum: 'INV-1014', client: 'DataVault', amount: 1650.00, dueDate: '2024-03-20', status: 'Pending' },
  { key: '15', invoiceNum: 'INV-1015', client: 'CodeCraft', amount: 2100.00, dueDate: '2024-02-05', status: 'Paid' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [sortedInfo, setSortedInfo] = useState<SorterResult<InvoiceData>>({});

  const columns: ColumnsType<InvoiceData> = [
    { title: 'Invoice #', dataIndex: 'invoiceNum', key: 'invoiceNum' },
    { title: 'Client', dataIndex: 'client', key: 'client' },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => a.amount - b.amount,
      sortOrder: sortedInfo.columnKey === 'amount' ? sortedInfo.order : null,
      render: (val: number) => `$${val.toFixed(2)}`,
    },
    {
      title: 'Due date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      sorter: (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
      sortOrder: sortedInfo.columnKey === 'dueDate' ? sortedInfo.order : null,
    },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  const handleChange = (_pagination: unknown, _filters: unknown, sorter: SorterResult<InvoiceData> | SorterResult<InvoiceData>[]) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    setSortedInfo(singleSorter || {});
  };

  // Check success condition
  useEffect(() => {
    if (sortedInfo.columnKey === 'amount' && sortedInfo.order === 'ascend') {
      onSuccess();
    }
  }, [sortedInfo, onSuccess]);

  // Build sort model for data attribute
  const sortModel: SortModel = sortedInfo.columnKey && sortedInfo.order
    ? [{ column_key: String(sortedInfo.columnKey), direction: sortedInfo.order === 'ascend' ? 'asc' : 'desc', priority: 1 }]
    : [];

  return (
    <Card style={{ width: 800 }}>
      <div style={{ marginBottom: 16, fontWeight: 500 }}>Invoices</div>
      <Table
        dataSource={invoicesData}
        columns={columns}
        pagination={false}
        size="middle"
        rowKey="key"
        onChange={handleChange}
        data-testid="table-invoices"
        data-sort-model={JSON.stringify(sortModel)}
      />
    </Card>
  );
}
