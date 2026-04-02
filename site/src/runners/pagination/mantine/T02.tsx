'use client';

/**
 * pagination-mantine-T02: Navigate using next control
 * 
 * Centered isolated card titled "Notifications".
 * Mantine Pagination with withControls enabled.
 * Currently on page 1 of 6. Goal is to click next twice.
 */

import React, { useState } from 'react';
import { Card, Text, Pagination, Group, Stack, List } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

// Sample notifications
const notifications = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  title: `Notification ${i + 1}`,
  time: `${i % 24}h ago`,
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

  const paginatedNotifications = notifications.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder style={{ width: 400 }}>
      <Text fw={500} size="lg" mb="md">
        Notifications
      </Text>
      <Stack gap="xs" mb="md" style={{ maxHeight: 180, overflow: 'auto' }}>
        {paginatedNotifications.map((notif) => (
          <Group key={notif.id} justify="space-between">
            <Text size="sm">{notif.title}</Text>
            <Text size="xs" c="dimmed">{notif.time}</Text>
          </Group>
        ))}
      </Stack>
      <Group justify="space-between" align="center">
        <Text size="sm" c="dimmed">
          Page {currentPage} of 6
        </Text>
        <Pagination
          total={6}
          value={currentPage}
          onChange={handlePageChange}
          withControls
          data-testid="mantine-pagination-notifications"
        />
      </Group>
    </Card>
  );
}
