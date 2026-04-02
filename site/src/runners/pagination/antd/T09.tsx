'use client';

/**
 * pagination-antd-T09: Navigate to specific page in modal
 * 
 * Modal flow layout with Ant Design Modal already open.
 * Modal title: "Select File".
 * Currently on page 1 of 4. Goal is to click page 2.
 */

import React, { useState } from 'react';
import { Modal, Pagination, List, Typography } from 'antd';
import type { TaskComponentProps } from '../types';

const { Text } = Typography;

// Sample files
const files = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  name: `document_${i + 1}.pdf`,
  size: `${Math.floor(Math.random() * 1000) + 100} KB`,
}));

export default function T09({ onSuccess }: TaskComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [completed, setCompleted] = useState(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (page === 2 && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  const paginatedFiles = files.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <Modal
      title="Select File"
      open={true}
      closable={false}
      maskClosable={false}
      footer={null}
      width={500}
    >
      <List
        size="small"
        dataSource={paginatedFiles}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Text>{item.name}</Text>
            <Text type="secondary">{item.size}</Text>
          </List.Item>
        )}
        style={{ marginBottom: 16, maxHeight: 200, overflow: 'auto' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text type="secondary">Page {currentPage} of 4</Text>
        <Pagination
          current={currentPage}
          total={40}
          pageSize={10}
          onChange={handlePageChange}
          showSizeChanger={false}
          size="small"
          data-testid="antd-pagination-modal"
        />
      </div>
    </Modal>
  );
}
