'use client';

/**
 * pagination-antd-T05: Navigate to last page via ellipsis
 * 
 * Settings panel layout titled "Reports Archive".
 * Ant Design Pagination showing pages 1, 2, 3, ..., 50.
 * Goal is to reach page 50 by any method.
 */

import React, { useState } from 'react';
import { Card, Pagination, List, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Title } = Typography;

// Sample reports
const reports = Array.from({ length: 500 }, (_, i) => ({
  id: i + 1,
  name: `Report ${i + 1}`,
  date: `2024-${String(Math.floor(i / 40) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
}));

export default function T05({ onSuccess }: TaskComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [completed, setCompleted] = useState(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (page === 50 && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  const paginatedReports = reports.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <div style={{ width: 600 }}>
      <Title level={4} style={{ marginBottom: 16 }}>Reports Archive</Title>
      <Card>
        <List
          size="small"
          dataSource={paginatedReports}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <Text>{item.name}</Text>
              <Text type="secondary">{item.date}</Text>
            </List.Item>
          )}
          style={{ marginBottom: 16, maxHeight: 200, overflow: 'auto' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="secondary">Page {currentPage} of 50</Text>
          <Pagination
            current={currentPage}
            total={500}
            pageSize={10}
            onChange={handlePageChange}
            showSizeChanger={false}
            data-testid="antd-pagination-reports"
          />
        </div>
      </Card>
    </div>
  );
}
