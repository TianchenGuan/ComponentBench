'use client';

/**
 * table_static-antd-T05: Scroll to find and select a log entry
 *
 * The page is a form_section titled "Security" with a few non-interactive settings descriptions above
 * a read-only Activity Log table (Ant Design Table). Clutter is low: there are headings and two disabled toggle rows (not
 * required), but the Activity Log table is the only element that changes state for success. The table has a fixed height
 * and an internal vertical scrollbar (table body scroll). Columns: Time, Event ID, Actor, and Action. There are ~100 rows;
 * only ~10 are visible without scrolling. Rows are single-select: clicking a row highlights it and sets aria-selected="true".
 * The target row (Event ID EVT-0098) is not visible initially and requires scrolling within the table body. No pagination,
 * sorting, or filters are enabled.
 */

import React, { useState } from 'react';
import { Table, Card, Switch, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Title, Text } = Typography;

interface ActivityLogData {
  key: string;
  time: string;
  eventId: string;
  actor: string;
  action: string;
}

// Generate 100 rows of activity log data
const generateActivityLogData = (): ActivityLogData[] => {
  const actors = ['admin@company.com', 'user1@company.com', 'system', 'api-service', 'scheduler'];
  const actions = ['Login', 'Logout', 'Password change', 'Permission update', 'File access', 'Config change', 'API call', 'Export data'];
  
  return Array.from({ length: 100 }, (_, i) => ({
    key: `EVT-00${String(i + 1).padStart(2, '0')}`,
    time: `2024-12-${String(20 - Math.floor(i / 10)).padStart(2, '0')} ${String(10 + (i % 12)).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}`,
    eventId: `EVT-00${String(i + 1).padStart(2, '0')}`,
    actor: actors[i % actors.length],
    action: actions[i % actions.length],
  }));
};

const activityLogData = generateActivityLogData();

const columns = [
  { title: 'Time', dataIndex: 'time', key: 'time', width: 150 },
  { title: 'Event ID', dataIndex: 'eventId', key: 'eventId', width: 100 },
  { title: 'Actor', dataIndex: 'actor', key: 'actor', width: 180 },
  { title: 'Action', dataIndex: 'action', key: 'action' },
];

export default function T05({ onSuccess }: TaskComponentProps) {
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null);

  const handleRowClick = (record: ActivityLogData) => {
    setSelectedRowKey(record.key);
    if (record.key === 'EVT-0098') {
      onSuccess();
    }
  };

  return (
    <Card style={{ width: 700 }}>
      <Title level={4} style={{ marginTop: 0, marginBottom: 16 }}>Security</Title>
      
      {/* Low clutter: some non-interactive settings */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <Text strong>Two-factor authentication</Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <Switch disabled defaultChecked />
            <Text type="secondary">Enabled for all users</Text>
          </div>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <Text strong>Session timeout</Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <Switch disabled />
            <Text type="secondary">30 minutes of inactivity</Text>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 12, fontWeight: 500 }}>Activity Log</div>
      <Table
        dataSource={activityLogData}
        columns={columns}
        pagination={false}
        size="small"
        rowKey="key"
        scroll={{ y: 300 }}
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
