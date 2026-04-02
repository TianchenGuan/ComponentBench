'use client';

/**
 * pagination-mantine-T07: Navigate using previous control
 * 
 * Isolated card in bottom-left titled "Tasks".
 * Currently on page 3 of 5. Goal is to click previous once.
 */

import React, { useState } from 'react';
import { Card, Text, Pagination, Group, Stack, Checkbox } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

// Sample tasks
const tasks = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  title: `Task ${i + 1}`,
  completed: Math.random() > 0.5,
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

  const paginatedTasks = tasks.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 350 }}>
      <Text fw={500} size="lg" mb="md">
        Tasks
      </Text>
      <Stack gap="xs" mb="md" style={{ maxHeight: 180, overflow: 'auto' }}>
        {paginatedTasks.map((task) => (
          <Group key={task.id} justify="space-between">
            <Checkbox 
              label={task.title}
              checked={task.completed}
              readOnly
              size="sm"
            />
          </Group>
        ))}
      </Stack>
      <Group justify="space-between" align="center">
        <Text size="sm" c="dimmed">
          Page {currentPage} of 5
        </Text>
        <Pagination
          total={5}
          value={currentPage}
          onChange={handlePageChange}
          withControls
          data-testid="mantine-pagination-tasks"
        />
      </Group>
    </Card>
  );
}
