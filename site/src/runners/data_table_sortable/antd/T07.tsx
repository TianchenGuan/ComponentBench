'use client';

/**
 * data_table_sortable-antd-T07: Tickets - match the reference sort (Priority high→low)
 *
 * Single Ant Design Table in an isolated card titled "Tickets", with a small "Reference" panel.
 * - Two-column layout: left is the table, right is a compact Reference card.
 * - Reference card shows a header mock ("Priority" with downward arrow) and text "High → Low".
 * - Tickets table columns: Ticket ID, Title, Priority, Owner, Last updated.
 * - Initial state: unsorted.
 *
 * Distractors: a "View settings" link (non-interactive).
 * Success: Priority sorted descending.
 */

import React, { useState, useEffect } from 'react';
import { Table, Card, Tag } from 'antd';
import { ArrowDownOutlined } from '@ant-design/icons';
import type { ColumnsType, SorterResult } from 'antd/es/table/interface';
import type { TaskComponentProps, SortModel } from '../types';

interface TicketData {
  key: string;
  ticketId: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  owner: string;
  lastUpdated: string;
}

const priorityOrder = { High: 3, Medium: 2, Low: 1 };

const ticketsData: TicketData[] = [
  { key: '1', ticketId: 'TKT-101', title: 'Login page not loading', priority: 'High', owner: 'Alice', lastUpdated: '2024-02-14' },
  { key: '2', ticketId: 'TKT-102', title: 'Update user profile API', priority: 'Medium', owner: 'Bob', lastUpdated: '2024-02-13' },
  { key: '3', ticketId: 'TKT-103', title: 'Fix typo in footer', priority: 'Low', owner: 'Carol', lastUpdated: '2024-02-12' },
  { key: '4', ticketId: 'TKT-104', title: 'Database connection timeout', priority: 'High', owner: 'David', lastUpdated: '2024-02-15' },
  { key: '5', ticketId: 'TKT-105', title: 'Add dark mode support', priority: 'Medium', owner: 'Emma', lastUpdated: '2024-02-10' },
  { key: '6', ticketId: 'TKT-106', title: 'Email notifications failing', priority: 'High', owner: 'Frank', lastUpdated: '2024-02-11' },
  { key: '7', ticketId: 'TKT-107', title: 'Improve search performance', priority: 'Medium', owner: 'Grace', lastUpdated: '2024-02-09' },
  { key: '8', ticketId: 'TKT-108', title: 'Update documentation', priority: 'Low', owner: 'Henry', lastUpdated: '2024-02-08' },
];

const priorityColors: Record<TicketData['priority'], string> = {
  High: 'red',
  Medium: 'orange',
  Low: 'green',
};

export default function T07({ onSuccess }: TaskComponentProps) {
  const [sortedInfo, setSortedInfo] = useState<SorterResult<TicketData>>({});

  const columns: ColumnsType<TicketData> = [
    { title: 'Ticket ID', dataIndex: 'ticketId', key: 'ticketId', width: 100 },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      sorter: (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
      sortOrder: sortedInfo.columnKey === 'priority' ? sortedInfo.order : null,
      render: (priority: TicketData['priority']) => <Tag color={priorityColors[priority]}>{priority}</Tag>,
    },
    { title: 'Owner', dataIndex: 'owner', key: 'owner' },
    { title: 'Last updated', dataIndex: 'lastUpdated', key: 'lastUpdated' },
  ];

  const handleChange = (_pagination: unknown, _filters: unknown, sorter: SorterResult<TicketData> | SorterResult<TicketData>[]) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    setSortedInfo(singleSorter || {});
  };

  // Check success condition
  useEffect(() => {
    if (sortedInfo.columnKey === 'priority' && sortedInfo.order === 'descend') {
      onSuccess();
    }
  }, [sortedInfo, onSuccess]);

  const sortModel: SortModel = sortedInfo.columnKey && sortedInfo.order
    ? [{ column_key: String(sortedInfo.columnKey), direction: sortedInfo.order === 'ascend' ? 'asc' : 'desc', priority: 1 }]
    : [];

  return (
    <Card style={{ width: 850 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontWeight: 500 }}>Tickets</span>
        <span style={{ color: '#1677ff', cursor: 'default' }}>View settings</span>
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <Table
            dataSource={ticketsData}
            columns={columns}
            pagination={false}
            size="middle"
            rowKey="key"
            onChange={handleChange}
            data-testid="table-tickets"
            data-sort-model={JSON.stringify(sortModel)}
          />
        </div>
        <div
          style={{
            width: 140,
            padding: 16,
            background: '#fafafa',
            borderRadius: 8,
            border: '1px solid #e8e8e8',
          }}
          data-reference-sort="priority:desc"
        >
          <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Reference</div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 8px',
              background: '#fff',
              border: '1px solid #d9d9d9',
              borderRadius: 4,
              fontSize: 13,
              marginBottom: 8,
            }}
          >
            <span>Priority</span>
            <ArrowDownOutlined style={{ fontSize: 10 }} />
          </div>
          <div style={{ fontSize: 12, color: '#666' }}>High → Low</div>
        </div>
      </div>
    </Card>
  );
}
