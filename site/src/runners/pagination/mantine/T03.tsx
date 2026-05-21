'use client';

/**
 * pagination-mantine-T03: Jump to first page using edge control
 * 
 * Form section titled "Documents".
 * Mantine Pagination with withEdges enabled.
 * Currently on page 7 of 10. Goal is to click first-page button.
 */

import React, { useState } from 'react';
import { Card, Text, Pagination, Group, Stack, List, Title, Box } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

// Sample documents
const documents = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `document_${i + 1}.pdf`,
  date: `2024-01-${String((i % 28) + 1).padStart(2, '0')}`,
}));

export default function T03({ onSuccess }: TaskComponentProps) {
  const [currentPage, setCurrentPage] = useState(7); // Start at page 7
  const [completed, setCompleted] = useState(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (page === 1 && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  const paginatedDocs = documents.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <Box style={{ width: 500 }}>
      <Title order={4} mb="md">Documents</Title>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="xs" mb="md" style={{ maxHeight: 180, overflow: 'auto' }}>
          {paginatedDocs.map((doc) => (
            <Group key={doc.id} justify="space-between">
              <Text size="sm">{doc.name}</Text>
              <Text size="xs" c="dimmed">{doc.date}</Text>
            </Group>
          ))}
        </Stack>
        <Group justify="space-between" align="center">
          <Text size="sm" c="dimmed">
            Page {currentPage} of 10
          </Text>
          <Pagination
            total={10}
            value={currentPage}
            onChange={handlePageChange}
            withEdges
            data-testid="mantine-pagination-docs"
          />
        </Group>
      </Card>
    </Box>
  );
}
