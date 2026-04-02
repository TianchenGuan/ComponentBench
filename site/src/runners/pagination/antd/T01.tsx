'use client';

/**
 * pagination-antd-T01: Navigate to page 4 (direct click)
 * 
 * Centered isolated card titled "Data Table".
 * Ant Design Pagination showing pages 1-5 with page 1 active.
 * Goal is to click page 4.
 */

import React, { useState } from 'react';
import { Card, Pagination, Table, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

// Sample data for the table
const dataSource = Array.from({ length: 50 }, (_, i) => ({
  key: i + 1,
  name: `Item ${i + 1}`,
  status: i % 2 === 0 ? 'Active' : 'Inactive',
}));

const columns = [
  { title: 'ID', dataIndex: 'key', key: 'key' },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
];

export default function T01({ onSuccess }: TaskComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [completed, setCompleted] = useState(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (page === 4 && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  const paginatedData = dataSource.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <Card title="Data Table" style={{ width: 500 }}>
      <Table
        dataSource={paginatedData}
        columns={columns}
        pagination={false}
        size="small"
        style={{ marginBottom: 16 }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text type="secondary">
          Showing {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, 50)} of 50 items
        </Text>
        <Pagination
          current={currentPage}
          total={50}
          pageSize={10}
          onChange={handlePageChange}
          showSizeChanger={false}
          data-testid="antd-pagination-main"
        />
      </div>
      <div style={{ marginTop: 12 }}>
        <Text>Viewing page {currentPage}</Text>
      </div>
    </Card>
  );
}
