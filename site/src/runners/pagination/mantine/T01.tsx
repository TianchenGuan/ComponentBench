'use client';

/**
 * pagination-mantine-T01: Navigate to page 4 (direct click)
 * 
 * Centered isolated card titled "Team Members".
 * Mantine Pagination showing pages 1-5 with page 1 active.
 * Goal is to click page 4.
 */

import React, { useState } from 'react';
import { Card, Text, Pagination, Stack, Group, List } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

// Sample team members
const members = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Member ${i + 1}`,
  role: ['Developer', 'Designer', 'Manager', 'Analyst'][i % 4],
}));

export default function T01({ onSuccess }: TaskComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [completed, setCompleted] = useState(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (page === 4 && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  const paginatedMembers = members.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="md">
        Team Members
      </Text>
      <List spacing="xs" size="sm" mb="md" style={{ maxHeight: 180, overflow: 'auto' }}>
        {paginatedMembers.map((member) => (
          <List.Item key={member.id}>
            <Text size="sm">{member.name}</Text>
            <Text size="xs" c="dimmed">{member.role}</Text>
          </List.Item>
        ))}
      </List>
      <Group justify="space-between" align="center">
        <Text size="sm" c="dimmed">
          Page {currentPage} of 5
        </Text>
        <Pagination
          total={5}
          value={currentPage}
          onChange={handlePageChange}
          data-testid="mantine-pagination-members"
        />
      </Group>
    </Card>
  );
}
