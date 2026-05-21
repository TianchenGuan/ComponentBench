'use client';

/**
 * pagination-antd-T07: Navigate using previous button
 * 
 * Isolated card in bottom-left titled "Comments".
 * Currently on page 3 of 5. Goal is to click previous once.
 */

import React, { useState } from 'react';
import { Card, Pagination, List, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

// Sample comments
const comments = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  author: `User ${i + 1}`,
  content: `This is comment ${i + 1}. Great content!`,
}));

export default function T07({ onSuccess }: TaskComponentProps) {
  const [currentPage, setCurrentPage] = useState(3); // Start at page 3
  const [completed, setCompleted] = useState(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (page === 2 && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  const paginatedComments = comments.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <Card title="Comments" style={{ width: 400 }}>
      <List
        size="small"
        dataSource={paginatedComments}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <List.Item.Meta
              title={item.author}
              description={item.content}
            />
          </List.Item>
        )}
        style={{ marginBottom: 16, maxHeight: 180, overflow: 'auto' }}
      />
      <Pagination
        current={currentPage}
        total={50}
        pageSize={10}
        onChange={handlePageChange}
        showSizeChanger={false}
        data-testid="antd-pagination-comments"
      />
      <div style={{ marginTop: 12 }}>
        <Text>Current page: {currentPage}</Text>
      </div>
    </Card>
  );
}
