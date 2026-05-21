'use client';

/**
 * pagination-antd-T02: Navigate using next button twice
 * 
 * Centered isolated card titled "Articles".
 * Currently on page 1 of 10 pages.
 * Goal is to click next (>) button twice to reach page 3.
 */

import React, { useState } from 'react';
import { Card, Pagination, List, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text, Title } = Typography;

// Sample articles
const articles = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  title: `Article ${i + 1}`,
  summary: `Summary of article ${i + 1}...`,
}));

export default function T02({ onSuccess }: TaskComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [completed, setCompleted] = useState(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (page === 3 && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  const paginatedArticles = articles.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <Card title="Articles" style={{ width: 500 }}>
      <List
        size="small"
        dataSource={paginatedArticles}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <List.Item.Meta
              title={item.title}
              description={item.summary}
            />
          </List.Item>
        )}
        style={{ marginBottom: 16, maxHeight: 200, overflow: 'auto' }}
      />
      <Pagination
        current={currentPage}
        total={100}
        pageSize={10}
        onChange={handlePageChange}
        showSizeChanger={false}
        data-testid="antd-pagination-articles"
      />
      <div style={{ marginTop: 12 }}>
        <Text>Current page: {currentPage} of 10</Text>
      </div>
    </Card>
  );
}
