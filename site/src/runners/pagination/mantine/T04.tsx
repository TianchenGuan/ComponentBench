'use client';

/**
 * pagination-mantine-T04: Navigate to last page
 * 
 * Settings panel titled "Events Log".
 * Mantine Pagination with withEdges.
 * Currently on page 2 of 15. Goal is to click last-page button.
 */

import React, { useState } from 'react';
import { Card, Text, Pagination, Group, Stack, Title, Box, Badge } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

// Sample events
const events = Array.from({ length: 150 }, (_, i) => ({
  id: i + 1,
  type: ['INFO', 'WARNING', 'ERROR'][i % 3],
  message: `Event ${i + 1} occurred`,
  time: `${String(i % 24).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}`,
}));

export default function T04({ onSuccess }: TaskComponentProps) {
  const [currentPage, setCurrentPage] = useState(2); // Start at page 2
  const [completed, setCompleted] = useState(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (page === 15 && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  const paginatedEvents = events.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <Box style={{ width: 500 }}>
      <Title order={4} mb="md">Events Log</Title>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="xs" mb="md" style={{ maxHeight: 200, overflow: 'auto' }}>
          {paginatedEvents.map((event) => (
            <Group key={event.id} justify="space-between">
              <Group gap="xs">
                <Badge 
                  size="xs" 
                  color={event.type === 'ERROR' ? 'red' : event.type === 'WARNING' ? 'yellow' : 'blue'}
                >
                  {event.type}
                </Badge>
                <Text size="sm">{event.message}</Text>
              </Group>
              <Text size="xs" c="dimmed">{event.time}</Text>
            </Group>
          ))}
        </Stack>
        <Group justify="space-between" align="center">
          <Text size="sm" c="dimmed">
            Page {currentPage} of 15
          </Text>
          <Pagination
            total={15}
            value={currentPage}
            onChange={handlePageChange}
            withEdges
            data-testid="mantine-pagination-events"
          />
        </Group>
      </Card>
    </Box>
  );
}
