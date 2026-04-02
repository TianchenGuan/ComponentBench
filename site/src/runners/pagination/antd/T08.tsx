'use client';

/**
 * pagination-antd-T08: Small pagination in top-right toolbar
 * 
 * Dashboard layout with small pagination.
 * Ant Design Pagination with simple mode (shows "1 / 10" format).
 * Goal is to reach page 5.
 */

import React, { useState } from 'react';
import { Card, Pagination, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Title } = Typography;

export default function T08({ onSuccess }: TaskComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [completed, setCompleted] = useState(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (page === 5 && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  return (
    <div style={{ width: 350 }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 16,
        padding: '8px 12px',
        background: '#fafafa',
        borderRadius: 6,
      }}>
        <Text strong>Dashboard</Text>
        <Pagination
          simple
          current={currentPage}
          total={100}
          pageSize={10}
          onChange={handlePageChange}
          size="small"
          data-testid="antd-pagination-toolbar"
        />
      </div>
      <Card size="small">
        <Title level={5}>Page {currentPage} Content</Title>
        <Text type="secondary">
          Showing dashboard data for page {currentPage} of 10.
        </Text>
      </Card>
    </div>
  );
}
