'use client';

/**
 * pagination-antd-T03: Jump to page 42 using quick jumper
 * 
 * Form section layout with "Search Results" header.
 * Ant Design Pagination with showQuickJumper enabled.
 * Total 100 pages. Goal is to type "42" and press Enter.
 */

import React, { useState } from 'react';
import { Card, Pagination, List, Typography, Input } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Title } = Typography;

// Sample search results
const results = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  title: `Result ${i + 1}`,
}));

export default function T03({ onSuccess }: TaskComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [completed, setCompleted] = useState(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (page === 42 && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  const paginatedResults = results.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <div style={{ width: 600 }}>
      <Title level={4} style={{ marginBottom: 16 }}>Search Results</Title>
      <Card>
        <List
          size="small"
          dataSource={paginatedResults}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <Text>{item.title}</Text>
            </List.Item>
          )}
          style={{ marginBottom: 16, maxHeight: 150, overflow: 'auto' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text type="secondary">Page {currentPage} of 100</Text>
          <Pagination
            current={currentPage}
            total={1000}
            pageSize={10}
            onChange={handlePageChange}
            showSizeChanger={false}
            showQuickJumper
            data-testid="antd-pagination-search"
          />
        </div>
      </Card>
    </div>
  );
}
