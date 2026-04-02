'use client';

/**
 * autocomplete_restricted-antd-T10: Edit priority in a table row
 *
 * setup_description:
 * The page is a simple **table view** titled "Tickets" (table_cell layout), centered with minimal chrome.
 *
 * A small table shows 3 rows (tickets #1040, #1041, #1042) and columns:
 * - Ticket #
 * - Title
 * - **Priority** (editable)
 *
 * Each row's Priority cell uses an Ant Design Select (restricted options) that is shown when the cell is clicked.
 * - Theme: light; spacing: comfortable; size: default.
 * - Options: Low, Medium, High.
 * - Initial state:
 *   - #1040: Medium
 *   - #1041: Low
 *   - #1042: Medium  ← target row to change to High
 * - To edit, click the Priority cell in the target row, then select a new priority.
 *
 * There are **three instances** of the same canonical component (one per row). No other UI controls are needed for success.
 *
 * Success: The ticket #1042 Priority Select has selected value "High".
 */

import React, { useState, useRef, useEffect } from 'react';
import { Card, Select, Typography, Table } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

const priorities = [
  { label: 'Low', value: 'Low' },
  { label: 'Medium', value: 'Medium' },
  { label: 'High', value: 'High' },
];

interface TicketRow {
  key: string;
  ticketNum: string;
  title: string;
  priority: string;
}

export default function T10({ onSuccess }: TaskComponentProps) {
  const [data, setData] = useState<TicketRow[]>([
    { key: '1040', ticketNum: '#1040', title: 'Fix login bug', priority: 'Medium' },
    { key: '1041', ticketNum: '#1041', title: 'Update documentation', priority: 'Low' },
    { key: '1042', ticketNum: '#1042', title: 'Add export feature', priority: 'Medium' },
  ]);
  const successFired = useRef(false);

  useEffect(() => {
    const ticket1042 = data.find(row => row.key === '1042');
    if (!successFired.current && ticket1042?.priority === 'High') {
      successFired.current = true;
      onSuccess();
    }
  }, [data, onSuccess]);

  const handlePriorityChange = (key: string, newPriority: string) => {
    setData(prev =>
      prev.map(row =>
        row.key === key ? { ...row, priority: newPriority } : row
      )
    );
  };

  const columns = [
    {
      title: 'Ticket #',
      dataIndex: 'ticketNum',
      key: 'ticketNum',
      width: 100,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 140,
      render: (_: string, record: TicketRow) => (
        <Select
          data-testid={`tickets[${record.ticketNum}].priority`}
          style={{ width: 120 }}
          value={record.priority}
          onChange={(newValue) => handlePriorityChange(record.key, newValue)}
          options={priorities}
          size="small"
        />
      ),
    },
  ];

  return (
    <Card title="Tickets" style={{ width: 550 }}>
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        size="small"
      />
    </Card>
  );
}
