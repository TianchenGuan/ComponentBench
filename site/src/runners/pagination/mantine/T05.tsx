'use client';

/**
 * pagination-mantine-T05: Navigate in dark theme panel
 * 
 * Dark theme dashboard titled "Analytics Data".
 * Pages 1-8 visible, currently on page 1.
 * Goal is to click page 5.
 */

import React, { useState } from 'react';
import { Card, Text, Pagination, Group, Stack, Title, Box, Progress } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

// Sample analytics data
const analytics = Array.from({ length: 80 }, (_, i) => ({
  id: i + 1,
  metric: `Metric ${i + 1}`,
  value: Math.floor(Math.random() * 100),
}));

export default function T05({ onSuccess }: TaskComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [completed, setCompleted] = useState(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (page === 5 && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  const paginatedAnalytics = analytics.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <Box style={{ width: 500 }}>
      <Title order={4} mb="md">Analytics Data</Title>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="sm" mb="md">
          {paginatedAnalytics.slice(0, 5).map((item) => (
            <Group key={item.id} justify="space-between" align="center">
              <Text size="sm">{item.metric}</Text>
              <Group gap="xs" style={{ width: 150 }}>
                <Progress 
                  value={item.value} 
                  size="sm" 
                  style={{ flex: 1 }} 
                />
                <Text size="xs" c="dimmed" style={{ width: 30 }}>{item.value}%</Text>
              </Group>
            </Group>
          ))}
        </Stack>
        <Group justify="space-between" align="center">
          <Text size="sm" c="dimmed">
            Page {currentPage} of 8
          </Text>
          <Pagination
            total={8}
            value={currentPage}
            onChange={handlePageChange}
            data-testid="mantine-pagination-analytics"
          />
        </Group>
      </Card>
    </Box>
  );
}
