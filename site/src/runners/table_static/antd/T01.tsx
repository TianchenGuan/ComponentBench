'use client';

/**
 * table_static-antd-T01: Select an invoice row (by ID)
 *
 * A single Invoices table is shown in an isolated card centered on the page. The table is a read-only
 * Ant Design Table with 4 columns: Invoice ID, Customer, Amount, and Status, and about 12 visible rows (no pagination, no
 * sorting, no filters). Clicking anywhere on a row highlights that entire row (single-select) and sets aria-selected="true"
 * on that row. Initial state: no row is selected. There are no other interactive components besides the table; a small caption
 * above it reads "Invoices".
 */

import React, { useState } from 'react';
import { Table, Card } from 'antd';
import type { TaskComponentProps } from '../types';

interface InvoiceData {
  key: string;
  invoiceId: string;
  customer: string;
  amount: string;
  status: string;
}

const invoicesData: InvoiceData[] = [
  { key: 'INV-1040', invoiceId: 'INV-1040', customer: 'Acme Corp', amount: '$1,250.00', status: 'Paid' },
  { key: 'INV-1041', invoiceId: 'INV-1041', customer: 'TechStart Inc', amount: '$890.50', status: 'Pending' },
  { key: 'INV-1042', invoiceId: 'INV-1042', customer: 'Global Systems', amount: '$2,340.00', status: 'Paid' },
  { key: 'INV-1043', invoiceId: 'INV-1043', customer: 'DataFlow Ltd', amount: '$567.25', status: 'Overdue' },
  { key: 'INV-1044', invoiceId: 'INV-1044', customer: 'CloudNet Services', amount: '$1,780.00', status: 'Paid' },
  { key: 'INV-1045', invoiceId: 'INV-1045', customer: 'Innovate Labs', amount: '$3,200.00', status: 'Pending' },
  { key: 'INV-1046', invoiceId: 'INV-1046', customer: 'QuickShip Co', amount: '$445.00', status: 'Paid' },
  { key: 'INV-1047', invoiceId: 'INV-1047', customer: 'FinanceHub', amount: '$6,100.00', status: 'Pending' },
  { key: 'INV-1048', invoiceId: 'INV-1048', customer: 'MarketPro', amount: '$920.75', status: 'Paid' },
  { key: 'INV-1049', invoiceId: 'INV-1049', customer: 'DesignWorks', amount: '$1,100.00', status: 'Overdue' },
  { key: 'INV-1050', invoiceId: 'INV-1050', customer: 'SecureIT', amount: '$2,850.00', status: 'Paid' },
  { key: 'INV-1051', invoiceId: 'INV-1051', customer: 'BuildRight', amount: '$750.00', status: 'Pending' },
];

const columns = [
  { title: 'Invoice ID', dataIndex: 'invoiceId', key: 'invoiceId' },
  { title: 'Customer', dataIndex: 'customer', key: 'customer' },
  { title: 'Amount', dataIndex: 'amount', key: 'amount' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);

  const handleRowClick = (record: InvoiceData) => {
    setSelectedRowKey(record.key);
    if (record.key === 'INV-1042') {
      onSuccess();
    }
  };

  return (
    <Card style={{ width: 600 }}>
      <div style={{ marginBottom: 16, fontWeight: 500 }}>Invoices</div>
      <Table
        dataSource={invoicesData}
        columns={columns}
        pagination={false}
        size="middle"
        rowKey="key"
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          'aria-selected': selectedRowKey === record.key,
          'data-row-key': record.key,
          style: {
            cursor: 'pointer',
            background: selectedRowKey === record.key ? '#e6f7ff' : undefined,
          },
        })}
      />
    </Card>
  );
}
