'use client';

/**
 * pagination-mantine-T10: Match reference page in dark theme
 * 
 * Dark theme form section titled "Match the page".
 * Target sample shows pagination with page 6 highlighted.
 * Goal is to click page 6 to match target.
 */

import React, { useState } from 'react';
import { Card, Text, Pagination, Group, Stack, Divider, Box, Title } from '@mantine/core';
import '@mantine/core/styles.css';
import type { TaskComponentProps } from '../types';

export default function T10({ onSuccess }: TaskComponentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [completed, setCompleted] = useState(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (page === 6 && !completed) {
      setCompleted(true);
      onSuccess();
    }
  };

  return (
    <Box style={{ width: 500 }}>
      <Title order={4} mb="md">Match the page</Title>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        {/* Target sample */}
        <Box mb="md">
          <Text size="sm" c="dimmed" mb="xs">
            Target sample:
          </Text>
          <Box 
            p="sm" 
            style={{ 
              background: '#2d2d2d', 
              borderRadius: 6,
              pointerEvents: 'none',
            }}
            data-testid="mantine-target-page-6"
          >
            {/* Static display showing page 6 highlighted */}
            <Group justify="center" gap={4}>
              {[1, 2, '...', 5, 6, 7, '...', 10].map((p, i) => (
                <Box
                  key={i}
                  style={{
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 4,
                    fontSize: 12,
                    background: p === 6 ? '#228be6' : 'transparent',
                    color: p === 6 ? '#fff' : '#aaa',
                    border: p === 6 ? 'none' : '1px solid #555',
                  }}
                >
                  {p}
                </Box>
              ))}
            </Group>
          </Box>
        </Box>

        <Divider my="md" />

        {/* Interactive pagination */}
        <Box mb="md">
          <Text size="sm" mb="xs">
            Navigate to match:
          </Text>
          <Pagination
            total={10}
            value={currentPage}
            onChange={handlePageChange}
            data-testid="mantine-pagination-match"
          />
        </Box>

        <Box mt="md">
          {currentPage === 6 ? (
            <Text c="green" fw={500}>✓ Match found!</Text>
          ) : (
            <Text c="dimmed" size="sm">Current page: {currentPage}</Text>
          )}
        </Box>
      </Card>
    </Box>
  );
}
