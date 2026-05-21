'use client';

/**
 * tags_input-antd-T10: Edit tags in the correct table row
 *
 * The page shows an invoices **table** (table_cell layout) with two visible rows and several columns.
 * One column is "Labels", and each visible row has its own Ant Design Select in **tags** mode embedded directly in the cell (always visible, no separate edit mode).
 *
 * Rows:
 * - Row 1: "Invoice #1042" (target row)
 * - Row 2: "Invoice #1043" (distractor row)
 *
 * Initial state:
 * - Invoice #1042 Labels has one chip: "pending".
 * - Invoice #1043 Labels has two chips: "paid" and "do-not-edit".
 *
 * Interaction constraints:
 * - The tags input in each cell is narrow (table column width), so the click target is smaller and chips may wrap.
 * - There is no Save button; edits apply immediately in the cell.
 *
 * Distractors:
 * - The table header includes sortable column icons and a "Filter" button above the table (not required).
 * - Both tag inputs look identical except for their row context.
 *
 * Success: The target Tags Input component (Invoice #1042 Labels) contains exactly these tags (order does not matter): paid, archived.
 */

import React, { useRef, useEffect } from 'react';
import { Table, Select, Typography, Button } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

interface InvoiceRow {
  key: string;
  invoice: string;
  amount: string;
  date: string;
  labels: string[];
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [row1042Labels, setRow1042Labels] = React.useState<string[]>(['pending']);
  const [row1043Labels, setRow1043Labels] = React.useState<string[]>(['paid', 'do-not-edit']);
  const hasSucceeded = useRef(false);

  useEffect(() => {
    const normalizedTags = row1042Labels.map(t => t.toLowerCase().trim());
    const requiredTags = ['paid', 'archived'];
    const isSuccess = requiredTags.length === normalizedTags.length &&
      requiredTags.every(t => normalizedTags.includes(t));
    
    // Also verify non-target row is unchanged
    const otherRowUnchanged = row1043Labels.length === 2 && 
      row1043Labels.includes('paid') && 
      row1043Labels.includes('do-not-edit');
    
    if (isSuccess && otherRowUnchanged && !hasSucceeded.current) {
      hasSucceeded.current = true;
      onSuccess();
    }
  }, [row1042Labels, row1043Labels, onSuccess]);

  const columns = [
    {
      title: 'Invoice',
      dataIndex: 'invoice',
      key: 'invoice',
      sorter: true,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      sorter: true,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: true,
    },
    {
      title: 'Labels',
      key: 'labels',
      width: 200,
      render: (_: unknown, record: InvoiceRow) => {
        const isTarget = record.invoice === 'Invoice #1042';
        return (
          <Select
            mode="tags"
            size="small"
            style={{ width: '100%' }}
            value={isTarget ? row1042Labels : row1043Labels}
            onChange={isTarget ? setRow1042Labels : setRow1043Labels}
            data-testid={isTarget ? 'invoice-1042-labels' : 'invoice-1043-labels'}
            aria-label={`${record.invoice} Labels`}
            open={false}
          />
        );
      },
    },
  ];

  const data: InvoiceRow[] = [
    {
      key: '1042',
      invoice: 'Invoice #1042',
      amount: '$1,250.00',
      date: '2026-01-15',
      labels: row1042Labels,
    },
    {
      key: '1043',
      invoice: 'Invoice #1043',
      amount: '$890.00',
      date: '2026-01-20',
      labels: row1043Labels,
    },
  ];

  return (
    <div style={{ width: 700 }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text strong style={{ fontSize: 18 }}>Invoices</Text>
        <Button size="small">Filter</Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        size="small"
      />
    </div>
  );
}
