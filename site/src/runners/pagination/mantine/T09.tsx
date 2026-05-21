'use client';

/**
 * pagination-mantine-T09: Navigate in modal
 * 
 * Modal flow with Mantine Modal already open.
 * Modal title: "Select File".
 * Currently on page 1 of 4. Goal is to click page 2.
 */

import React, { useState } from 'react';
import { Modal, Text, Pagination, Group, Stack, List } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

// Sample files
const files = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  name: `file_${i + 1}.txt`,
  size: `${Math.floor(Math.random() * 500 + 10)} KB`,
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
      opened={true}
      onClose={() => {}}
      title="Select File"
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
      size="md"
    >
      <Stack gap="xs" mb="md" style={{ maxHeight: 200, overflow: 'auto' }}>
        {paginatedFiles.map((file) => (
          <Group key={file.id} justify="space-between">
            <Text size="sm">{file.name}</Text>
            <Text size="xs" c="dimmed">{file.size}</Text>
          </Group>
        ))}
      </Stack>
      <Group justify="space-between" align="center">
        <Text size="sm" c="dimmed">
          Page {currentPage} of 4
        </Text>
        <Pagination
          total={4}
          value={currentPage}
          onChange={handlePageChange}
          size="sm"
          data-testid="mantine-pagination-modal"
        />
      </Group>
    </Modal>
  );
}
