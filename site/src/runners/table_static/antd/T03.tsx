'use client';

/**
 * table_static-antd-T03: Clear the current row highlight
 *
 * A centered isolated card shows a read-only Payment Methods table (Ant Design Table) with columns: Method,
 * Last used, and Status. The first row ("Visa •• 1234") starts selected and highlighted. A small inline control in the table
 * header area reads "Clear selection" (text button) which removes the highlight and sets the table selection state to empty.
 * The table has ~6 rows and no pagination/sorting.
 */

import React, { useState } from 'react';
import { Table, Card, Button } from 'antd';
import type { TaskComponentProps } from '../types';

interface PaymentMethodData {
  key: string;
  method: string;
  lastUsed: string;
  status: string;
}

const paymentMethodsData: PaymentMethodData[] = [
  { key: 'visa-1234', method: 'Visa •• 1234', lastUsed: 'Dec 15, 2024', status: 'Active' },
  { key: 'mastercard-5678', method: 'Mastercard •• 5678', lastUsed: 'Nov 20, 2024', status: 'Active' },
  { key: 'amex-9012', method: 'Amex •• 9012', lastUsed: 'Oct 5, 2024', status: 'Expired' },
  { key: 'paypal', method: 'PayPal (john@example.com)', lastUsed: 'Dec 10, 2024', status: 'Active' },
  { key: 'bank-checking', method: 'Bank Account •• 4567', lastUsed: 'Sep 1, 2024', status: 'Active' },
  { key: 'apple-pay', method: 'Apple Pay', lastUsed: 'Dec 18, 2024', status: 'Active' },
];

const columns = [
  { title: 'Method', dataIndex: 'method', key: 'method' },
  { title: 'Last used', dataIndex: 'lastUsed', key: 'lastUsed' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
];

export default function T03({ onSuccess }: TaskComponentProps) {
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>('visa-1234');

  const handleClearSelection = () => {
    setSelectedRowKey(null);
    onSuccess();
  };

  const handleRowClick = (record: PaymentMethodData) => {
    setSelectedRowKey(record.key);
  };

  return (
    <Card 
      style={{ width: 550 }}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Payment Methods</span>
          <Button 
            type="link" 
            size="small" 
            onClick={handleClearSelection}
            data-testid="cb-clear-selection"
          >
            Clear selection
          </Button>
        </div>
      }
    >
      <Table
        dataSource={paymentMethodsData}
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
