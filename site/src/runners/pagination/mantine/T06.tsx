'use client';

/**
 * pagination-mantine-T06: Compact pagination in top-right
 * 
 * Dashboard layout with compact pagination.
 * Mantine Pagination with size="xs".
 * Currently on page 1 of 8. Goal is to reach page 4.
 */

import React, { useState } from 'react';
import { Card, Text, Pagination, Group, Stack, Box } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T06({ onSuccess }: TaskComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [completed, setCompleted] = useState(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (page === 4 && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  return (
    <Box style={{ width: 320 }}>
      <Group 
        justify="space-between" 
        align="center" 
        mb="sm"
        p="xs"
        style={{ background: '#f8f9fa', borderRadius: 6 }}
      >
        <Text size="sm" fw={500}>Dashboard</Text>
        <Pagination
          total={8}
          value={currentPage}
          onChange={handlePageChange}
          size="xs"
          data-testid="mantine-pagination-toolbar"
        />
      </Group>
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Text fw={500} mb="xs">Page {currentPage} Content</Text>
        <Text size="sm" c="dimmed">
          Showing dashboard data for page {currentPage} of 8.
        </Text>
      </Card>
    </Box>
  );
}
