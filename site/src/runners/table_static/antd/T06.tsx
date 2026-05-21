'use client';

/**
 * table_static-antd-T06: Pick a ticket from the correct table (2 instances)
 *
 * The page is a dashboard layout with two Ant Design Table instances side-by-side in separate cards: "Open
 * tickets" on the left and "Closed tickets" on the right. Both tables share similar columns (Ticket, Subject, Priority)
 * and both contain ticket-like IDs, making them easy to confuse. Only one row can be selected per table, and selection is
 * independent per table. Initial state: a row in the Closed tickets table is already selected; Open tickets has no selection.
 * There are no additional dashboard widgets beyond the two table cards.
 */

import React, { useState } from 'react';
import { Table, Card } from 'antd';
import type { TaskComponentProps } from '../types';

interface TicketData {
  key: string;
  ticket: string;
  subject: string;
  priority: string;
}

const openTicketsData: TicketData[] = [
  { key: 'TCK-330', ticket: 'TCK-330', subject: 'Login issues on mobile', priority: 'High' },
  { key: 'TCK-331', ticket: 'TCK-331', subject: 'Payment failed error', priority: 'Critical' },
  { key: 'TCK-332', ticket: 'TCK-332', subject: 'Dashboard not loading', priority: 'Medium' },
  { key: 'TCK-333', ticket: 'TCK-333', subject: 'Email notifications delayed', priority: 'Low' },
  { key: 'TCK-334', ticket: 'TCK-334', subject: 'Export feature broken', priority: 'High' },
];

const closedTicketsData: TicketData[] = [
  { key: 'TCK-325', ticket: 'TCK-325', subject: 'Password reset issue', priority: 'High' },
  { key: 'TCK-326', ticket: 'TCK-326', subject: 'API rate limiting', priority: 'Medium' },
  { key: 'TCK-327', ticket: 'TCK-327', subject: 'Billing address update', priority: 'Low' },
  { key: 'TCK-328', ticket: 'TCK-328', subject: 'Search not working', priority: 'Critical' },
  { key: 'TCK-329', ticket: 'TCK-329', subject: 'Account verification', priority: 'Medium' },
];

const columns = [
  { title: 'Ticket', dataIndex: 'ticket', key: 'ticket' },
  { title: 'Subject', dataIndex: 'subject', key: 'subject' },
  { title: 'Priority', dataIndex: 'priority', key: 'priority' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [openSelectedKey, setOpenSelectedKey] = useState<string | null>(null);
  const [closedSelectedKey, setClosedSelectedKey] = useState<string | null>('TCK-326');

  const handleOpenRowClick = (record: TicketData) => {
    setOpenSelectedKey(record.key);
    if (record.key === 'TCK-331') {
      onSuccess();
    }
  };

  const handleClosedRowClick = (record: TicketData) => {
    setClosedSelectedKey(record.key);
  };

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <Card 
        title="Open tickets" 
        style={{ flex: 1, minWidth: 350 }}
        data-cb-instance="Open tickets"
      >
        <Table
          dataSource={openTicketsData}
          columns={columns}
          pagination={false}
          size="middle"
          rowKey="key"
          onRow={(record) => ({
            onClick: () => handleOpenRowClick(record),
            'aria-selected': openSelectedKey === record.key,
            'data-row-key': record.key,
            style: {
              cursor: 'pointer',
              background: openSelectedKey === record.key ? '#e6f7ff' : undefined,
            },
          })}
        />
      </Card>

      <Card 
        title="Closed tickets" 
        style={{ flex: 1, minWidth: 350 }}
        data-cb-instance="Closed tickets"
      >
        <Table
          dataSource={closedTicketsData}
          columns={columns}
          pagination={false}
          size="middle"
          rowKey="key"
          onRow={(record) => ({
            onClick: () => handleClosedRowClick(record),
            'aria-selected': closedSelectedKey === record.key,
            'data-row-key': record.key,
            style: {
              cursor: 'pointer',
              background: closedSelectedKey === record.key ? '#e6f7ff' : undefined,
            },
          })}
        />
      </Card>
    </div>
  );
}
