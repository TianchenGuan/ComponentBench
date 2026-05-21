'use client';

/**
 * pagination-antd-T06: Navigate to page 3 in dark theme table
 * 
 * Dark theme table_cell layout titled "System Logs".
 * Compact data table with Ant Design Pagination.
 * Goal is to click page 3.
 */

import React, { useState } from 'react';
import { Card, Pagination, Table, Typography, ConfigProvider, theme } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

// Sample log data
const logs = Array.from({ length: 50 }, (_, i) => ({
  key: i + 1,
  timestamp: `2024-01-${String((i % 28) + 1).padStart(2, '0')} ${String(i % 24).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}`,
  level: i % 3 === 0 ? 'ERROR' : i % 2 === 0 ? 'WARN' : 'INFO',
  message: `Log entry ${i + 1}`,
}));

const columns = [
  { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp', width: 150 },
  { title: 'Level', dataIndex: 'level', key: 'level', width: 80 },
  { title: 'Message', dataIndex: 'message', key: 'message' },
];

export default function T06({ onSuccess }: TaskComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [completed, setCompleted] = useState(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (page === 3 && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  const paginatedLogs = logs.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <Card 
      title="System Logs" 
      style={{ width: 600 }}
      styles={{ body: { padding: 12 } }}
    >
      <Table
        dataSource={paginatedLogs}
        columns={columns}
        pagination={false}
        size="small"
        style={{ marginBottom: 12 }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>Viewing page {currentPage} of 5</Text>
        <Pagination
          current={currentPage}
          total={50}
          pageSize={10}
          onChange={handlePageChange}
          showSizeChanger={false}
          size="small"
          data-testid="antd-pagination-logs"
        />
      </div>
    </Card>
  );
}
