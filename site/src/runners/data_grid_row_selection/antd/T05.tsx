'use client';

/**
 * data_grid_row_selection-antd-T05: Scroll within table to select a transaction
 *
 * Layout is an isolated card anchored at the bottom-left of the viewport (not centered). The card title
 * is "Transactions".
 * The Ant Design Table uses a fixed height with a scrollable tbody (vertical scroll within the table).
 * Row selection is via the leftmost checkbox column.
 * Spacing is comfortable and size is default. The table contains 40 transactions (TX-1010 through TX-1049),
 * but only about 10 are visible at a time due to the scroll container.
 * Initial state: no rows are selected. There are no other widgets on the page.
 * The target row TX-1049 is near the bottom, requiring scrolling inside the table body to reveal it.
 *
 * Success: selected_row_ids equals ['tx_TX1049']
 */

import React, { useState, useEffect } from 'react';
import { Table, Card } from 'antd';
import type { ColumnsType, TableRowSelection } from 'antd/es/table/interface';
import type { TaskComponentProps } from '../types';
import { selectionEquals } from '../types';

interface TransactionData {
  key: string;
  transactionId: string;
  description: string;
  amount: number;
}

// Generate 40 transactions from TX-1010 to TX-1049
const transactionsData: TransactionData[] = Array.from({ length: 40 }, (_, i) => {
  const num = 1010 + i;
  return {
    key: `tx_TX${num}`,
    transactionId: `TX-${num}`,
    description: `Payment for order #${num}`,
    amount: 100 + Math.floor(Math.random() * 900),
  };
});

export default function T05({ onSuccess }: TaskComponentProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const columns: ColumnsType<TransactionData> = [
    { title: 'Transaction ID', dataIndex: 'transactionId', key: 'transactionId', width: 130 },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (val: number) => `$${val.toFixed(2)}`,
    },
  ];

  const rowSelection: TableRowSelection<TransactionData> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  // Check success condition
  useEffect(() => {
    if (selectionEquals(selectedRowKeys as string[], ['tx_TX1049'])) {
      onSuccess();
    }
  }, [selectedRowKeys, onSuccess]);

  return (
    <Card style={{ width: 550 }}>
      <div style={{ marginBottom: 16, fontWeight: 500, fontSize: 16 }}>Transactions</div>
      <Table
        dataSource={transactionsData}
        columns={columns}
        rowSelection={rowSelection}
        pagination={false}
        size="middle"
        rowKey="key"
        scroll={{ y: 350 }}
        data-testid="transactions-table"
        data-selected-row-ids={JSON.stringify(selectedRowKeys)}
      />
    </Card>
  );
}
