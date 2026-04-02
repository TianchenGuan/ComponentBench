'use client';

/**
 * autocomplete_freeform-antd-T08: Edit the Approver cell for a specific invoice row
 *
 * setup_description:
 * The page shows a compact Ant Design Table in the center of the viewport with the caption "Invoice assignments".
 *
 * There are three visible rows with invoice IDs in the first column: "INV-1040", "INV-1042", and "INV-1047". The second column is labeled "Approver".
 *
 * Only the row "INV-1042" has an editable Ant Design AutoComplete in its Approver cell (single instance of the canonical component on the page). The other rows show plain text approver names and are not editable.
 *
 * The AutoComplete suggestion list includes similar staff names ("Dana Wu", "Daniel Wu", "Dina Wu", "Alex Kim", "Morgan Lee"). The dropdown opens when the user clicks into the INV-1042 Approver cell.
 *
 * Initial state: INV-1042 Approver is empty. Distractors: a read-only Status column and Amount column are present but not interactive. Feedback: once a name is selected/entered, it is shown inline in the INV-1042 Approver cell.
 *
 * Success: The INV-1042 Approver AutoComplete cell's displayed value equals "Dana Wu" (trim whitespace).
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, Table, AutoComplete, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const approvers = [
  { value: 'Dana Wu' },
  { value: 'Daniel Wu' },
  { value: 'Dina Wu' },
  { value: 'Alex Kim' },
  { value: 'Morgan Lee' },
];

interface InvoiceRow {
  key: string;
  invoiceId: string;
  approver: string;
  status: string;
  amount: string;
  editable: boolean;
}

const initialData: InvoiceRow[] = [
  { key: '1', invoiceId: 'INV-1040', approver: 'Alex Kim', status: 'Paid', amount: '$1,200', editable: false },
  { key: '2', invoiceId: 'INV-1042', approver: '', status: 'Pending', amount: '$850', editable: true },
  { key: '3', invoiceId: 'INV-1047', approver: 'Morgan Lee', status: 'Draft', amount: '$2,100', editable: false },
];

export default function T08({ onSuccess }: TaskComponentProps) {
  const [approverValue, setApproverValue] = useState('');
  const successFired = useRef(false);

  const normalizedValue = approverValue.trim();
  const targetValue = 'Dana Wu';

  useEffect(() => {
    if (!successFired.current && normalizedValue === targetValue) {
      successFired.current = true;
      onSuccess();
    }
  }, [normalizedValue, onSuccess]);

  const columns = [
    {
      title: 'Invoice ID',
      dataIndex: 'invoiceId',
      key: 'invoiceId',
      render: (text: string, record: InvoiceRow) => (
        <span data-row-id={record.invoiceId}>{text}</span>
      ),
    },
    {
      title: 'Approver',
      dataIndex: 'approver',
      key: 'approver',
      render: (text: string, record: InvoiceRow) => {
        if (record.editable) {
          return (
            <AutoComplete
              data-testid="approver-inv-1042"
              style={{ width: 160 }}
              options={approvers}
              placeholder="Select approver"
              value={approverValue}
              onChange={(newValue) => setApproverValue(newValue)}
              filterOption={(inputValue, option) =>
                option!.value.toLowerCase().includes(inputValue.toLowerCase())
              }
              size="small"
            />
          );
        }
        return <Text>{text}</Text>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
  ];

  return (
    <Card title="Invoice assignments" style={{ width: 600 }}>
      <Table
        dataSource={initialData}
        columns={columns}
        pagination={false}
        size="small"
      />
    </Card>
  );
}
